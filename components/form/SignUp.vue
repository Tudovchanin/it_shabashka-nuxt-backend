<script setup lang='ts'>

import type { SignUpFormData, FormErrorData } from './forms.types';


interface Props {
   errorMessages: FormErrorData | null;
}
const props = defineProps<Props>();

const emailRef = ref('');
const passwordRef = ref('');
const nameRef = ref('');


const emit = defineEmits(["sign-up"]);

const emitEvent = () => {
  const dataForm: SignUpFormData = {
    email: emailRef.value,
    password: passwordRef.value,
    name: nameRef.value
  };
  emit("sign-up", dataForm);
};

</script>
<template>
   <h1>SignUp</h1>
   <form style="display: grid; gap: 20px; width: 400px; height: 240px">
    <div v-show="props.errorMessages?.errorEmail" style="color: red">
      {{ props.errorMessages?.errorEmail }}
    </div>
    <input placeholder="email" type="email" v-model="emailRef" autocomplete="on" />
    <div v-show=" props.errorMessages && props.errorMessages?.errorPassword" style="color: red">
      {{ props.errorMessages?.errorPassword}}
    </div>
    <input placeholder="password" type="password" v-model="passwordRef" autocomplete="on" />
    <div v-show=" props.errorMessages && props.errorMessages?.errorName" style="color: red">
      {{ props.errorMessages && props.errorMessages?.errorName}}
    </div>
    <input placeholder="name" type="text" v-model="nameRef" autocomplete="on" />



    <div style="display: flex; gap: 20px">
      <button type="button" @click="emitEvent" style="cursor: pointer; padding: 10px 20px">
        Отправить
      </button>
    </div>
  </form>
</template>


<style lang="scss" scoped>
</style>