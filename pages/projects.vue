<script setup lang="ts">
import { ProjectStatus } from "~/stores/cards.store";
import type { DataCardAppWrite, TypeProjectStatus } from "~/stores/cards.store";
import type { FormCardKanban } from "~/components/form/CreateProject.vue";

import { STATUS_TRANSLATIONS } from "~/constants/project.constants";
import {
  sortAsc,
  sortDesc,
  sortDateStringAsc,
  sortDateStringDesc,
} from "#imports";

definePageMeta({
  middleware: "auth",
});

// type
type Kanban = {
  [key in TypeProjectStatus]: DataCardAppWrite[];
};
type SortColumns = {
  [key: string]: {
    [key: string]: string;
  };
};

// store
const authStore = useAuthStore();
const projectsStore = useProjectsStore();
const addFormStore = useFormAddStore();
const commentsStore = useCommentsStore();
const loadStore = useIsLoadingStore();
const searchStore = useSearchStore();

// state kanban / project / kanbanOriginal-нужен для восстановления state kanban без перезагрузки
const projects = ref<DataCardAppWrite[]>([]);
const kanbanOriginal = ref<Kanban>({
  [ProjectStatus.NEW]: [],
  [ProjectStatus.IN_PROGRESS]: [],
  [ProjectStatus.REVIEW]: [],
  [ProjectStatus.REVISION]: [],
  [ProjectStatus.DONE]: [],
});
const kanban = ref<Kanban>({
  [ProjectStatus.NEW]: [],
  [ProjectStatus.IN_PROGRESS]: [],
  [ProjectStatus.REVIEW]: [],
  [ProjectStatus.REVISION]: [],
  [ProjectStatus.DONE]: [],
});

// state открытие закрытие колонок
const hiddenColumns = ref<boolean[]>([]);

// state сортировки
const stateSortColumn = markRaw<SortColumns>({
  price: {
    [ProjectStatus.NEW]: "default",
    [ProjectStatus.IN_PROGRESS]: "default",
    [ProjectStatus.REVIEW]: "default",
    [ProjectStatus.REVISION]: "default",
    [ProjectStatus.DONE]: "default",
  },
  deadline: {
    [ProjectStatus.NEW]: "default",
    [ProjectStatus.IN_PROGRESS]: "default",
    [ProjectStatus.REVIEW]: "default",
    [ProjectStatus.REVISION]: "default",
    [ProjectStatus.DONE]: "default",
  },
});

// state изменения цвета колонок
const columnColors = ref<{ [key in TypeProjectStatus]: string }>({
  [ProjectStatus.NEW]: "",
  [ProjectStatus.IN_PROGRESS]: "",
  [ProjectStatus.REVIEW]: "",
  [ProjectStatus.REVISION]: "",
  [ProjectStatus.DONE]: "",
});

// flags
const flagProjectCreated = ref(false);
let flagClickCard = false;
let flagEventSelect = false;

// ref ссылки на элементы DOM
const refKanban = ref();
const refMenuColumn = ref();
const refPanelAside = ref();
const refFormAdd = ref();

// -------------------------------------------------------------------------

// CARDS / COLUMNS:

// получение карточек и добавление их в колонки с проверкой markRaw stateSortColumn

async function getProjects(arrProjects: DataCardAppWrite[]) {
  projects.value = arrProjects;

  resetKanban();
  initKanban();
  applyColumnSorting();
}

// добавление карточки через форму
const handleSubmitCreateCard = async (project: FormCardKanban) => {
  await createProject(project);
  await getProjects(projectsStore.projects);
};
async function createProject(project: FormCardKanban) {
  const dataProject = {
    ...project,
  };
  await projectsStore.createProject(dataProject);
}

// Удаление карточки
const handleDeleteCard = async (project: DataCardAppWrite) => {
  await deleteProject(project);
  await getProjects(projectsStore.projects);
  asidePanelVisible.value = false;
};
async function deleteProject(project: DataCardAppWrite) {
  await projectsStore.deleteProject(project.$id);
  // await getProjects();
}

// добавление карточки в колонку
async function addCardInColumn(projectId: string, columnStatus: string) {
  await projectsStore.updateProject(projectId, { status: columnStatus });
  await projectsStore.getProjectsByUser();
  await getProjects(projectsStore.projects);
}

// сортировка карточек
const handleEmitSort = (sortValue: string, key: TypeProjectStatus) => {
  const [nameBySort, direction] = sortValue.split(":");
  if (direction === "desc") {
    if (nameBySort === "price") {
      sortDesc(kanban.value[key], nameBySort);
      stateSortColumn[nameBySort][key] = "desc";
      resetStateSortColumn(stateSortColumn.deadline);
    } else {
      sortDateStringDesc(kanban.value[key], nameBySort);
      stateSortColumn[nameBySort][key] = "desc";
      resetStateSortColumn(stateSortColumn.price);
    }
  } else if (direction === "asc") {
    if (nameBySort === "price") {
      sortAsc(kanban.value[key], nameBySort);
      stateSortColumn[nameBySort][key] = "asc";
      resetStateSortColumn(stateSortColumn.deadline);
    } else {
      sortDateStringAsc(kanban.value[key], nameBySort);
      stateSortColumn[nameBySort][key] = "asc";
      resetStateSortColumn(stateSortColumn.price);
    }
  } else {
    kanban.value[key] = [];
    kanban.value[key] = [...kanbanOriginal.value[key]];
    resetStateSortColumn(stateSortColumn.price);
    resetStateSortColumn(stateSortColumn.deadline);
  }
};

// сворачивание колонки
const handleHiddenColumn = (i: number) => {
  hiddenColumns.value[i] = !hiddenColumns.value[i];
};

// -------------------------------------------------------------------------

// ПАНЕЛЬ МЕНЮ

// обработчик клика на kanban(скрывает меню)

const handleClickKanban = (e: Event) => {
  const elem = e.target as HTMLElement;
  if (elem.closest('.kanban-column__menu') || elem.closest('.kanban-column__button-open-menu')) return;

  indexPanelMenu.value = -1;


  console.log(indexPanelMenu.value);

}

// обработчик открытия панели меню(сортировка, изменение цвета)
const indexPanelMenu = ref(-1);
const handleClickColumnDots = (i: number) => {
  if (i === indexPanelMenu.value) {
    indexPanelMenu.value = -1;
  } else {
    indexPanelMenu.value = i;
  }
  resetValueMenu();
  for (let index = 0; index < refMenuColumn.value.length; index++) {
    resetTransformXY(refMenuColumn.value[index]);
  }
};

// цвета
const colors_column = [
  "red",
  "green",
  "blue",
  "yellow",
  "orange",
  "purple",
  "pink",
  "brown",
  "gray",
  "cyan",
  "magenta",
  "silver",
  "white",
  "HotPink",
  "Chocolate",
];
const gradient_column = [
  "linear-gradient(90deg, rgb(95, 224, 211), rgb(255, 119, 137), rgb(255, 222, 58))",
  "linear-gradient(90deg, rgb(32, 21, 94), rgb(123, 104, 238), rgb(255, 255, 255))",
  "linear-gradient(90deg, rgb(234, 242, 143), rgb(205, 232, 181), rgb(255, 242, 213), rgb(247, 250, 219))",
  "linear-gradient(90deg, rgb(210, 205, 198), rgb(8, 166, 147), rgb(58, 77, 95), rgb(39, 44, 63))",
  "linear-gradient(90deg, rgb(136, 0, 21), rgb(249, 208, 122), rgb(202, 51, 5))",
];

// обработчик изменения цвета колонок
const handleChangeColorColumn = (key: TypeProjectStatus, color: string) => {
  columnColors.value[key] = color;

  localStorage.setItem(
    `${authStore.user.$id}-columnColors`,
    JSON.stringify(columnColors.value)
  );
};

// -------------------------------------------------------------------------

// ФОРМА

// обработчик клика на page-project__wrapper-form-add(закрывает форму)
const handleClickWrapperFormAdd = ((e: Event) => {
  const elem = e.target as HTMLElement;
  if (!refFormAdd.value.contains(elem)) {
    addFormStore.setOpen(false)
  }
})


// обработчик изменения статуса формы при нажатии на dots разных колонок
const statusNewProject = ref<TypeProjectStatus>("NEW");

const handleAddProject = (status: TypeProjectStatus) => {
  addFormStore.setOpen(true);
  statusNewProject.value = status;
};
const handleChangeStatus = (status: TypeProjectStatus) => {
  statusNewProject.value = status;
};

// -------------------------------------------------------------------------

//БОКОВАЯ ПАНЕЛЬ:

// данные для вывода в боковой панели
const asidePanelData = ref<DataCardAppWrite | null>(null);
// state боковой панели
const asidePanelVisible = ref(false);

// обработчик клика на карточку для появления боковой панели
const handleClickCard = (project: DataCardAppWrite) => {
  if (!flagClickCard) return;
  if (project) {
    asidePanelData.value = project;
  }
  asidePanelVisible.value = true;
  flagClickCard = false;
};

// клик на боковую панель и ее контейнер
const handleClickInAsidePanel = (e: Event) => {
  if (!e.target) return;
  const elem = e.target as HTMLElement;
  if (elem.closest(".page-project__aside-panel-inner")) return;

  handleHiddenAsidePanel();
};

// обработчик скрытия боковой панели
const handleHiddenAsidePanel = () => {
  asidePanelVisible.value = false;
  refPanelAside.value.setStateFlagHiddenFormUpdate(true);
  refPanelAside.value.setStateFlagBlur(false);
};

// обработчик добавления комментария
const handleAddComment = async (comment: string, projectId: string) => {
  await commentsStore.createComment({ text: comment, projectId: projectId });
  if (asidePanelData.value) {
    await commentsStore.getCommentsByCard(projectId);
    asidePanelData.value.comments = commentsStore.comments;
  }
};
// обработчик удаления комментария
const handleDeleteComment = async (idComment: string, projectId: string) => {
  await commentsStore.deleteComment(idComment);
  if (asidePanelData.value) {
    await commentsStore.getCommentsByCard(projectId);
    asidePanelData.value.comments = commentsStore.comments;
  }
};
// обработчик обновления данных карточки(project)
const handleUpdateCard = async (
  projectId: string,
  data: { [key: string]: string }
) => {
  try {
    await refPanelAside.value.setStateFlagBlur(true);
    await projectsStore.updateProject(projectId, data);
    await projectsStore.getProjectsByUser();
    await getProjects(projectsStore.projects);
    updateCardInAside(projectId);
  } catch (error) {
    console.log(error);
  } finally {
    await refPanelAside.value.setStateFlagBlur(false);
  }
};

// обработчик изменения цвета карточкм
const handleChangeColorCard = async (projectId: string, color: string) => {
  if (!projectId) return;
  await refPanelAside.value.setStateFlagBlur(true);

  try {
    await projectsStore.updateProject(projectId, { color: color });
    await projectsStore.getProjectsByUser();
    await getProjects(projectsStore.projects);
    updateCardInAside(projectId);
    await refPanelAside.value.setStateFlagBlur(true);
  } catch (error) {
    console.log(error);
  } finally {
    refPanelAside.value.setStateFlagBlur(false);
  }
};

// функция helpers, обновляет asidePanelData
function updateCardInAside(projectId: string) {
  const updateProject = projectsStore.projects.find(
    (project) => project.$id === projectId
  );
  if (updateProject?.$id) {
    asidePanelData.value = updateProject as DataCardAppWrite;
  }
}

// цвета карточки в боковой панели
const colors_card = ["red", "green", "black", "white"];

// -------------------------------------------------------------------------

// DRAG AND DROP:

// state card drag and drop
let selectedProduct: HTMLElement | null = null;
let valueTransformX = 0;
let valueTransformY = 0;
let touchClientMoveX = 0;
let touchClientMoveY = 0;
let clickProductX = 0;
let clickProductY = 0;

// state menu column drag and drop
let selectedColumnMenu: HTMLElement | null = null;
let valueMenuTransformX = 0;
let prevValueMenuTransformX = 0;
let clickMenuX = 0;

function handleTouchStartCard(e: any) {
  if (e.target.closest(".kanban__card")) {
    selectedProduct = e.target.closest(".kanban__card");
    if (!selectedProduct) return;
    clickProductX = e.type !== "mousedown" ? e.touches[0].clientX : e.clientX;
    clickProductY = e.type !== "mousedown" ? e.touches[0].clientY : e.clientY;

    flagClickCard = true;
  }

  if (e.target.closest(".kanban-column__menu")) {
    e.target.closest(".panel-sort")
      ? (flagEventSelect = true)
      : (flagEventSelect = false);
    selectedColumnMenu = e.target.closest(".kanban-column__menu");
    if (!selectedColumnMenu) return;
    console.log("handleTouchStart", valueMenuTransformX);
    clickMenuX = e.type !== "mousedown" ? e.touches[0].clientX : e.clientX;
  }
}
function handleTouchMoveCard(e: any) {
  if (selectedProduct) {
    e.preventDefault();
    indexPanelMenu.value = -1;

    const clientX = e.type !== "mousemove" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type !== "mousemove" ? e.touches[0].clientY : e.clientY;


    valueTransformX = clientX - clickProductX;
    valueTransformY = clientY - clickProductY;

    touchClientMoveX = clientX;
    touchClientMoveY = clientY;

    selectedProduct.style.transform = `translate(${valueTransformX}px, ${valueTransformY}px) rotate(10deg)`;

    selectedProduct.classList.add(`selected-product`);
    flagClickCard = false;
  }

  if (selectedColumnMenu && !flagEventSelect) {
    e.preventDefault();

    const clientX = e.type !== "mousemove" ? e.touches[0].clientX : e.clientX;

    valueMenuTransformX = clientX - clickMenuX + prevValueMenuTransformX;

    touchClientMoveX = clientX;

    selectedColumnMenu.style.transform = `translate(${valueMenuTransformX}px, ${0}px)`;

    selectedColumnMenu.classList.add(`selected-menu`);
  }
}
function handleTouchEnd(e: any) {
  if (selectedColumnMenu) {
    prevValueMenuTransformX = valueMenuTransformX;
    selectedColumnMenu.style.transform = `translate(${valueMenuTransformX}px, ${0}px)`;
    resetElemSelectedMenu();
  }

  if (selectedProduct) {
    console.log(stateSortColumn, "handleTouchEnd");

    const elementsUnderCard = document.elementsFromPoint(
      touchClientMoveX,
      touchClientMoveY
    );
    const projectStatus = selectedProduct.getAttribute("data-project-status");
    let flagUpdateColumn = false;
    let columnStatus: string | null = null;

    if (elementsUnderCard && projectStatus) {
      for (let index = 0; index < elementsUnderCard.length; index++) {
        const elemUnderCard = elementsUnderCard[index];
        columnStatus = elemUnderCard.getAttribute("data-status") || null;
        if (columnStatus && projectStatus !== columnStatus) {
          flagUpdateColumn = true;
          break;
        }
      }
    }

    if (!flagUpdateColumn) {
      selectedProduct.style.transform = `translate(${0}px, ${0}px)`;
      resetElemSelectedCard();
      resetValueCard();
    } else {
      const projectId = selectedProduct.getAttribute("data-project-id");
      const copySelectElem = selectedProduct;

      selectedProduct.style.transform = `translate(${valueTransformX}px, ${valueTransformY}px)`;
      resetElemSelectedCard();
      resetValueCard();
      copySelectElem.classList.add("card-drop-animation");

      if (columnStatus && projectId) {
        addCardInColumn(projectId, columnStatus);
      }
    }

    flagUpdateColumn = false;
  }
}

// Сброс состояния переменных DRAG AND DROP
function resetValueCard() {
  valueTransformX = 0;
  valueTransformY = 0;
  touchClientMoveX = 0;
  touchClientMoveY = 0;
}
function resetElemSelectedCard() {
  if (!selectedProduct) return;
  selectedProduct.classList.remove(`selected-product`);
  selectedProduct = null;
}
function resetValueMenu() {
  valueMenuTransformX = 0;
  prevValueMenuTransformX = 0;
}
function resetElemSelectedMenu() {
  if (!selectedColumnMenu) return;
  selectedColumnMenu.classList.remove(`selected-menu`);
  selectedColumnMenu = null;
}

// -------------------------------------------------------------------------

// HELPERS:

// добавление в ref kanban и kanbanOriginal данных из ref projects
function initKanban() {
  for (let index = 0; index < projects.value.length; index++) {
    const project = projects.value[index];

    if (project && project.status) {
      kanban.value[project.status].push(project);
      kanbanOriginal.value[project.status].push(project);
    }
  }
}

// сброс state ref kanban и  ref kanbanOriginal
function resetKanban() {
  kanban.value = {
    [ProjectStatus.NEW]: [],
    [ProjectStatus.IN_PROGRESS]: [],
    [ProjectStatus.REVIEW]: [],
    [ProjectStatus.REVISION]: [],
    [ProjectStatus.DONE]: [],
  };

  kanbanOriginal.value = {
    [ProjectStatus.NEW]: [],
    [ProjectStatus.IN_PROGRESS]: [],
    [ProjectStatus.REVIEW]: [],
    [ProjectStatus.REVISION]: [],
    [ProjectStatus.DONE]: [],
  };
}

// сортировка, приводит к состоянию которое записано в markRaw stateSortColumn
function applyColumnSorting() {
  for (const sortName in stateSortColumn) {
    if (Object.prototype.hasOwnProperty.call(stateSortColumn, sortName)) {
      for (const columnName in stateSortColumn[sortName]) {
        if (
          Object.prototype.hasOwnProperty.call(
            stateSortColumn[sortName],
            columnName
          )
        ) {
          const columnData = kanban.value[columnName as TypeProjectStatus];
          const nameSort = sortName;
          const direction = stateSortColumn[sortName][columnName];

          if (direction === "default") continue;
          if (direction === "desc") {
            if (nameSort === "price") {
              sortDesc(columnData, nameSort);
            } else {
              sortDateStringDesc(columnData, nameSort);
            }
          } else if (direction === "asc") {
            if (nameSort === "price") {
              sortAsc(columnData, nameSort);
            } else {
              sortDateStringAsc(columnData, nameSort);
            }
          } else {
            continue;
          }
        }
      }
    }
  }
}

// сброс в markRaw stateSortColumn к значению default
function resetStateSortColumn(obj: { [index: string]: string }) {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj[key] = "default";
    }
  }
}

//  сброс transform
function resetTransformXY(elem: HTMLElement) {
  elem.style.transform = `translate(${0}px, ${0}px)`;
}

// расчет общей стоимости карточек в колонке
function getSumPriceInColumn(key: TypeProjectStatus): number {
  const sumPrice = kanban.value[key].reduce((sum, card) => sum + card.price, 0);
  return sumPrice;
}

// watcher

watch(
  () => searchStore.flagSearch,
  (newFlagSearch) => {
    if (newFlagSearch) {
      const nameSearchedCard = searchStore.searchQuery;
      const allCards = projectsStore.projects;

      if (nameSearchedCard.trim().length !== 0) {
        const validCards = allCards.filter(
          (card) => card.name.toLowerCase() === nameSearchedCard.toLowerCase()
        );
        if (validCards.length === 0) return;
        getProjects(validCards);
      }
    } else {
      getProjects(projectsStore.projects);
    }
  }
);

onBeforeMount(() => {
  const localStoredColors = localStorage.getItem(
    `${authStore.user.$id}-columnColors`
  );
  columnColors.value = localStoredColors
    ? JSON.parse(localStoredColors)
    : columnColors.value;
});

onMounted(async () => {
  await projectsStore.getProjectsByUser();
  getProjects(projectsStore.projects);

  for (const key in kanban.value) {
    if (Object.prototype.hasOwnProperty.call(kanban.value, key)) {
      hiddenColumns.value.push(false);
    }
  }

  refKanban.value.addEventListener("touchstart", handleTouchStartCard, {
    passive: false,
  });
  refKanban.value.addEventListener("touchmove", handleTouchMoveCard, {
    passive: false,
  });
  refKanban.value.addEventListener("mousedown", handleTouchStartCard, {
    passive: false,
  });
  refKanban.value.addEventListener("mousemove", handleTouchMoveCard, {
    passive: false,
  });

  window.addEventListener("touchend", handleTouchEnd);
  window.addEventListener("mouseup", handleTouchEnd);
});

onUnmounted(async () => {
  if (refKanban.value) {
    refKanban.value.removeEventListener("touchstart", handleTouchStartCard);
    refKanban.value.removeEventListener("touchmove", handleTouchMoveCard);
    refKanban.value.removeEventListener("mousedown", handleTouchStartCard);
    refKanban.value.removeEventListener("mousemove", handleTouchMoveCard);

    window.removeEventListener("touchend", handleTouchEnd);
    window.removeEventListener("mouseup", handleTouchEnd);
  }
});
</script>

<template>
  <div class="page-project">
    <div style="font-size: 30px; padding: 20px">ВЫБОР КОМНАТЫ</div>

    <div @click="handleClickWrapperFormAdd" class="page-project__wrapper-form-add" :class="{
      'page-project__wrapper-form-add--visible': addFormStore.isOpen,
    }">
      <div ref="refFormAdd" class="page-project__form-add project-form">
        <div class="project-form__status">
          {{ STATUS_TRANSLATIONS[statusNewProject] }}
          <span v-if="loadStore.isLoading" class="project-form__load"></span>
        </div>
        <button class="project-form__close" @click="addFormStore.setOpen(false)">
          <img src="/public/images/icon-close.png" alt="закрыть форму" />
        </button>
        <div v-show="flagProjectCreated" style="color: wheat">
          проект добавлен
        </div>
        <FormCreateProject :status="statusNewProject" @change-status="handleChangeStatus"
          @create-project="handleSubmitCreateCard" />
      </div>
    </div>

    <div @click="handleClickKanban" ref="refKanban" class="kanban">
      <div :data-status="key" :style="{
        background: columnColors[key],
        backgroundRepeat: 'no-repeat',
      }" v-for="(column, key, i) in kanban" :key="key" class="kanban-column"
        :class="{ 'kanban-column--hidden': hiddenColumns[i] }">
        <div :aria-label="STATUS_TRANSLATIONS[key]" class="kanban-column__title">
          {{ STATUS_TRANSLATIONS[key] }}
        </div>
        <button aria-hidden="true" @click="handleHiddenColumn(i)" class="kanban-column__toggle-visible">
          <img src="/images/icon-toggle-column-white.png" alt="кнопка свернуть-развернуть колонку" />
        </button>
        <button @click="handleClickColumnDots(i)" class="kanban-column__button-open-menu">
          <img src="/images/icon-1.png" alt="открыть меню колонки" />
        </button>
        <button @click="handleAddProject(key)" class="kanban-column__add-project">
          <span><img src="/public/images/icon-2.png" alt="добавить карточку" /></span><span>добавить шабашку</span>
        </button>

        <Transition name="fade">
          <div v-show="indexPanelMenu === i" ref="refMenuColumn" class="kanban-column__menu column-menu" :class="{
            'kanban-column__menu--open': indexPanelMenu === i,
            'kanban-column__menu--test': i === 0,
          }">
            <button @click.stop="indexPanelMenu = -1" class="kanban-column__menu-close">
              <img src="/images/icon-close.png" alt="закрыть меню" />
            </button>
            <div class="column-menu__title">{{ STATUS_TRANSLATIONS[key] }}</div>
            <div class="column-menu__title">
              Общая стоимость карточек в колонке: <br />
              {{ getSumPriceInColumn(key) }} руб
            </div>
            <div class="column-menu__title">Сортировать:</div>
            <PanelSortByPrice @sort-select="(sortValue: string) => handleEmitSort(sortValue, key)" />
            <div class="column-menu__title">Выберите цвет колонки</div>
            <PanelChangeColor @click-color="(color: string) => handleChangeColorColumn(key, color)"
              :colors="colors_column" />
            <div class="column-menu__title">Выберите градиент для колонки</div>
            <PanelChangeColor @click-color="(color: string) => handleChangeColorColumn(key, color)"
              :colors="gradient_column" />
          </div>
        </Transition>


        <div class="kanban-column__container-cards">
          <div :style="{ background: project.color }" :data-project-status="key" :data-project-id="project.$id"
          v-for="(project, i) in column" class="kanban__card" :key="project.$id">
          <CardsKanbanCard :color="project.color" :id="project.$id" :status="project.status" :client="project.client"
            :name="project.name" :price="project.price" :link="project.link" :deadline="project.deadline"
            :createdAt="project.$createdAt" :description="project.description" @click-card="handleClickCard(project)"
            @delete-card="handleDeleteCard(project)" />
        </div>
        </div>
        


      </div>
    </div>



    <div @click="handleClickInAsidePanel" class="page-project__aside-panel"
      :class="{ 'page-project__aside-panel--visible': asidePanelVisible }">
      <div class="page-project__aside-panel-inner">
        <button class="page-project__aside-panel-close" @click="handleHiddenAsidePanel">
          <img src="/public/images/icon-close.png" alt="закрыть боковую панель" />
        </button>
        <PanelAsideCardInfo ref="refPanelAside" @update-card="handleUpdateCard"
          :color="asidePanelData?.color || 'black'" :id="asidePanelData?.$id" :client="asidePanelData?.client"
          :client_email="asidePanelData?.client_email" :client_phone="asidePanelData?.client_phone"
          :name="asidePanelData?.name" :price="asidePanelData?.price" :description="asidePanelData?.description"
          :comments="asidePanelData?.comments" :link="asidePanelData?.link" :createdAt="asidePanelData?.$createdAt"
          :deadline="asidePanelData?.deadline" @add-comment="handleAddComment" @delete-comment="handleDeleteComment">
          <template #card>
            <CardsKanbanCard v-if="asidePanelData?.$id" :color="asidePanelData?.color" :id="asidePanelData?.$id"
              :status="asidePanelData?.status || ProjectStatus.NEW" :client="asidePanelData?.client"
              :name="asidePanelData?.name" :price="asidePanelData?.price || 0"
              :description="asidePanelData?.description" :link="asidePanelData?.link"
              :deadline="asidePanelData?.deadline" :createdAt="asidePanelData?.$createdAt || '-'"
              @delete-card="asidePanelData && handleDeleteCard(asidePanelData)" />
          </template>

          <template #color>
            <div style="margin-bottom: 10px">изменить цвет карточки</div>

            <PanelChangeColor @click-color="(color: string) => handleChangeColorCard(asidePanelData?.$id || '', color)"
              :colors="colors_card" />
          </template>
        </PanelAsideCardInfo>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.column-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--color-light-50);
  padding: 20px;
  -webkit-user-select: none;
  /* Chrome/Safari */
  -moz-user-select: none;
  /* Firefox */
  -ms-user-select: none;
  /* IE/Edge */
  user-select: none;
  /* Стандарт  снять выделение*/
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
}

.page-project {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding-right: 20px;
  padding-left: 20px;
  position: relative;

  &__wrapper-form-add {
    position: fixed;
    inset: 0;
    z-index: 1000;
    opacity: 0;
    backdrop-filter: blur(10px);
    pointer-events: none;
    animation: hiddenOpacity var(--timing-animation-min) forwards;

    &--visible {
      opacity: 1;
      pointer-events: initial;
      animation: visibleOpacity var(--timing-animation-min) forwards;

      .page-project__form-add {
        opacity: 1;
        filter: blur(0px);
      }
    }
  }

  &__form-add {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    filter: blur(2000px);
    transition: filter 0.5s;
  }

  &__aside-panel {
    display: flex;
    justify-content: flex-end;
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100vw;
    z-index: 1000;
    transform: translateX(100%);
    background-color: rgba(0, 0, 0, 0);
    transition: transform var(--timing-animation-min),
      backdrop-filter var(--timing-animation-min) var(--timing-animation-min);

    &--visible {
      transform: translateX(0);
      backdrop-filter: blur(10px);
    }
  }

  &__aside-panel-inner {
    width: 50vw;
    max-width: 900px;
    overflow-y: auto;
    background: linear-gradient(220deg,
        #ff8ae9,
        #6100b5,
        #0000a1,
        #000729,
        #000000);
    transition: transform 1s;

    @media (max-width: 1400px) {
      width: 100%;
    }
  }

  &__aside-panel-close {
    position: absolute;
    right: 40px;
    top: 20px;
    z-index: 100;
    background-color: transparent;
    border: none;
    cursor: pointer;
  }
}

.project-form {
  position: relative;
  max-width: 450px;
  width: 100%;
  border: solid rgb(255, 255, 255) 2px;
  border-radius: var(--radius-sm);
  background-color: var(--main-color);

  &::before {
    content: "...";
    position: absolute;
    width: 100px;
    height: 50px;
    top: -25px;
    left: 50%;
    z-index: -1;
    border: solid rgb(255, 255, 255) 2px;
    border-radius: 5px 5px 0 0;

    background-color: var(--main-color);
    transform: translateX(-50%);
    color: var(--color-light-50);
    text-align: center;
    letter-spacing: 1px;
    font-size: 20px;
    text-shadow: 1px 0 0 red;
  }

  &__status {
    padding-top: 20px;
    color: var(--color-light-50);
    text-align: center;
    font-weight: 700;
    background-color: var(--main-color);
    border-radius: 7px 7px 0 0;
  }

  &__load {
    position: absolute;
    top: 20px;
    right: 100px;
    width: 20px;
    height: 20px;
    background-color: red;
    animation: rotate 1s infinite linear;
  }

  &__close {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
    width: 50px;
    height: 50px;
    background-color: transparent;
    border: none;
    padding: 17px;
    cursor: pointer;
  }
}

.kanban {
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(5, 300px);
  grid-auto-rows: min-content;
  align-items: start;
  gap: 20px;

  @media (max-width: 380px) {
    grid-template-columns: 1fr;
  }

  &__card {
    position: relative;
    width: 100%;
    max-width: 300px;
    border-radius: var(--radius-md);
    color: var(--color-light-50);

    animation: cardAdd 0.2s ease-in;
    box-shadow: 5px 5px 15px 0px rgba(0, 0, 0, 0.8);
    transition: box-shadow 1s;
    -webkit-user-select: none;
    /* Chrome/Safari */
    -moz-user-select: none;
    /* Firefox */
    -ms-user-select: none;
    /* IE/Edge */
    user-select: none;
    /* Стандарт  снять выделение*/
    cursor: pointer;

    &:active {
      cursor: grabbing;
    }
  }
}

.kanban-column {
  // display: flex;
  // flex-direction: column;
  // align-items: center;

  // gap: 15px;
  background-color: white;
  padding: 20px 20px 40px;
  position: relative;
  border-radius: var(--radius-md);
  box-shadow: 0 0 20px 5px black;
  max-height: 100%;
  // max-height: 800px;
  height: min-content;
  max-height: 700px;
  overflow-y: scroll;
  transition: max-height .1s ease-in;


  /* Фикс для Firefox */
  scrollbar-width: thin;
  scrollbar-color: #ccc transparent;


  &--hidden {
    overflow: hidden;
    max-height: 70px;

    .kanban-column__button-open-menu {
      opacity: 0;
    }

    .kanban-column__add-project {
      & span {
        opacity: 0;
      }

    }

    .kanban-column__toggle-visible {
      transform: rotateX(180deg);
    }
  }

  &__container-cards {
    background-color: red;  
  }

  &__title {
    background-color: black;
    width: 100%;
    padding-top: 3px;
    padding-bottom: 3px;
    border-radius: var(--radius-sm);
    text-align: center;
    font-size: 22px;
    font-weight: 700;
    color: var(--color-light-50);
  }

  &__toggle-visible {
    position: absolute;
    top: 10px;
    right: 0px;
    background-color: transparent;
    transition: transform var(--timing-animation-min);
    border: none;

    width: 50px;
    height: 50px;
    cursor: pointer;

    & img {
      width: 30px;
      height: 30px;
    }
  }

  &__button-open-menu {
    width: 50px;
    height: 50px;
    cursor: pointer;
    border: none;
    background-color: transparent;
    transition: opacity 1s linear;
  }

  &__menu {
    position: absolute;
    top: 120px;
    right: 0;
    left: 0;
    z-index: 50;
    border-radius: var(--radius-md);
    border: solid white 2px;
    background-color: rgb(0, 0, 0);
    transition: transform var(--timing-animation-min) linear;


    &--open {}

    &--test {}
  }

  &__menu-close {
    position: absolute;
    cursor: pointer;
    right: 0;
    top: 0;
    background-color: transparent;
    width: 40px;
    height: 40px;
    border: none;
    padding: 15px;
  }

  &__add-project {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    height: 30px;
    padding-right: 10px;
    padding-left: 10px;
    border: none;
    background-color: transparent;
    font-weight: 600;
    letter-spacing: var(--letter-spacing);
    cursor: pointer;



    span {
      display: flex;
      align-items: center;
      height: 100%;
      line-height: 2;
      opacity: 1;
      transition: opacity 1s;
    }
  }



}

.card-drop-animation {
  animation: cardDrop linear 3s;
}

.selected-product {
  // position: relative;

position: fixed;
z-index: 1000;
  box-shadow: -5px -5px 15px 0px rgba(0, 0, 0, 0.8);

  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background-color: inherit;
    border-radius: var(--radius-lg);
    filter: blur(5px);
  }
}

.selected-menu {}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s, transform 1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes heightAnimation {
  0% {
    max-height: 50vh;
  }

  100% {
    max-height: 70px;
  }
}

@keyframes visibleOpacity {
  0% {
    opacity: 0;
    visibility: hidden;
  }

  50% {
    opacity: 0;
    visibility: visible;
  }

  100% {
    opacity: 1;
    visibility: visible;
  }
}

@keyframes hiddenOpacity {
  0% {
    opacity: 1;
    visibility: visible;
  }

  50% {
    opacity: 1;
    visibility: visible;
  }

  100% {
    opacity: 0;
    visibility: hidden;
  }
}

@keyframes cardAdd {
  0% {
    z-index: 2000;
    transform: scale(2);
  }

  100% {
    z-index: initial;
    transform: scale(1);
  }
}

@keyframes cardDrop {
  0% {
    position: fixed;
    opacity: 1;
    z-index: 10000;
  }

  100% {
    position: fixed;
    opacity: 0;
    z-index: 10000;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
</style>

<!-- sotto36623@gmail.com -->
