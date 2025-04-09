<script setup lang='ts'>

type TypeBaseInput = {
  placeholder?: string;
  maxLength?: string
}
 const props = defineProps<TypeBaseInput>()

 const modelValue = defineModel<string>()

const resetInputSearch = () => {
  modelValue.value = '';
}

defineExpose({
  resetInputSearch
});

const handleBlur = () => {
  // modelValue.value = '';
}
</script>
<template>

  <div class="base-search">
    <div class="base-search__icon-search">
      <img src="/images/search-icon.png" alt="иконка поиска">
    </div>
    <input :maxlength="props.maxLength" :placeholder="props.placeholder" @blur="handleBlur" class="base-search__input" v-model="modelValue" type="text">
    <button v-show="modelValue?.trim().length" @click="resetInputSearch" class="base-search__reset">
      <img src="/public/images/icon-close.png" alt="стереть поисковый запрос">
    </button>
  </div>
</template>


<style lang="scss" scoped>
.base-search {
  position: relative;
  display: flex;
  min-width: 250px;
  height: 100;
  border-radius: var(--radius-input);
  overflow: hidden;
  background-color: rgba(0, 0, 0, 0.906);

  &__icon-search {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 25px;
    opacity: .5;
    
    & img {
      width: 16px;
      height: 16px;
    }
  }

  &__input {
    width: 100%;
    min-width: 1px;
    height: 100%;
   background-color: transparent;
    border: none;
    color: white;
    padding-left: 10px;
    outline: none;
    transition: min-width var(--timing-animation-min);

    &:focus {
      min-width: 450px;
    }
  }

  &__reset {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
    width: 30px;

    background-color: transparent;
    outline: none;
    border: none;
    cursor: pointer;

    & img {
      width: 10px;
      height: 10px;
    }
  }
}
</style>