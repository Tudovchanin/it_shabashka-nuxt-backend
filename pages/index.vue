<script setup lang="ts">
import type {
  BaseFormData,
  SignUpFormData,
  FormErrorData,
} from "~/components/form/forms.types";
import { ValidateForm } from "~/components/form/ValidateForm";
import {
  CONTAINS_UPPERCASE,
  MIN_LENGTH_EIGHT,
  EMAIL_REGEXP,
  VALID_NAME,
  MIN_ONE_CHAR,
} from "~/components/form/form.constants";

definePageMeta({
  layout: false
});


useHead({
  title: "Start",
});

const router = useRouter();
const authStore = useAuthStore();


const isLoginRef = ref(true);
const errorMessages = ref<null | FormErrorData>(null);
const errorSignInSignUp = ref<null| string>(null)

const validateForm = new ValidateForm();
const visibleForm = ref(false);



const handleSubmitSignIn = (e: BaseFormData) => {
  validateForm.isEmailValid(e.email, EMAIL_REGEXP, "Ошибка почта не валидна");
  // validateForm.isPasswordValid(
  //   e.password,
  //   CONTAINS_UPPERCASE,
  //   "Неверный пароль"
  // );
  validateForm.isPasswordValid(e.password, MIN_LENGTH_EIGHT, "Неверный пароль");

  errorMessages.value = {
    errorEmail: validateForm.errorMessageEmail,
    errorPassword: validateForm.errorMessagePassword,
  };
 

  if (
    !validateForm.errorMessageEmail &&
    !validateForm.errorMessagePassword 
  ) {
    console.log(e.email, e.password);
    
    console.log('Отправка данных для входа');
    signIn(e.email, e.password)
  }

  validateForm.clearStateError();
};

const handleSubmitSignUp = (e: SignUpFormData) => {
  validateForm.isEmailValid(e.email, EMAIL_REGEXP, "Ошибка почта не валидна");
  // validateForm.isPasswordValid(
  //   e.password,
  //   CONTAINS_UPPERCASE,
  //   "Пароль должен содержать заглавный символ"
  // );
  validateForm.isPasswordValid(
    e.password,
    MIN_LENGTH_EIGHT,
    "Пароль не должен быть меньше 8 символов"
  );
  validateForm.isNameValid(
    e.name,
    VALID_NAME,
    "Имя должно содержать только латинские символы и цифры"
  );
  validateForm.isNameValid(e.name, MIN_ONE_CHAR, "Введите имя");

  if (
    !validateForm.errorMessageEmail &&
    !validateForm.errorMessagePassword &&
    !validateForm.errorMessageName
  ) {
    console.log('Отправка данных для регистрации');
  
    signUp(e.email, e.password, e.name)
  }



  errorMessages.value = {
    errorEmail: validateForm.errorMessageEmail,
    errorPassword: validateForm.errorMessagePassword,
    errorName: validateForm.errorMessageName,
  };
 

  validateForm.clearStateError();
};

async function signIn(email:string, password:string) {
  try {
    await authStore.login(email, password);
    await authStore.init();
    errorSignInSignUp.value = 'вошли в систему'
    await router.push('/projects');
    
  } catch (error) {
    console.log(error);
    errorSignInSignUp.value = 'ошибка входа'
  } finally {
  }
}
async function signUp(email:string, password:string, name:string) {
  try {
    await authStore.register(email, password, name);
    await authStore.init();
    await router.push('/projects');
  } catch (error) {
    console.log(error);
  } finally {
  }
}

onMounted(async () => {
  await authStore.init();
  if (authStore.user.status) {
    visibleForm.value = false;
    
    await router.push('/projects');
    console.log('name user:',authStore.user.name);
    
  } else {
    console.log('войдите или зарегистрируйтесь !!!');
    visibleForm.value = true;
  }
});
</script>
<template>
  <div v-if="visibleForm" style="display: grid; justify-items: center; gap: 40px">
    <h1>HOME</h1>

    <div>
      <button
        :disabled="isLoginRef"
        type="button"
        @click="
          isLoginRef = true;
          errorMessages = null;
        "
        style="cursor: pointer; padding: 10px 20px"
      >
        Login
      </button>
      <button
        :disabled="!isLoginRef"
        type="button"
        @click="
          isLoginRef = false;
          errorMessages = null;
        "
        style="cursor: pointer; padding: 10px 20px"
      >
        Register
      </button>
    </div>

    <FormSignIn v-if="isLoginRef" @sign-in="handleSubmitSignIn" :errorMessages />
    <FormSignUp v-else @sign-up="handleSubmitSignUp" :errorMessages />
  </div>
  <div v-show="errorSignInSignUp" style="color: red; font-size: 20px;">{{ errorSignInSignUp }}</div>

</template>

<style scoped></style>
