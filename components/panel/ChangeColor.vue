<script setup lang='ts'>

type Colors = {
  colors: string[]
}

const props = defineProps<Colors>()


const emit = defineEmits(['click-color']);

const emitClick = (color:string)=> {
  emit('click-color', color)
}

</script>
<template>

<div class="panel-colors">
  <button :style="{ background: color }" @click="emitClick(color)" class="panel-colors__button" v-for="color in props.colors">
  </button>
</div>
</template>


<style lang="scss" scoped>
.panel-colors {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  &__button {
    border: none;
    outline: none;
    padding: 10px;
    cursor: pointer;
  }
}
</style>