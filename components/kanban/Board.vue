<script setup lang="ts">
import { ProjectStatus } from "~/stores/cards.store";
import type { DataCardAppWrite, TypeProjectStatus } from "~/stores/cards.store";

import { STATUS_TRANSLATIONS } from "~/constants/project.constants";
import {
  sortAsc,
  sortDesc,
  sortDateStringAsc,
  sortDateStringDesc,
} from "#imports";

import {
  GRADIENT_COLUMN,
  COLORS_COLUMN,
} from "~/constants/project.constants";

// type
type Kanban = {
  [key in TypeProjectStatus]: DataCardAppWrite[];
};
type SortColumns = {
  [key: string]: {
    [key: string]: string;
  };
};

const eventStore = useEventStore();
const colorColumnStore = useColumnColor();


const props = withDefaults(defineProps<KanbanProps>(), {
  isDraggingAllowed: true,
  projects: () => [],
});

watch(
  () => props.projects,
  () => {
    refreshKanban();
  }
);

type KanbanProps = {
  projects?: DataCardAppWrite[];
  isDraggingAllowed?: boolean;
};
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

// ref ссылки на элементы DOM
const refKanban = ref();
const refMenuColumn = ref();
const refWrapperColumn = ref();


// flags
let flagClickCard = false;
let flagEventSelect = false;


const emit = defineEmits([
  "scroll-page",
  "card-create",
  "card-delete",
  "card-move-to-column",

  "card-click",
  "card-drag-start",
  "card-drag",
  "card-drag-end",
]);


// создание карточки
const emitCreateCard = (status: TypeProjectStatus) => {
  emit("card-create", status);
};

// Удаление карточки
const emitDeleteCard = async (project: DataCardAppWrite) => {
  emit("card-delete", project);
};

// добавление карточки в колонку
function emitAddCardInColumn(projectId: string, columnStatus: string) {
  emit("card-move-to-column", projectId, columnStatus);
}

// обработчик клика на карточку
const emitClickCard = (project: DataCardAppWrite) => {
  if (!flagClickCard) return;
  if (project) {
    emit('card-click', project);
  }
  flagClickCard = false;
};





/**
 * Полностью обновляет состояние канбан-доски:
 * 1. Сбрасывает текущее состояние канбана (очищает все колонки)
 * 2. Инициализирует новое состояние на основе текущего списка проектов
 * 3. Применяет активные правила сортировки для колонок
 * 4. Удаляет визуальное выделение колонки под карточкой
 * 
 * Используется как обработчик изменения списка проектов (watch),
 * гарантирует синхронизацию данных и UI при любых изменениях в props.projects
 */

 function refreshKanban() {
  resetKanban();
  initKanban();
  applyColumnSorting();
  removeHighlighted();
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

const handleHiddenColumn = (i: number) => {
  hiddenColumns.value[i] = !hiddenColumns.value[i];
};

// -------------------------------------------------------------------------

// ПАНЕЛЬ МЕНЮ

// обработчик клика на kanban(скрывает меню)
const handleClickKanban = (e: Event) => {
  const elem = e.target as HTMLElement;
  if (
    elem.closest(".kanban-column__menu") ||
    elem.closest(".kanban-column__button-open-menu")
  )
    return;

  indexPanelMenu.value = -1;
};

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
const color_transparent = ["rgba(255, 255, 255, 0.199)"];
const colors_column = COLORS_COLUMN;
const gradient_column = GRADIENT_COLUMN;

// обработчик изменения цвета колонок
const handleChangeColorColumn = (key: TypeProjectStatus, color: string) => {
  colorColumnStore.saveColor(key, color);
};









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

// .kanban-column__container-cards и scrollYContainerCards, нужны для исправления прыжка карточки по вертикали при dragover,когда в kanban-column__container-cards появляется вертикальный scroll
let elemContainerCards: null | HTMLElement = null;
let scrollYContainerCards = 0;

// переменные, нужны для исправления прыжка карточки по вертикали при dragover,
// когда появляется горизонтальный scroll в page-project
let scrollXPageProducts = 0;


function emitScroll(direction: "left" | "right") {
  emit("scroll-page", direction);
}

// id перетаскиваемой карточки
let projectIdDragover: string | null = null;

// обработчики drag and drop

function handleTouchStart(e: any) {

  // карточка
  if (e.target.closest(".kanban__card")) {
    selectedProduct = e.target.closest(".kanban__card");

    if (!selectedProduct) return;

    clickProductX = e.type !== "mousedown" ? e.touches[0].clientX : e.clientX;
    clickProductY = e.type !== "mousedown" ? e.touches[0].clientY : e.clientY;

    flagClickCard = true;
    projectIdDragover = selectedProduct.getAttribute("data-project-id");

    elemContainerCards = e.target.closest(".kanban-column__container-cards");

    if (!elemContainerCards) return;

    scrollYContainerCards = elemContainerCards.scrollTop;
  }

  // меню колонки
  if (e.target.closest(".kanban-column__menu")) {
    e.target.closest(".panel-sort")
      ? (flagEventSelect = true)
      : (flagEventSelect = false);

    selectedColumnMenu = e.target.closest(".kanban-column__menu");

    if (!selectedColumnMenu) return;

    clickMenuX = e.type !== "mousedown" ? e.touches[0].clientX : e.clientX;
  }
}
function canScrollRight(element: HTMLElement, scrollWidth: number): boolean {
  // console.log(element,'elem', scrollWidth);
  
  const { scrollLeft, clientWidth } = element;
  console.log(scrollLeft, clientWidth);
  

  return scrollLeft + clientWidth < scrollWidth;
}


function handleTouchMove(e: any) {



  if (selectedProduct) {
    e.preventDefault();
    
    emit('card-drag');
    indexPanelMenu.value = -1;

    const clientX = e.type !== "mousemove" ? e.touches[0].clientX : e.clientX;
    const clientY = e.type !== "mousemove" ? e.touches[0].clientY : e.clientY;


  // console.log(refKanban.value.scrollWidth, 'refKanban.value.scrollWidth', clientX);
   console.log( canScrollRight(refKanban.value, refKanban.value.scrollWidth ));
   
    
    if (clientX + 95 > window.innerWidth) {
      console.log(clientX, window.innerWidth);

      emitScroll("right");
  
        console.log(props.isDraggingAllowed, 'props.isDraggingAllowed');
        if (props.isDraggingAllowed) {
          scrollXPageProducts += 10;
        }
        
  
    } else if (clientX - 95 < 0) {
      console.log(clientX, window.innerWidth);
      emitScroll("left");
      if (props.isDraggingAllowed) {
        scrollXPageProducts -= 10;
      }
    }

    valueTransformX = clientX - clickProductX + scrollXPageProducts;
    valueTransformY = clientY - clickProductY - scrollYContainerCards;

    touchClientMoveX = clientX;
    touchClientMoveY = clientY;

    selectedProduct.style.transform = `translate(${valueTransformX}px, ${valueTransformY}px) rotate(10deg)`;

    selectedProduct.classList.add(`selected-product`);

    flagClickCard = false;

    //удаляем предыдущую  подсветку колонки под карточкой
    removeHighlighted();

    const hoverDataElem = {
      x: touchClientMoveX,
      y: touchClientMoveY,
      classHover: "highlight",
      targetClass: "kanban__wrapper-column",
    };

    // подсветка колонки под карточкой(функция из utils)
    hoverInElemUnder(hoverDataElem);

    // записываем в store для реализации эффекта у кнопки смены комнат
    eventStore.initDragover();
    
    if (projectIdDragover) {
      eventStore.setCardIdDragOver(projectIdDragover);
    }

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

function handleTouchEnd() {
  // записываем в store  drag over
  eventStore.stopDragover();

  if (selectedColumnMenu) {
    prevValueMenuTransformX = valueMenuTransformX;
    selectedColumnMenu.style.transform = `translate(${valueMenuTransformX}px, ${0}px)`;
    resetElemSelectedMenu();
    // refPageProjects.value.style.scrollSnapType = "x mandatory";
  }

  if (selectedProduct) {
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
      removeHighlighted();
    } else {
      const projectId = projectIdDragover;
      const copySelectElem = selectedProduct;

      selectedProduct.style.transform = `translate(${valueTransformX}px, ${valueTransformY}px)`;
      resetElemSelectedCard();
      resetValueCard();
      copySelectElem.classList.add("card-drop-animation");

      if (columnStatus && projectId) {
        emitAddCardInColumn(projectId, columnStatus);
      }
    }

    flagUpdateColumn = false;
    emit('card-drag-end');
  }

  projectIdDragover = null;
}

// Сброс состояния переменных DRAG AND DROP
function resetValueCard() {
  valueTransformX = 0;
  valueTransformY = 0;
  touchClientMoveX = 0;
  touchClientMoveY = 0;
  scrollXPageProducts = 0;
  scrollYContainerCards = 0;
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
  for (let index = 0; index < props.projects.length; index++) {
    const project = { ...props.projects[index] };

    if (project && project.status) {
      kanban.value[project.status].push(project);
      kanbanOriginal.value[project.status].push(project);
    }
  }
}

// сброс подсветки

function removeHighlighted() {
  const elemHighlighted = document.querySelector(".highlight");
  if (elemHighlighted) {
    elemHighlighted.classList.remove("highlight");
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


// хуки

onBeforeMount(() => {
  colorColumnStore.loadColor();
  for (const key in kanban.value) {
    if (Object.prototype.hasOwnProperty.call(kanban.value, key)) {
      hiddenColumns.value.push(false);
    }
  }
});

onMounted(() => {

  refKanban.value.addEventListener("touchstart", handleTouchStart, {
    passive: false,
  });
  refKanban.value.addEventListener("touchmove", handleTouchMove, {
    passive: false,
  });
  refKanban.value.addEventListener("mousedown", handleTouchStart, {
    passive: false,
  });
  refKanban.value.addEventListener("mousemove", handleTouchMove, {
    passive: false,
  });

  window.addEventListener("touchend", handleTouchEnd);
  window.addEventListener("mouseup", handleTouchEnd);
});

onUnmounted(() => {
  if (refKanban.value) {
    refKanban.value.removeEventListener("touchstart", handleTouchStart);
    refKanban.value.removeEventListener("touchmove", handleTouchMove);
    refKanban.value.removeEventListener("mousedown", handleTouchStart);
    refKanban.value.removeEventListener("mousemove", handleTouchMove);

    window.removeEventListener("touchend", handleTouchEnd);
    window.removeEventListener("mouseup", handleTouchEnd);
  }

  
});
</script>

<template>
  <div
    @click="handleClickKanban"
    ref="refKanban"
    class="page-project__kanban kanban"
  >
    <div
      ref="refWrapperColumn"
      v-for="(column, key, i) in kanban"
      :key="key"
      :style="{ '--column-color': colorColumnStore.columnColors[key] }"
      class="kanban__wrapper-column"
      :data-status="key"
    >
      <div
        :style="{
          background: colorColumnStore.columnColors[key],
        }"
        class="kanban-column kanban__column"
        :class="{ 'kanban-column--hidden': hiddenColumns[i] }"
      >
        <div
          :aria-label="STATUS_TRANSLATIONS[key]"
          class="kanban-column__title"
        >
          {{ STATUS_TRANSLATIONS[key] }}
        </div>
        <button
          aria-hidden="true"
          @click="handleHiddenColumn(i)"
          class="kanban-column__toggle-visible"
        >
          <img
            src="/images/icon-toggle-column-white.png"
            alt="кнопка свернуть-развернуть колонку"
          />
        </button>
        <button
          @click="handleClickColumnDots(i)"
          class="kanban-column__button-open-menu"
        >
          <img src="/images/icon-1.png" alt="открыть меню колонки" />
        </button>
        <button @click="emitCreateCard(key)" class="kanban-column__add-project">
          <span
            ><img
              src="/public/images/icon-2.png"
              alt="добавить карточку" /></span
          ><span>добавить шабашку</span>
        </button>

        <Transition name="fade">
          <div
            v-show="indexPanelMenu === i"
            ref="refMenuColumn"
            class="kanban-column__menu column-menu"
            :class="{
              'kanban-column__menu--open': indexPanelMenu === i,
              'kanban-column__menu--test': i === 0,
            }"
          >
            <button
              @click.stop="indexPanelMenu = -1"
              class="kanban-column__menu-close"
            >
              <img src="/images/icon-close.png" alt="закрыть меню" />
            </button>
            <div class="column-menu__title">
              {{ STATUS_TRANSLATIONS[key] }}
            </div>
            <div class="column-menu__title">
              Общая стоимость карточек в колонке:
              <div class="total-cost">{{ getSumPriceInColumn(key).toLocaleString('ru-RU') }} руб</div>
            </div>
            <div class="column-menu__title">Сортировать:</div>
            <PanelsSortPanel
              @sort-select="(sortValue: string) => handleEmitSort(sortValue, key)"
            />
            <div class="column-menu__title">цвет колонки</div>
            <PanelsColorsPanel
              @click-color="(color: string) => handleChangeColorColumn(key, color)"
              :colors="colors_column"
            />
            <div class="column-menu__title">градиент колонки</div>
            <PanelsColorsPanel
              @click-color="(color: string) => handleChangeColorColumn(key, color)"
              :colors="gradient_column"
            />
            <div class="column-menu__title">Сбросить цвет</div>
            <PanelsColorsPanel
              @click-color="(color: string) => handleChangeColorColumn(key, color)"
              :colors="color_transparent"
              ><img
                class="reset-color-img"
                src="/images/icon-close.png"
                alt="сбросить цвет"
            /></PanelsColorsPanel>
          </div>
        </Transition>

        <div class="kanban__container-cards kanban-column__container-cards">
          <div
            :style="{ background: project.color }"
            :data-project-status="key"
            :data-project-id="project.$id"
            v-for="(project, i) in column"
            class="kanban__card"
            :key="project.$id"
          >
            <CardsKanbanCard
            v-if="props.projects.length"
              :color="project.color"
              :id="project.$id"
              :status="project.status"
              :client="project.client"
              :name="project.name"
              :link="project.link"
              :price="project.price"
              :deadline="project.deadline"
              :createdAt="project.$createdAt"
              :description="project.description"
              @click-card="emitClickCard(project)"
              @delete-card="emitDeleteCard(project)"
            />
          </div>
        </div>
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

.kanban {
  display: grid;
  grid-template-columns: repeat(5, 300px);
  
  // width: 1580px;
  // width: max-content;
  height: 100%;
  gap: 20px;

  @media (max-width: 1200px) {
  }

  @media (max-width: 550px) {
    // width: 1430px;
  }

  &__wrapper-column {
    position: relative;
    height: 100%;
    scroll-snap-align: start;

    &::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--radius-md);
      background: rgba(0, 0, 0, 0.095);
    }
  }

  &__wrapper-column:last-child {
    .column-menu {
      left: -360px;
      right: 0;

      @media (max-width: 550px) {
        right: 0;
        left: -75vw;
      }
    }
  }

  &__container-cards {
    padding-left: 25px;
    
  }

  &__card {
    position: relative;
    max-width: 250px;
    width: 100%;
    border-radius: var(--radius-md);
    margin-bottom: 10px;
    animation: cardAdd 0.2s ease-in;
    will-change: transform;

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
  position: relative;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  
  border-radius: var(--radius-md);
  background: rgba(255, 255, 255, 0.199);
  box-shadow: 0 0 20px 1px black;
  transition: max-height var(--timing-animation-min) ease-in;
  -webkit-user-select: none;
  /* Для Safari */
  -moz-user-select: none;
  /* Для Firefox */
  -ms-user-select: none;
  /* Для IE/Edge */
  user-select: none;
  /* Стандартный синтаксис */

  @media (max-width: 550px) {
  }

  &:not(.kanban-column--hidden) {
    .kanban-column__container-cards {
      animation: overflow 0s 0.2s forwards ease-in,
        scrollVisible 2s ease-in forwards;
    }
  }

  &--hidden {
    overflow: hidden;
    max-height: 70px;

    .kanban-column__container-cards {
      scrollbar-color: rgba(250, 250, 250, 0) rgba(0, 0, 0, 0);
      animation: overflow 0s 0.2s forwards ease-in;
    }

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
    width: 100%;
    max-height: max(650px, 60vh);
    padding-top: 20px;
    scrollbar-width: thin;
    scrollbar-color: rgb(250, 250, 250) black;

    @media (max-width: 550px) {
    
    }
  }

  &__title {
    border-radius: var(--radius-sm);
    padding-top: 3px;
    padding-bottom: 3px;
    margin-left: 10px;
    margin-right: 10px;
    background-color: black;
    text-align: center;
    font-size: 20px;
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
    display: flex;
    justify-content: center;
    width: 50%;
    height: 50px;
    border: none;
    margin-left: auto;
    margin-right: auto;
    background-color: transparent;
    transition: opacity 1s linear;
    filter: drop-shadow(0 0 2px white);

    cursor: pointer;

    & img {
      width: 50px;
    }
  }

  &__menu {
    position: absolute;
    top: 120px;
    right: -360px;
    width: 360px;
    // left: 0;
    z-index: 50;
    border-radius: var(--radius-md);
    border: solid white 2px;
    background-color: rgba(0, 0, 0, 0.9);
    transition: transform var(--timing-animation-min) ease-out;

    @media (max-width: 550px) {
      width: 75vw;
      right: -75vw;
      font-size: 14px;
    }

    @media (max-width: 400px) {
      width: 90vw;
    }
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
    justify-content: center;
    gap: 20px;
    height: 50px;
    padding: 15px;
    border: none;
    background-color: transparent;
    font-weight: 600;
    letter-spacing: var(--letter-spacing);
    text-shadow: 0 0 20px white;
    cursor: pointer;

    & span {
      display: flex;
      align-items: center;
      height: 100%;
      line-height: 2;
      opacity: 1;
      transition: opacity 1s;
    }

    & span:first-child {
      filter: drop-shadow(0 0 10px white);
    }
  }
}

.card-drop-animation {
  position: absolute;
  animation: cardDrop linear 3s;
}

.selected-product {
  position: absolute;
  z-index: 1000;
  filter: blur(1px);

  &::before {
    content: "";
    position: absolute;
    z-index: -1;
    top: -10px;
    left: -15px;
    right: 0px;
    bottom: 0px;
    background: inherit;
    border-radius: var(--radius-lg);
    filter: blur(5px);
  }
}

.selected-menu {
  background-color: transparent;
}

.highlight {
  &::before {
    opacity: 0.2;
    background: var(--column-color);
  }
}

.reset-color-img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
}

.total-cost {
  padding-top: 8px;
  padding-bottom: 2px;
  font-weight: 700;
  border-bottom: solid white 1px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s, transform 1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes hiddenToVisible {
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

@keyframes visibleToHidden {
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
    position: absolute;
    z-index: 1000;
    transform: scale(2);
  }

  25% {
    position: absolute;
    z-index: 1000;
    transform: scale(1.75);
  }

  50% {
    position: absolute;
    z-index: 1000;
    transform: scale(1.5);
  }

  75% {
    position: absolute;
    z-index: 1000;
    transform: scale(1.25);
  }

  100% {
    position: relative;
    z-index: initial;
    transform: scale(1);
  }
}

@keyframes cardDrop {
  0% {
    opacity: 1;
    z-index: 1000;
  }

  100% {
    opacity: 0;
    z-index: 1000;
  }
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes overflow {
  0% {
    overflow-y: visible;
    overflow-x: visible;
  }

  100% {
    overflow-y: auto;
    overflow-x: hidden;
  }
}

@keyframes scrollVisible {
  0% {
    scrollbar-color: rgba(250, 250, 250, 0) rgba(0, 0, 0, 0);
  }

  100% {
    scrollbar-color: rgba(250, 250, 250, 1) rgba(0, 0, 0, 1);
  }
}
</style>
