import type { Project } from "./projects.store";


export type Comment = {
  id: string;
  text: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  card?: Project;
};


export const useCommentsStore = defineStore('comments', () => {

  const authStore = useAuthStore();
  const loadStore = useIsLoadingStore();


  const comments = ref<Comment[]>([]);
  const error = ref<Error | null>(null);

  const getCommentsByProject = async (projectId:string) => {
    error.value = null;
  
    // try {
    //   const response = await DB.listDocuments(
    //     DB_ID,
    //     DB_COLLECTION_COMMENTS_ID,
    //     [
    //       Query.equal('projectId', projectId )
    //     ]
    //   );

    //   comments.value = response.documents as DataCommentAppWrite[];
    //   console.log('Документы пользователя store:', comments.value);

    // } catch (e: unknown) {
    //   if (e instanceof Error) {
    //     error.value = e;
    //   } else {
    //     error.value = new Error(String(error));
    //   }
    //   console.error('Ошибка при получении документов:', error);
    // }
  };

  const createComment = async (data: {text: string; projectId: string}) => {
    // try {
    //   loadStore.set(true);
    //   const response = await DB.createDocument(
    //     DB_ID,
    //     DB_COLLECTION_COMMENTS_ID,
    //     ID.unique(),
    //     data,
    //     [
    //       Permission.read(Role.user(authStore.user.$id)),
    //       Permission.update(Role.user(authStore.user.$id)),
    //       Permission.delete(Role.user(authStore.user.$id))
    //     ]
    //   );
    //   console.log('Document created:', response);
    // } catch (error: unknown) {
    //   console.error('Error creating document:', error);
    // } finally {
    //   loadStore.set(false);
    // }
  };

  const deleteComment = async (commentId: string) => {
   
    // try {
    //   loadStore.set(true);
    //   await DB.deleteDocument(
    //     DB_ID,
    //     DB_COLLECTION_COMMENTS_ID,
    //     commentId
    //   );

    // } catch (error: unknown) {
    //   console.error('Error deleting document:', error);
    // } finally {
    //   loadStore.set(false);
    // }
  };

  return { createComment, getCommentsByProject, deleteComment, comments};
});
