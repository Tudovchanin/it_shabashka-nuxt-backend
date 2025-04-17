
export const useEventStore = defineStore('event', () => {
  const dragoverCount = ref(0);
  const cardIdDragover = ref('');

  const initDragover = () => {
    dragoverCount.value += 1;
  }

  const getDragover = computed(() => {
    return dragoverCount.value
  });

  const stopDragover = ()=> {
    dragoverCount.value = 0
    cardIdDragover.value = '';
  }

  const setCardIdDragOver = (id:string)=> {
    cardIdDragover.value = id;
  }

  const getCardIdDragOver = computed(()=> {
    return cardIdDragover.value;
  })

  return {
    initDragover, getDragover, stopDragover, setCardIdDragOver, getCardIdDragOver
  }
})