
import { STORAGE_ID } from "~/constants/app.constants"

type AppwriteUser = {
  $id: string
  email: string
  name: string
  status: boolean
}

// Тип состояния пользователя с аватаркой
type AuthStore = AppwriteUser & {
  avatarUrl: string
  avatarId: string
}

const defaultValue: AuthStore = {
  $id: '',
  email: '',
  name: '',
  status: false,
  avatarUrl: '',
  avatarId: '',
}

const defaultAvatarId = '67efcb7b000f144d1d94'

export const useAuthStore = defineStore('auth', () => {

  const user = ref(defaultValue);

  const init = async () => {
    try {

      // Получение текущего пользователя
      const userData = await account.get();

      // Получение пользовательских предпочтений
      const prefs = await account.getPrefs();


      // Создание объекта пользователя с аватаркой
      user.value = {
        $id: userData.$id,
        email: userData.email,
        name: userData.name,
        status: userData.status,
        avatarUrl: '',
        avatarId: ''
      };

      // проверка предпочтений пользователя
      if (!prefs['avatarId']) {
        getAvatar(defaultAvatarId);
      } else {
        getAvatar(prefs['avatarId']);
      }


      // if (!prefs['avatarId']) {
      //   await getAvatar(defaultAvatarId);

      // } else {
      //   await getAvatar(prefs['avatarId']);

      // }

    } catch (e: unknown) {

      user.value = defaultValue;
    }
  }



  const login = async (email: string, password: string) => {
    console.log(email, password, 'store');
    await account.createEmailPasswordSession(email, password);
  }

  const register = async (email: string, password: string, name: string) => {
    await account.create(ID.unique(), email, password, name);
    await login(email, password);
  }
  const logout = async () => {
    await account.deleteSession("current");
    user.value = defaultValue;
  }



  const getAvatar = async (avatarId: string) => {
    const avatar = storage.getFileView(STORAGE_ID, avatarId).href;
    user.value.avatarUrl = avatar;
  }

  const createAvatar = async (file: any) => {

    const prefs = await account.getPrefs();

    if (prefs['avatarId']) {
      deleteAvatar(prefs['avatarId']);
    }


    const response = await storage.createFile(
      STORAGE_ID,
      ID.unique(),
      file
    );

    const avatarId = response.$id;

    if (avatarId) {
      await account.updatePrefs({ 'avatarId': response.$id });
      console.log('установили аватар')
      getAvatar(avatarId);
    }



  };

  const deleteAvatar = async (avatarId: string) => {

    const response = await storage.deleteFile(
      STORAGE_ID,
      avatarId
    );
    console.log('удалена аватарка', response);


  }


  return {
    init, login, register, logout, user, createAvatar
  }
})