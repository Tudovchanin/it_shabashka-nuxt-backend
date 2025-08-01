

import { useAppConstants } from '~/constants/app.constants';
import { useAppwriteClient } from '~/composables/useAppwriteClient';
import type { Project } from './projects.store';

export type User = {
  id: string;
  email: string;
  name: string;
  avatar: string;
  status: boolean
  projects?: Project[]; 
};

export type UpdateAccount = {
  name?: string;
  email?: string;
  newPassword?: string;
  currentPassword?: string;
  avatar?:string;
};
const defaultValue: User = {
  id: "",
  email: "",
  name: "",
  status: false,
  avatar: "/images/avatar-default.png",
};

// utils/errorHandler.ts

export function handleFetchError(
  error: unknown,
  setErrorMessage: (msg: string) => void
): void {
  if (error && typeof error === "object") {

    if (
      error &&
      typeof error === 'object' &&
      'data' in error &&
      error.data &&
      typeof error.data === 'object' &&
      'message' in error.data &&
      typeof error.data.message === 'string' &&
      error.data.message.length > 0
    ) {
      setErrorMessage(error.data.message);
    } else if (
      "message" in error &&
      typeof (error as any).message === "string"
    ) {
      setErrorMessage((error as any).message);
    } else {
      setErrorMessage("Неизвестная ошибка сервера");
    }

  } else {
    setErrorMessage("Неизвестная ошибка сервера");
  }
}

export const useAuthStore = defineStore("auth", () => {
  const { STORAGE_ID } = useAppConstants();
  const { storage } = useAppwriteClient();

  const user = ref(defaultValue);
  const accessToken = ref("");
  const errorMessage = ref<string | null>(null);

  const init = async () => {
    errorMessage.value = null;
    try {
      const data = await $fetch("/api/auth/refresh-token", {
        method: "POST",
        credentials: "include", // ключевой момент для отправки httpOnly cookie
      });

      if (data?.accessToken && data.user) {
        accessToken.value = data.accessToken;
        user.value = { ...data.user, status: true };
        console.log(user.value, "init");
      } else {
        errorMessage.value = "Не удалось войти";
        resetAuth();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        errorMessage.value = error.message;
      } else {
        errorMessage.value = "Неизвестная ошибка сервера";
      }
      resetAuth();
    }
  };
  const register = async (email: string, password: string, name: string) => {
    errorMessage.value = null;

    try {
      const data = await $fetch("/api/auth/register", {
        method: "POST",
        body: { email, password, name },
      });

      if (data.accessToken && data.user) {
        accessToken.value = data.accessToken;
        user.value = { ...data.user, status: true };
      } else {
        errorMessage.value = "Не удалось зарегистрироваться";
        resetAuth();
        throw new Error("Не удалось зарегистрироваться");
      }
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message;
        throw error;
      } else {
        errorMessage.value = "Неизвестная ошибка сервера";
        resetAuth();
        throw new Error("Неизвестная ошибка сервера");
      }
    }
  };
  const login = async (email: string, password: string) => {
    errorMessage.value = null;

    try {
      const data = await $fetch("/api/auth/login", {
        method: "POST",
        body: { email, password },
      });

      if (data?.accessToken && data?.user) {
        accessToken.value = data.accessToken;
        user.value = { ...data.user, status: true };
      } else {
        errorMessage.value = "Не удалось войти";
        resetAuth();
        throw new Error("Не удалось войти");
      }
    } catch (error) {
      if (error instanceof Error) {
        errorMessage.value = error.message;
        throw error;
      } else {
        errorMessage.value = "Неизвестная ошибка сервера";
        resetAuth();
        throw new Error("Неизвестная ошибка сервера");
      }
    }
  };
  const logout = async () => {
    try {
      errorMessage.value = null;
      const data = await $fetch("/api/auth/logout", {
        method: "POST",
      });
      resetAuth();
      return data;
    } catch (error) {

      handleFetchError(error, (msg) => errorMessage.value = msg);
      throw error;
    }
  };
  const deleteAccount = async () => {
    try {
      errorMessage.value = null;
      const data = await $fetch("/api/auth/delete-user", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
      });
      resetAuth();
      return data;
    } catch (error) {
      handleFetchError(error, (msg) => errorMessage.value = msg);
      throw error;
    }
  };
  const updateAccount = async (updateData: UpdateAccount) => {
    try {
      errorMessage.value = null;
      const data = await $fetch("/api/auth/update", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
        },
        body: updateData,
      });

      if (data.user && data.user.name) {
        user.value = {
          ...data.user, status: true
        } as User
      }


    } catch (error: any) {

      handleFetchError(error, (msg) => errorMessage.value = msg);
      console.log(errorMessage.value);

      throw error;
    }
  };


  const changeAvatar = async (file: File | undefined) => {
    if (!file) return;

    const uniqueId = Date.now().toString();
    try {

      const result = await storage.createFile(
        STORAGE_ID,
        uniqueId,
        file
      );

      console.log(result);

      const bucketId = result.bucketId; 
      const fileId = result.$id;

      const fileUrl =  storage.getFileView(bucketId, fileId);

      console.log('URL для просмотра файла:', fileUrl);

      const user = updateAccount({avatar: fileUrl as unknown as string})

    } catch (error) {
      console.error(error);
    }


  }



  const resetAuth = () => {
    user.value = defaultValue;
    accessToken.value = "";
  };

  return {
    init,
    login,
    register,
    logout,
    deleteAccount,
    updateAccount,
    changeAvatar,
    user,
    accessToken,
    errorMessage,
  };
});
