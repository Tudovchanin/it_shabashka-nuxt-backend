

export const useBodyScrollStore = defineStore('bodyScroll', () => {
  const bodyScrollHidden = ref(false);

  

  const set = (data: boolean) => {
  }

  const get = computed(()=> {
    return bodyScrollHidden.value
  })




  return {
    set, get
  }
})