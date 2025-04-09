<script setup lang='ts'>
type Size = {
  size?: 'small'
}

const  props = defineProps<Size>()
</script>
<template>

  <NuxtLink to="/" class="logo" :class="{'logo--small': props.size}">
    <img src="/images/logo.png" alt="Логотип IT_Shabashka" />
    IT_Shabashka
  </NuxtLink>
</template>


<style lang="scss" scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 50px;
  padding: 0 10px;
  border: solid white 3px;
  font-size: 20px;
  font-weight: 700;
  background-color: var(--main-color);
  color: var(--color-light-50);
  max-width: 200px;
  &--small {
      border: solid white 2px;
      font-size: 16px;
  }


  & img {
    width: 25px;
    height: 20px;
  }
}
</style>