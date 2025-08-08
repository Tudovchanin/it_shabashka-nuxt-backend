


import type { Comment } from "./comments.store";

export type Project = {
  id: string;
  color: string;
  name: string;
  price: number;
  status: TypeProjectStatus;
  description: string | null;
  client: string;
  client_email: string | null;
  client_phone: string | null;
  userId: string;
  link: string | null;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  comments?: Comment[];
  user?: User;
};


export type ProjectCreateFrontend = Pick<
  Project,
  'name' |
  'client' |
  'link' |
  'price' |
  'status' |
  'description' |
  'client_email' |
  'client_phone'
> & {
  deadline?: string | null;
};



export type UpdateProjectFrontend = Partial<ProjectCreateFrontend> & { 
  id: string; 
};



export const ProjectStatus = {
  NEW: "NEW",
  IN_PROGRESS: "IN_PROGRESS",
  REVISION: "REVISION",
  REVIEW: "REVIEW",
  DONE: "DONE",
} as const;

export type TypeProjectStatus =
  (typeof ProjectStatus)[keyof typeof ProjectStatus];


export const useProjectsStore = defineStore("projects", () => {
  const authStore = useAuthStore();
  const loadStore = useIsLoadingStore();

  const projects = ref<Project[]>([]);

  const error = ref<Error | null>(null);

  const getProjectsByUser = async () => {
    error.value = null;


    const useMock = import.meta.env.VITE_USE_MOCK === "true";
    // if (useMock) {
    //   try {
    //     const { dataTest } = await import("~/mock/mockData");
    //     projects.value = dataTest;
    //     console.log("Используем моковые данные");
    //   } catch (e) {
    //     error.value = e instanceof Error ? e : new Error(String(e));
    //     console.error("Ошибка при загрузке моковых данных:", error.value);
    //   }
    //   return;
    // }

    try {
      console.log('запрос карточек');

      const data = await $fetch("/api/projects", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        }
      });

      if (data) {
        projects.value = [...data]
        console.log(projects.value);
      }

    } catch (error) { }

    console.log(error);

  };

  const createProject = async (project: ProjectCreateFrontend) => {
    loadStore.set(true);

    try {
      const data = await $fetch("/api/projects", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: project,
      });
      if (data) {
        projects.value.push({
          ...(data as Project),
          comments: [],
        });
      }
    } catch (error: any) {
      console.log(error.data.message);
    } finally {
      loadStore.set(false);
    }
  };

  const updateProject = async (projectId: string, updateData: any) => {
    loadStore.set(true);
    try {

      const data = await $fetch(`api/projects/${projectId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        },
        body: {id: projectId,...updateData},
      });
      console.log(data, 'проект обновлен');
    } catch (error:any) {
        console.log(error.data.message);
        
    } finally {
      loadStore.set(false)
    }

  };

  const deleteProject = async (projectId: string) => {
    loadStore.set(true);

    console.log(projectId, 'del');
    

    try {
      const data = await $fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authStore.accessToken}`,
        }
      });

      console.log(data, 'проект удален');
      await getProjectsByUser();
      
      
    } catch (error:any) {
      console.log(error.data.message);
      
    } finally {
      loadStore.set(false)
    }

  };

  return {
    projects,
    error,
    getProjectsByUser,
    createProject,
    updateProject,
    deleteProject,
  };
});
