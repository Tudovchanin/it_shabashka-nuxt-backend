<script lang="ts" setup>
import type {BaseFormData , FormErrorData } from "./forms.types";


interface Props {
  errorMessages: FormErrorData | null;
}

const props = defineProps<Props>();


const emailRef = ref("");
const passwordRef = ref("");

const emit = defineEmits(["sign-in"]);

const emitEvent = () => {
  const dataForm: BaseFormData = {
    email: emailRef.value,
    password: passwordRef.value,
  };
  emit("sign-in", dataForm);
};
</script>
<template>
  <h1>SignIn</h1>
  <form style="display: grid; gap: 20px; width: 400px; height: 240px">
    <div v-show="props.errorMessages && props.errorMessages?.errorEmail" style="color: red">
      {{ props.errorMessages?.errorEmail }}
    </div>
    <input placeholder="email" type="email" v-model="emailRef" autocomplete="on" />
    <div v-show="props.errorMessages && props.errorMessages?.errorPassword" style="color: red">
      {{ props.errorMessages?.errorPassword}}
    </div>
    <input placeholder="password" type="password" v-model="passwordRef" autocomplete="on" />
    <div style="display: flex; gap: 20px">
      <button type="button" @click="emitEvent" style="cursor: pointer; padding: 10px 20px">
        Отправить
      </button>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
