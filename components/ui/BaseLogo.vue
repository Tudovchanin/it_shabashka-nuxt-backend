<script setup lang='ts'>
type Size = {
  size?: 'small'
}

const props = defineProps<Size>()
</script>
<template>

  <NuxtLink to="/" class="logo" :class="{ 'logo--small': props.size }">
    <img class="logo__img" src="/images/logo.png" alt="Логотип IT_Shabashka" />
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
  width: max-content;
  &__img {
    width: 25px;
    height: 20px;
  }

  &--small {
    height: 40px;
    gap: 8px;
    padding: 0 8px;
    border: solid white 2px;
    font-size: 16px;

    .logo__img {
     width: 20px;
     height: 16px;
    }

    @media (max-width:550px){
      height: 32px;
      font-size: 14px;
    }
  }

}
</style>