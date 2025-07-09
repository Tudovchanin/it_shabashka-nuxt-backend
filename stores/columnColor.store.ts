
import type { TypeProjectStatus } from "~/stores/cards.store";


export const useColumnColor = defineStore('color-column', ()=> {

  const authStore = useAuthStore();

// state изменения цвета колонок
const columnColors = ref<{ [key in TypeProjectStatus]: string }>({
  [ProjectStatus.NEW]: "",
  [ProjectStatus.IN_PROGRESS]: "",
  [ProjectStatus.REVIEW]: "",
  [ProjectStatus.REVISION]: "",
  [ProjectStatus.DONE]: "",
});

const saveColor = (key: TypeProjectStatus, color:string)=> {
  columnColors.value[key] = color;

  localStorage.setItem(
    `${authStore.user.$id}-columnColors`,
    JSON.stringify(columnColors.value)
  );
}

const loadColor = ()=> {
  const localStoredColors = localStorage.getItem(
    `${authStore.user.$id}-columnColors`
  );

  columnColors.value = localStoredColors
    ? JSON.parse(localStoredColors)
    : columnColors.value;
}

  return {columnColors, loadColor, saveColor}
})