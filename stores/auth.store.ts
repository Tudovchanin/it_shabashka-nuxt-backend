type AuthStore = {
  $id: string
  email: string
  name: string
  status: boolean
}

const defaultValue: AuthStore =  {
    $id:'',
    email: '',
    name: '',
    status: false,
}


export const useAuthStore = defineStore('auth', ()=> {

  const user = ref(defaultValue);

  const init = async() => {
    try {
      user.value = await account.get();
    } catch (e:unknown) {

      user.value = defaultValue;
    }
  } 


  const login = async (email:string, password:string ) => {
    console.log(email, password, 'store');
    
    await account.createEmailPasswordSession(email, password);
  }

  const register = async(email:string ,password:string, name:string) => {
    await account.create(ID.unique(), email, password, name);
    await login(email, password);
  } 

  const logout = async () => {
    await account.deleteSession("current");
    user.value = defaultValue;
  }

return {
  init, login, register, logout, user
}
})