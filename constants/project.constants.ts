import { ProjectStatus } from "../stores/cards.store";




export const STATUS_TRANSLATIONS = {
  [ProjectStatus.NEW]: "Новый проект",
  [ProjectStatus.IN_PROGRESS]: "В работе",
  [ProjectStatus.REVISION]: "На доработке",
  [ProjectStatus.REVIEW]: "На проверке",
  [ProjectStatus.DONE]: "Готово",
};

