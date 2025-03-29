<script setup lang='ts'>


type BaseButton = {
  bgColor: string
  textColor: string
}

const props = defineProps<BaseButton>();

</script>
<template>

  <button  :style="{backgroundColor: props.bgColor, color:props.textColor}" class="base-button">
    <slot></slot>
  </button>


</template>


<style lang="scss" scoped>

.base-button {
  min-width: 100px;
  width: 100%;
  height: 35px;
  padding: 10px;
  border-radius: var(--radius-sm);
  border: none;
  font-weight: 600;
  box-shadow: 0 0 10px white;
  color: inherit;
  cursor: pointer;
  -webkit-user-select: none;
  /* Chrome/Safari */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* IE/Edge */
  user-select: none;
  /* Стандарт  снять выделение*/
  

  @media (hover:hover) {
    transition: box-shadow  var(--timing-animation-min);
    &:hover {
      box-shadow:  0 0 0 0 white;
    }
  }
  
  &:active {
    transform: scale(var(--scale-decrease-min));
  }
}
</style>