
export const useEventStore = defineStore('event', () => {
  const dragoverCount = ref(0);

  const initDragover = () => {
    dragoverCount.value += 1;
  }


  const getDragover = computed(() => {
    return dragoverCount.value
  });

  const stopDragover = ()=> {
    dragoverCount.value = 0
  }

  return {
    initDragover, getDragover, stopDragover
  }
})