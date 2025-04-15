<script setup lang='ts'>


type BaseButton = {
  bgColor: string
  textColor: string
}

const props = defineProps<BaseButton>();




const COLOR_SHADOW_MAP = {
  'black': "black",
  'maroon': "maroon",
  'linear-gradient(90deg, #e2632c,#fb4955,#ff3286,#fc39be,#d35bf8)': "white",
  'linear-gradient(90deg, #ee6ef5,#57b9ff)': 'black',
  'linear-gradient(90deg, #29482a,#4e8950,#9fb97f)': "green",

  'white': "white",
  'red': "red",
  'green': "green",
  'gold': "gold",
  'blue': "blue",
} as const;


type ColorKeyShadowMap = keyof typeof COLOR_SHADOW_MAP;

const getColorShadow = computed(() => {
  return COLOR_SHADOW_MAP[props.bgColor as ColorKeyShadowMap] || "inherit";
});



</script>
<template>

  <button :style="{ '--shadow-color': getColorShadow, background: props.bgColor, color: props.textColor }"
    class="base-button">
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


  box-shadow: 0 0 10px var(--shadow-color);


  text-align: center;

  font-size: 12px;
  font-weight: 700;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  letter-spacing: var(--letter-spacing);
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
    transition: box-shadow var(--timing-animation-min);

    &:hover {
      box-shadow: 0 0 0 var(--shadow-color);
      
    }
  }

  &:active {
    box-shadow: 0 0 0 var(--shadow-color);
  } 
}
</style>