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

definePageMeta({
  layout: false,
});

useHead({
  title: "Start",
});

const router = useRouter();
const authStore = useAuthStore();

const flagIsLogin = ref(true);
const errorMessages = ref<null | FormErrorData>(null);
const errorSignInSignUp = ref<null | string>(null);

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
    await authStore.login(email, password);
    await authStore.init();
    errorSignInSignUp.value = null;
    await router.push("/projects");
  } catch (error) {
    console.log(error);
    errorSignInSignUp.value =
      "Неверные учетные данные. Проверьте адрес электронной почты и пароль";
  }
}
async function signUp(email: string, password: string, name: string) {
  try {
    await authStore.register(email, password, name);
    await authStore.init();
    await router.push("/projects");
  } catch (error) {
    console.log(error);
  }
}

onMounted(async () => {
  await authStore.init();
  if (authStore.user.status) {
    visibleForm.value = false;
    await router.push("/projects");
  } else {
    visibleForm.value = true;
  }
});
</script>
<template>
  <div
    class="entry-page"
    :class="{ 'entry-page--decor-visible': flagDecorVisible }"
  >
    <div class="entry-page__bg-video">
      <video loop autoplay muted src="/public/day_few_clouds.mov"></video>
    </div>
    <header class="entry-page__header">
      <div class="entry-page__header-logo">
        <UiBaseLogo />
      </div>
    </header>

    <main class="entry-page__content">
      <div
        class="entry-page__wrapper-form"
        @mouseleave="flagDecorVisible = false"
        @mouseenter="flagDecorVisible = true"
      >
        <div v-show="errorSignInSignUp" class="entry-page__error-sign-in">
          {{ errorSignInSignUp }}
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

    <footer class="entry-page__footer"></footer>
  </div>
</template>

<style lang="scss" scoped>
.entry-page {
  position: relative;
  min-height: 100vh;
  overflow-x: hidden;
  background-color: black;

  &::before {
    content: "";
    position: fixed;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    transition: clip-path var(--timing-animation-min),
      backdrop-filter var(--timing-animation-min);
    backdrop-filter: blur(12px);
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
  }

  &__tab {
    border: solid black 1px;
    opacity: 0.5;
    background-color: white;
    color: black;
    text-transform: uppercase;
    font-weight: 700;
  }

  &__tab:disabled {
    opacity: 1;
    background-color: white;
    pointer-events: none;
  }

  &__header {
    position: absolute;
    z-index: 1000;
    left: 10px;
    top: 10px;
  }

  &__wrapper-form {
    position: absolute;
    z-index: 1000;
    left: 50%;
    top: 50%;
    max-width: 440px;
    width: 100%;
    padding-left: 20px;
    padding-right: 20px;
    transform: translate(-50%, -50%);

    @media (max-width: 700px) {
      padding-left: 10px;
      padding-right: 10px;
    }

    @media (max-height: 600px) {
      top: 120px;
      transform: translate(-50%, 0%);
      padding-bottom: 20px;
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
}

.button-tab {
  padding: 10px 20px;
  cursor: pointer;
}

// :focus-within  если дочернии элементы получили фокус
</style>
