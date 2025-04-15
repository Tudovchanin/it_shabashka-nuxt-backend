<script lang="ts" setup>
import type { BaseFormData, FormErrorData } from "./forms.types";


type HomeForm = {
  error_messages: FormErrorData | null;
  variantForm: 'sign-in' | 'sign-up'
}

const props = defineProps<HomeForm>();


const emailRef = ref("");
const passwordRef = ref("");
const nameRef = ref('');

const emit = defineEmits(["sign-in", "sign-up"]);

const emitEventSignIn = () => {
  const dataForm: BaseFormData = {
    email: emailRef.value,
    password: passwordRef.value,
  };
  emit("sign-in", dataForm);
};



const emitEventSignUp = () => {
  const dataForm: BaseFormData = {
    email: emailRef.value,
    password: passwordRef.value,
    name: nameRef.value
  };
  console.log(dataForm, props);
  
  emit("sign-up", dataForm);
};

</script>
<template>
  <form v-if="props.variantForm === 'sign-in'" class="sign">
    <div class="sign__field">
      <div class="sign__error" v-show="props.error_messages && props.error_messages?.error_email">
        {{ props.error_messages?.error_email }}
      </div>
      <input class="sign__input" placeholder="email" type="email" v-model="emailRef" autocomplete="on" />
    </div>
    <div class="sign__field">
      <div class="sign__error" v-show="props.error_messages && props.error_messages?.error_password">
        {{ props.error_messages?.error_password }}
      </div>
      <input class="sign__input" placeholder="password" type="password" v-model="passwordRef" autocomplete="on" />
    </div>
    <div class="sign__field">
      <button class="sign__submit" type="button" @click="emitEventSignIn">
        Отправить
      </button>
    </div>
  </form>
  <form v-else-if="props.variantForm === 'sign-up'" class="sign">
    <div class="sign__field">
      <div class="sign__error" v-show="props.error_messages && props.error_messages?.error_email">
        {{ props.error_messages?.error_email }}
      </div>
      <input class="sign__input" placeholder="email" type="email" v-model="emailRef" autocomplete="on" />
    </div>
    <div class="sign__field">
      <div class="sign__error" v-show="props.error_messages && props.error_messages?.error_password">
        {{ props.error_messages?.error_password }}
      </div>
      <input class="sign__input" placeholder="password" type="password" v-model="passwordRef" autocomplete="on" />
    </div>
    <div class="sign__field">
      <div class="sign__error" v-show="props.error_messages && props.error_messages?.error_name">
        {{ props.error_messages && props.error_messages?.error_name }}
      </div>
      <input class="sign__input" placeholder="name" type="text" v-model="nameRef" autocomplete="on" />

    </div>

    <div class="sign__field">
      <button class="sign__submit" type="button" @click="emitEventSignUp">
        Отправить
      </button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.sign {
  display: grid;
  gap: 15px;

  &__field {
    position: relative;
    padding-top: 18px;
  }

  &__error {
    position: absolute;
    top: 0;
    left: 0;
    color: red;
    font-size: 12px;
  }

  &__input {
    width: 100%;
    height: 30px;
    padding-left: 10px;
    background-color: inherit; 
    border: none;
    border-bottom: solid var(--color-light-50) 1px;
    color: var(--color-light-50);

    

    &:focus {
      outline: solid rgb(255, 255, 255) 1px;
      border-bottom: solid transparent 1px;;

    }
  }

  &__submit {
    border: none;
    background-color: var(--color-light-50);
    padding: 10px 20px;
    text-transform: uppercase;
    letter-spacing: var(--letter-spacing);
    font-weight: 700;
    cursor: pointer;

  }
}
</style>
