import { ProjectStatus } from "../stores/cards.store";



export const STATUS_TRANSLATIONS = {
  [ProjectStatus.NEW]:"Заказ",
  [ProjectStatus.IN_PROGRESS]:"Кодим",
  [ProjectStatus.REVISION]:"Правки",
  [ProjectStatus.REVIEW]:"На проверке",
  [ProjectStatus.DONE]:"Оплачено",
};

