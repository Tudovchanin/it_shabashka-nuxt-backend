<script setup lang='ts'>


type BaseButton = {
  bgColor: string
  textColor: string
}

const props = defineProps<BaseButton>();

</script>
<template>

  <button  :style="{ '--shadow-color' : props.bgColor, backgroundColor: props.bgColor, color:props.textColor}" class="base-button">
    <slot></slot>
  </button>


</template>


<style lang="scss" scoped>

.base-button {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 90px;
  width: 100%;
  height: 35px;
  padding: 10px;
  border-radius: var(--radius-sm);
  border: none;
  text-align: center;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 0 10px  var(--shadow-color);
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
      box-shadow:  0 0 0 var(--shadow-color);;
    }
  }
  
  &:active {
    transform: scale(var(--scale-decrease-min));
  }
}
</style>