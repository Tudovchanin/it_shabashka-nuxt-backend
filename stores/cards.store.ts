import type { Models } from 'appwrite';
import type { DataCommentAppWrite } from './comments.store';
import { DB_ID, DB_COLLECTION_PROJECTS_ID } from '~/constants/app.constants';
import { Permission, Role, Query } from "appwrite";

// тестовый 
const dataTest:DataCardAppWrite[] = [
  {   "color":"white",
      "client_email": 'sotto36623@gmail.com',
      "client_phone": "+7(953)121-69-90",
      "name": "MICH",
      "price": 233330,
      "status": "REVIEW",
      "description": "Бло",
      "client": "Ирина",
      "userId": "67c95cc5001336553452",
      "link": "https://www.youtube.com/shorts/Rq4bjhVsZlo",
      "deadline": "2025-03-21",
      "$id": "67e12fc700104ec6b738",
      "$createdAt": "2025-03-24T10:11:19.968+00:00",
      "$updatedAt": "2025-03-25T12:38:43.854+00:00",
      "$permissions": [
          "read(\"user:67c95cc5001336553452\")",
          "update(\"user:67c95cc5001336553452\")",
          "delete(\"user:67c95cc5001336553452\")"
      ],
      "comments": [
          {     "projectId":"67c95cc5001336553452",
              "text": "kkkjuiu",
              "$id": "67e1d1270007fb5cb113",
              "$createdAt": "2025-03-24T21:39:51.361+00:00",
              "$updatedAt": "2025-03-24T21:39:51.361+00:00",
              "$permissions": [
                  "read(\"user:67c95cc5001336553452\")",
                  "update(\"user:67c95cc5001336553452\")",
                  "delete(\"user:67c95cc5001336553452\")"
              ],
              "$databaseId": "crm-28",
              "$collectionId": "comments"
          },
          {   "projectId":"67c95cc5001336553452",
              "text": "lllkkjk",
              "$id": "67e1d12c000ac3060b52",
              "$createdAt": "2025-03-24T21:39:56.334+00:00",
              "$updatedAt": "2025-03-24T21:39:56.334+00:00",
              "$permissions": [
                  "read(\"user:67c95cc5001336553452\")",
                  "update(\"user:67c95cc5001336553452\")",
                  "delete(\"user:67c95cc5001336553452\")"
              ],
              "$databaseId": "crm-28",
              "$collectionId": "comments"
          },
          {     "projectId":"67c95cc5001336553452",
              "text": "klllokm  jiii",
              "$id": "67e1d132002187db3ba9",
              "$createdAt": "2025-03-24T21:40:02.790+00:00",
              "$updatedAt": "2025-03-24T21:40:02.790+00:00",
              "$permissions": [
                  "read(\"user:67c95cc5001336553452\")",
                  "update(\"user:67c95cc5001336553452\")",
                  "delete(\"user:67c95cc5001336553452\")"
              ],
              "$databaseId": "crm-28",
              "$collectionId": "comments"
          },
          {     "projectId":"67c95cc5001336553452",
              "text": ";;;;;;;;; jii",
              "$id": "67e1d19300024ce1f294",
              "$createdAt": "2025-03-24T21:41:39.601+00:00",
              "$updatedAt": "2025-03-24T21:41:39.601+00:00",
              "$permissions": [
                  "read(\"user:67c95cc5001336553452\")",
                  "update(\"user:67c95cc5001336553452\")",
                  "delete(\"user:67c95cc5001336553452\")"
              ],
              "$databaseId": "crm-28",
              "$collectionId": "comments"
          },
          {     "projectId":"67c95cc5001336553452",
              "text": "9766 jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj",
              "$id": "67e1d19e0005dbde97a2",
              "$createdAt": "2025-03-24T21:41:50.535+00:00",
              "$updatedAt": "2025-03-24T21:41:50.535+00:00",
              "$permissions": [
                  "read(\"user:67c95cc5001336553452\")",
                  "update(\"user:67c95cc5001336553452\")",
                  "delete(\"user:67c95cc5001336553452\")"
              ],
              "$databaseId": "crm-28",
              "$collectionId": "comments"
          },
          {     "projectId":"67c95cc5001336553452",
              "text": "lll 87",
              "$id": "67e1d1a90000730c7f97",
              "$createdAt": "2025-03-24T21:42:01.505+00:00",
              "$updatedAt": "2025-03-24T21:42:01.505+00:00",
              "$permissions": [
                  "read(\"user:67c95cc5001336553452\")",
                  "update(\"user:67c95cc5001336553452\")",
                  "delete(\"user:67c95cc5001336553452\")"
              ],
              "$databaseId": "crm-28",
              "$collectionId": "comments"
          },
          {   "projectId":"67c95cc5001336553452",
              "text": "''''ll klk",
              "$id": "67e1d3860032d1ff8444",
              "$createdAt": "2025-03-24T21:49:59.122+00:00",
              "$updatedAt": "2025-03-24T21:49:59.122+00:00",
              "$permissions": [
                  "read(\"user:67c95cc5001336553452\")",
                  "update(\"user:67c95cc5001336553452\")",
                  "delete(\"user:67c95cc5001336553452\")"
              ],
              "$databaseId": "crm-28",
              "$collectionId": "comments"
          },
          {   "projectId":"67c95cc5001336553452",
              "text": "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
              "$id": "67e1e5a3000bd88e9083",
              "$createdAt": "2025-03-24T23:07:15.601+00:00",
              "$updatedAt": "2025-03-24T23:07:15.601+00:00",
              "$permissions": [
                  "read(\"user:67c95cc5001336553452\")",
                  "update(\"user:67c95cc5001336553452\")",
                  "delete(\"user:67c95cc5001336553452\")"
              ],
              "$databaseId": "crm-28",
              "$collectionId": "comments"
          },
          {     "projectId":"67c95cc5001336553452",
              "text": "hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh",
              "$id": "67e1e60e00293e0066d6",
              "$createdAt": "2025-03-24T23:09:02.967+00:00",
              "$updatedAt": "2025-03-24T23:09:02.967+00:00",
              "$permissions": [
                  "read(\"user:67c95cc5001336553452\")",
                  "update(\"user:67c95cc5001336553452\")",
                  "delete(\"user:67c95cc5001336553452\")"
              ],
              "$databaseId": "crm-28",
              "$collectionId": "comments"
          },
          {     "projectId":"67c95cc5001336553452",
              "text": "lll",
              "$id": "67e1ebbe000ee726adb0",
              "$createdAt": "2025-03-24T23:33:18.480+00:00",
              "$updatedAt": "2025-03-24T23:33:18.480+00:00",
              "$permissions": [
                  "read(\"user:67c95cc5001336553452\")",
                  "update(\"user:67c95cc5001336553452\")",
                  "delete(\"user:67c95cc5001336553452\")"
              ],
              "$databaseId": "crm-28",
              "$collectionId": "comments"
          }
      ],
      "$databaseId": "crm-28",
      "$collectionId": "projects"
  },
  {   "color":"black",
  "client_email": '',
  "client_phone": "",
      "name": "диза",
      "price": 6544000,
      "status": "NEW",
      "description": "сделать дизайн телефона в темны",
      "client": "apple",
      "userId": "67c95cc5001336553452",
      "link": "https://www.figma.com/files/team/1304686279344984745/recents-and-sharing?fuid=1244927138658396662",
      "deadline": "2025-03-30",
      "$id": "67e169a4000e8b2a8416",
      "$createdAt": "2025-03-24T14:18:13.529+00:00",
      "$updatedAt": "2025-03-24T22:34:57.246+00:00",
      "$permissions": [
          "read(\"user:67c95cc5001336553452\")",
          "update(\"user:67c95cc5001336553452\")",
          "delete(\"user:67c95cc5001336553452\")"
      ],
      "comments": [],
      "$databaseId": "crm-28",
      "$collectionId": "projects"
  },
  {   "color":"black",
  "client_email": '',
  "client_phone": "",
      "name": "лендинг",
      "price": 0,
      "status": "REVISION",
      "description": "jjjjjjjjjjjjjjjjjjjjjjjj",
      "client": "Ирина",
      "userId": "67c95cc5001336553452",
      "link": "",
      "deadline": "",
      "$id": "67e185d5001bfd63844f",
      "$createdAt": "2025-03-24T16:18:29.777+00:00",
      "$updatedAt": "2025-03-24T16:18:29.777+00:00",
      "$permissions": [
          "read(\"user:67c95cc5001336553452\")",
          "update(\"user:67c95cc5001336553452\")",
          "delete(\"user:67c95cc5001336553452\")"
      ],
      "comments": [],
      "$databaseId": "crm-28",
      "$collectionId": "projects"
  }
]



 export const ProjectStatus = {
  NEW : 'NEW',
  IN_PROGRESS : 'IN_PROGRESS',
  REVISION : 'REVISION',
  REVIEW : 'REVIEW',
  DONE : 'DONE'
} as const

export type TypeProjectStatus = (typeof ProjectStatus)[keyof typeof ProjectStatus]

export type DataCardAppWrite = Models.Document & {
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
  // $createdAt: string; // // Дата создания (уже есть в Models.Document, но можно переопределить)
};

// 2025-05-01

export const useProjectsStore = defineStore('projects', () => {

  const authStore = useAuthStore();
  const loadStore = useIsLoadingStore();

  const projects = ref<DataCardAppWrite[]>([]);
 

  const error = ref<Error | null>(null);

  const getProjectsByUser = async () => {
    error.value = null;
    try {
      const response = await DB.listDocuments(
        DB_ID,
        DB_COLLECTION_PROJECTS_ID,
        [
          Query.equal('userId', authStore.user.$id)
        ]
      );

      projects.value = response.documents as DataCardAppWrite[];
      console.log('Документы пользователя store:', projects.value);

    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e;
      } else {
        error.value = new Error(String(error));
      }
      console.error('Ошибка при получении документов:', error);
    } finally {
    }
    console.log('query cards');
    
    // projects.value = dataTest 
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
