
export const useIsLoadingStore = defineStore('isLoading', () => {
  const isLoading = ref(false);

  const set = (data: boolean) => {
    isLoading.value = data;
  }

  return {
    isLoading,
    set
  }
})