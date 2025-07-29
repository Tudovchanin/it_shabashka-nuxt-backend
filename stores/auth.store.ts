type User = {
  id: string;
  email: string;
  name: string;
  status: boolean;
  avatar: string | null;
};
const defaultValue: User = {
  id: "",
  email: "",
  name: "",
  status: false,
  avatar: "",
};

export const useAuthStore = defineStore("auth", () => {
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
      if (error instanceof Error) {
        errorMessage.value = error.message;
        throw error;
      } else {
        errorMessage.value = "Неизвестная ошибка сервера";
        throw new Error("Неизвестная ошибка сервера");
      }
    }
  };

  const resetAuth = () => {
    user.value = defaultValue;
    accessToken.value = "";
  };

  return {
    init,
    login,
    register,
    logout,
    user,
    errorMessage,
  };
});
