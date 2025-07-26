import type { Models } from 'appwrite';
import type { DataCommentAppWrite } from './comments.store';
import { DB_ID, DB_COLLECTION_PROJECTS_ID } from '~/constants/app.constants';
import { Permission, Role, Query } from "appwrite";


 export const ProjectStatus = {
  NEW : 'NEW',
  IN_PROGRESS : 'IN_PROGRESS',
  REVISION : 'REVISION',
  REVIEW : 'REVIEW',
  DONE : 'DONE'
} as const

export type TypeProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus]

export type DataProjectAppWrite = Models.Document & {
  color:string;
  name: string;
  price: number;
  status: TypeProjectStatus;
  description?: string;
  client: string;
  client_email?: string;
  client_phone?: string;
  userId: string;
  link?: string;
  deadline?: string;
  comments?: DataCommentAppWrite[]
};


export const useProjectsStore = defineStore('projects', () => {

  const authStore = useAuthStore();
  const loadStore = useIsLoadingStore();

  const projects = ref<DataProjectAppWrite[]>([]);
 

  const error = ref<Error | null>(null);

  const getProjectsByUser = async () => {
    error.value = null;

    const useMock = import.meta.env.VITE_USE_MOCK === 'true';


  if (useMock) {
    try {
      const { dataTest } = await import('~/mock/mockData');
      projects.value = dataTest;
      console.log('Используем моковые данные');
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
      console.error('Ошибка при загрузке моковых данных:', error.value);
    }
    return;
  }

    try {
      const response = await DB.listDocuments(
        DB_ID,
        DB_COLLECTION_PROJECTS_ID,
        [
          Query.equal('userId', authStore.user.$id)
        ]
      );

      projects.value = response.documents as DataProjectAppWrite[];
      console.log('Документы пользователя store:', projects.value);

    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e;
      } else {
        error.value = new Error(String(error));
      }
      console.error('Ошибка при получении документов:', error);
    }
  
  }

  const createProject = async (data: any) => {
    loadStore.set(true);
    try {
      const response = await DB.createDocument(
        DB_ID,
        DB_COLLECTION_PROJECTS_ID,
        ID.unique(),
        { ...data, userId: authStore.user.$id },
        [
          Permission.read(Role.user(authStore.user.$id)),
          Permission.update(Role.user(authStore.user.$id)),
          Permission.delete(Role.user(authStore.user.$id))
        ]
      );
      console.log('Document created:', response);

      await getProjectsByUser(); 
      
    } catch (error: unknown) {
      console.error('Error creating document:', error);
    } finally {
    loadStore.set(false)
    }
  };

  const updateProject = async (projectId: string, data: any) => {
    loadStore.set(true);
    try {
      const response = await DB.updateDocument(
        DB_ID,
        DB_COLLECTION_PROJECTS_ID,
        projectId,
        data
      );
      console.log('Document updated:', response);
      await getProjectsByUser();
    } catch (error: unknown) {
      console.error('Error updating document:', error);
    } finally {
      loadStore.set(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    loadStore.set(true);
    try {
      await DB.deleteDocument(
        DB_ID,
        DB_COLLECTION_PROJECTS_ID,
        projectId
      );
      console.log('Document deleted');
      await getProjectsByUser(); 
    } catch (error: unknown) {
      console.error('Error deleting document:', error);
    } finally {
      loadStore.set(false);
    }
  };

  return { projects, error, getProjectsByUser, createProject, updateProject, deleteProject };
});
