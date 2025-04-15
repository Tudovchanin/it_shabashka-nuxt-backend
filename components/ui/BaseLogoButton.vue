<script setup lang='ts'>
type LogoButton = {
  reverse?: boolean;
  tag?: 'div' | 'button' | 'a'; 
}


const props = withDefaults(defineProps<LogoButton>(), {
  tag: 'div',
  reverse: false
})

</script>
<template>
  <component :is="props.tag" class="button-logo" :class="{ 'button-logo--reverse': $props.reverse }">
    <img src="/images/logo.png" alt="логотип" />
  </component>
</template>


<style lang="scss" scoped>
.button-logo {
 
  width: 60px;
  height: 40px;
  padding: 7px;
  border: solid white 2px;
  background-color: rgb(0, 0, 0);
  cursor: pointer;
  &--reverse {
      border: solid rgb(0, 0, 0) 2px;
      transform: rotateY(-180deg);
      background-color: white;
      & img {
        filter: brightness(0) saturate(100%)
      }
}
}
</style>