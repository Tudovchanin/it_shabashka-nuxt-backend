
import type { TypeProjectStatus } from "./cards.store";

export const useFormAddStore = defineStore('isOpen', () => {
  const isOpen = ref(false);
  const status = ref<TypeProjectStatus>('NEW');

  

  const setOpen = (data: boolean) => {
    isOpen.value = data;
  }


  const setStatus = (data: TypeProjectStatus) => {
   status.value = data
  }



  return {
    isOpen,
    setOpen,
    status,
    setStatus
  }
})