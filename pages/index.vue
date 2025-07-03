<!-- подключение телефона к пк ip пк  192.168.183.202 в телефоне ввести  http://192.168.183.202:номер порта,
 в терменале запустить проект командой  (npm run dev -- --host 0.0.0.0)      -->

<script setup lang="ts">
import type {
  BaseFormData,
  FormErrorData,
} from "~/components/forms/forms.types";
import { ValidateForm } from "~/components/forms/ValidateForm";
import {
  CONTAINS_UPPERCASE,
  MIN_LENGTH_EIGHT,
  EMAIL_REGEXP,
  VALID_NAME,
  MIN_ONE_CHAR,
} from "~/components/forms/form.constants";
import { SectionsFooter } from "#components";

definePageMeta({
  layout: false,
});

useHead({
  title: "Start",
});

const router = useRouter();

const authStore = useAuthStore();
const loadStore = useIsLoadingStore();

const flagIsLogin = ref(true);
const errorMessages = ref<null | FormErrorData>(null);
const error_SignIn_SignUp = ref<null | string>(null);

const validateForm = new ValidateForm();
const visibleForm = ref(false);

const flagDecorVisible = ref(false);

const handleSubmitSignIn = (e: BaseFormData) => {
  validateForm.isEmailValid(e.email, EMAIL_REGEXP, "Ошибка почта не валидна");
  // validateForm.isPasswordValid(
  //   e.password,
  //   CONTAINS_UPPERCASE,
  //   "Неверный пароль"
  // );
  validateForm.isPasswordValid(e.password, MIN_LENGTH_EIGHT, "Неверный пароль");

  errorMessages.value = {
    error_email: validateForm.errorMessageEmail,
    error_password: validateForm.errorMessagePassword,
  };

  if (!validateForm.errorMessageEmail && !validateForm.errorMessagePassword) {
    signIn(e.email, e.password);
  }

  validateForm.clearStateError();
};

const handleSubmitSignUp = (e: BaseFormData) => {
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

  if (e.name) {
    validateForm.isNameValid(
      e.name as string,
      VALID_NAME,
      "Имя должно содержать только латинские символы и цифры"
    );
    validateForm.isNameValid(e.name, MIN_ONE_CHAR, "Введите имя");
  }

  validateForm.isNameValid(
    e.name as string,
    VALID_NAME,
    "Имя должно содержать только латинские символы и цифры"
  );
  validateForm.isNameValid(e.name as string, MIN_ONE_CHAR, "Введите имя");

  if (
    !validateForm.errorMessageEmail &&
    !validateForm.errorMessagePassword &&
    !validateForm.errorMessageName
  ) {
    signUp(e.email, e.password, e.name as string);
  }

  errorMessages.value = {
    error_email: validateForm.errorMessageEmail,
    error_password: validateForm.errorMessagePassword,
    error_name: validateForm.errorMessageName,
  };

  validateForm.clearStateError();
};

async function signIn(email: string, password: string) {
  try {
    loadStore.set(true);
    await authStore.login(email, password);
    await authStore.init();
    error_SignIn_SignUp.value = null;
    await router.push("/projects");
  } catch (error) {
    console.log(error);
    error_SignIn_SignUp.value =
      "Неверные учетные данные. Проверьте адрес электронной почты и пароль";
  } finally {
    loadStore.set(false);
  }
}
async function signUp(email: string, password: string, name: string) {
  try {
    loadStore.set(true);
    await authStore.register(email, password, name);
    await authStore.init();
    await router.push("/projects");
  } catch (error) {
    console.log(error);
  } finally {
    loadStore.set(false);
  }
}

onBeforeMount(async () => {
  await authStore.init();
  if (authStore.user.status) {
    visibleForm.value = false;
    await router.push("/projects");
  } else {
    visibleForm.value = true;
  }
});

onMounted(async () => {});
</script>
<template>
  <div
    class="entry-page"
    :class="{ 'entry-page--decor-visible': flagDecorVisible }"
  >
    <div v-if="loadStore.isLoading" class="entry-page__loader">
      <LoadersAppLoader />
    </div>

    <div class="entry-page__bg-video">
      <video loop autoplay muted src="/day_scattered_clouds.mp4"></video>
    </div>
    <header class="entry-page__header">
      <div class="entry-page__header-logo entry-page__header-logo--desktop">
        <UiBaseLogo />
      </div>
      <div class="entry-page__header-logo entry-page__header-logo--mobile">
        <UiBaseLogo size="small" />
      </div>
    </header>

    <main class="entry-page__content">
      <div
        class="entry-page__wrapper-form"
        @mouseleave="flagDecorVisible = false"
        @mouseenter="flagDecorVisible = true"
      >
        <div v-show="error_SignIn_SignUp" class="entry-page__error-sign-in">
          {{ error_SignIn_SignUp }}
        </div>
        <div class="entry-page__form" v-if="visibleForm">
          <div class="entry-page__form-tab">
            <button
              :disabled="flagIsLogin"
              type="button"
              class="button-tab entry-page__tab"
              @click="
                flagIsLogin = true;
                errorMessages = null;
              "
            >
              Вход
            </button>
            <button
              :disabled="!flagIsLogin"
              type="button"
              class="button-tab entry-page__tab"
              @click="
                flagIsLogin = false;
                errorMessages = null;
                error_SignIn_SignUp = null;
              "
            >
              Регистрация
            </button>
          </div>
          <FormsSignForm
            v-if="flagIsLogin"
            @sign-in="handleSubmitSignIn"
            :error_messages="errorMessages"
            :variant-form="'sign-in'"
          />
          <FormsSignForm
            v-else
            @sign-up="handleSubmitSignUp"
            :error_messages="errorMessages"
            :variant-form="'sign-up'"
          />
        </div>
      </div>
    </main>

    <footer class="entry-page__footer">
      <SectionsFooter />
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.entry-page {
  display: grid;
  gap: 100px;
  position: relative;
  min-height: 100vh;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 20px;
  background-color: black;
  overflow: hidden;

  @media (max-width: 700px) {
    padding-left: 10px;
    padding-right: 10px;
  }

  &::before {
    content: "";
    position: fixed;
    left: 0;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    transition: clip-path var(--timing-animation-min),
      backdrop-filter var(--timing-animation-min);
    backdrop-filter: blur(12px);
  }

  &__loader {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 200px;
    height: 200px;
    z-index: 2000;
    color: rgb(255, 255, 255);
  }

  &--decor-visible {
    .entry-page__bg-video {
      clip-path: polygon(
        0 0,
        0 50%,
        30% 50%,
        0 50%,
        0 100%,
        50% 100%,
        100% 100%,
        100% 50%,
        70% 50%,
        100% 50%,
        100% 0,
        50% 0
      );
    }

    &::before {
      backdrop-filter: blur(0px);
    }

    .entry-page__footer {
      color: black;
    }
  }

  &__tab {
    border: solid black 1px;
    opacity: 0.5;
    background-color: white;
    color: black;
    text-transform: uppercase;
    font-weight: 700;
    user-select: none;
  }

  &__tab:disabled {
    opacity: 1;
    background-color: white;
    pointer-events: none;
  }

  &__header {
    position: relative;
    z-index: 1000;
    // position: absolute;
    // z-index: 1000;
    // left: 10px;
    // top: 10px;
  }

  &__header-logo {
    &--desktop {
      display: block;

      @media (max-width: 450px) {
        display: none;
      }
    }

    &--mobile {
      display: none;

      @media (max-width: 450px) {
        display: block;
      }
    }
  }

  &__content {
    position: relative;
    z-index: 1000;
  }

  &__wrapper-form {
    // display: none;
    // position: absolute;
    // z-index: 1000;
    // left: 50%;
    // top: 50%;
    max-width: 440px;
    width: 100%;
    // padding-left: 20px;
    // padding-right: 20px;
    margin-left: auto;
    margin-right: auto;
    // transform: translate(-50%, -50%);

    // @media (max-width: 700px) {
    //   padding-left: 10px;
    //   padding-right: 10px;
    // }

    @media (max-height: 600px) {
      // top: 120px;
      // transform: translate(-50%, 0%);
      // padding-bottom: 20px;
    }
  }

  &__error-sign-in {
    position: absolute;
    left: 50%;
    top: -20px;
    z-index: 1000;
    padding: 5px 10px;
    width: max-content;

    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.603);

    font-size: 14px;
    letter-spacing: var(--letter-spacing);
    color: rgba(255, 0, 0, 1);

    @media (max-width: 700px) {
      text-align: center;
      top: -25px;
      max-width: 100vw;
      font-size: 12px;
    }
  }

  &__form-tab {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  &__form {
    padding: 20px;
    min-height: 345px;
    border: solid rgb(255, 255, 255) 3px;
    color: white;
    background-color: var(--main-color);
    transition: box-shadow var(--timing-animation-min),
      linear var(--timing-animation-min);

    &:focus-within {
      border: solid rgba(255, 255, 255, 0) 3px;
      box-shadow: 0 0 0px 6px rgb(0, 0, 0);
    }

    &:has(.button-tab:focus) {
      border: solid rgb(255, 255, 255) 3px;
      box-shadow: none;
    }
  }

  &__bg-video {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 0;
    clip-path: polygon(
      20% 0%,
      0% 20%,
      30% 50%,
      0% 80%,
      20% 100%,
      50% 70%,
      80% 100%,
      100% 80%,
      70% 50%,
      100% 20%,
      80% 0%,
      50% 30%
    );
    transition: clip-path 0.5s linear;

    & video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__footer {
    align-self: end;
    position: relative;
    z-index: 1000;
    // align-self: end;
    // z-index: 1000;
    // left: 10px;
    // bottom: 10px;
    padding-top: 24px;
    padding-bottom: 24px;
    color: white;
  }
}

.button-tab {
  padding: 10px 20px;
  cursor: pointer;
}

// :focus-within  если дочернии элементы получили фокус
</style>
