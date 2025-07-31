<script setup lang='ts'>
const authStore = useAuthStore();


const refFileInput = ref<HTMLInputElement | null>(null);
const fileName = ref<string | null>(null);




const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  fileName.value = target.files?.[0]?.name || null;
};
const handleSubmitAvatar = async () => {
  if (!refFileInput.value?.files) return;

  const file:File | undefined = refFileInput.value.files[0];
  if (!file) return;

  if (file.size > 50 * 1024) {
    alert("Файл слишком большой! Максимум 500 КБ.");
    return;
  }

  await authStore.changeAvatar(file);
  refFileInput.value.value = ""; // Сброс значения
  fileName.value = "Файл не выбран";
};


</script>
<template>


<form class="avatar-form" @submit.prevent="handleSubmitAvatar">

<div class="avatar-form__input-group">

  <label  v-show="!fileName" for="avatarUpload" class="avatar-form__label">
    Выбрать файл
  </label>
  <button type="button" @click="fileName= null" class="avatar-form__label avatar-form__delete-file" v-show="fileName">Удалить файл</button>
  <input ref="refFileInput" type="file" accept=".jpg,.jpeg,.png,.webp" @change="handleFileChange"
    class="avatar-form__file-input" id="avatarUpload" />
</div>


<div class="avatar-form__info">
  <p class="avatar-form__filename">
   
    {{ fileName || 'файл не выбран' }}
  
  </p>
  <p class="avatar-form__hint">Форматы: JPG, PNG, WebP (до 50 КБ)</p>
</div>


<button v-show="fileName" type="submit" class="avatar-form__button-submit">
  Сохранить аватар
</button>
</form>

</template>


<style lang="scss" scoped>
.avatar-form {
  display: grid;
  gap: 15px;
  padding: 10px;

&__input-group {
}

&__file-input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

&__label {
  display: block;
  width: 100%;
  padding: 5px;
  font-size: 14px;
  text-align: center;
  background-color: grey;
  cursor: pointer;
}

&__delete-file {
  background-color: transparent;
  border: none;
  background-color: red;
}


&__filename {
  font-size: 14px;
  padding-top: 2px;
}

&__hint {
  font-size: 12px;
}

&__button-submit {
  background-color: rgb(0, 0, 0);
  padding: 10px;
  font-weight: 700;
  color: white;
  border: none;
  cursor: pointer;
}
}



</style>