<script setup lang="ts">
import { ProjectStatus } from "~/stores/cards.store";
import type { DataCardAppWrite, TypeProjectStatus } from "~/stores/cards.store";
import type { FormCardKanban } from "~/components/forms/CreateProject.vue";
import { STATUS_TRANSLATIONS } from "~/constants/project.constants";
import {
  sortAsc,
  sortDesc,
  sortDateStringAsc,
  sortDateStringDesc,
} from "#imports";

import {
  COLORS_CARD,
  GRADIENT_COLUMN,
  COLORS_COLUMN,
} from "~/constants/project.constants";

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
const projectsStore = useProjectsStore();
const addFormStore = useFormAddStore();
const commentsStore = useCommentsStore();
const loadStore = useIsLoadingStore();
const searchStore = useSearchStore();
const eventStore = useEventStore();
const colorColumnStore = useColumnColor();

// state kanban / project / kanbanOriginal-нужен для восстановления state kanban без перезагрузки

const projects = ref<DataCardAppWrite[]>([]);


// flags
// let flagClickCard = false;

// ref ссылки на элементы DOM
const refPageProjects = ref();

const refPanelAside = ref();
const refFormAdd = ref();

// -------------------------------------------------------------------------

// CARDS / COLUMNS:

const handleClickCard = (project: DataCardAppWrite) => {

  if (project) {
    asidePanelData.value = project;
  
  }
  asidePanelVisible.value = true;
  
};


async function getProjects(arrProjects: DataCardAppWrite[]) {
  projects.value = arrProjects;
}

async function createProject(project: FormCardKanban) {
  const dataProject = {
    ...project,
  };
  await projectsStore.createProject(dataProject);
}

// добавление карточки в колонку
async function addCardInColumn(projectId: string, columnStatus: string) {
  await projectsStore.updateProject(projectId, { status: columnStatus });
  await projectsStore.getProjectsByUser();
  await getProjects(projectsStore.projects);
}
const handleDeleteProject = async (project: DataCardAppWrite) => {
  await deleteProject(project);
  await getProjects(projectsStore.projects);
  asidePanelVisible.value = false;
};

async function deleteProject(project: DataCardAppWrite) {
  await projectsStore.deleteProject(project.$id);
  // await getProjects();
}
// -------------------------------------------------------------------------










// ФОРМА

// обработчик клика на page-project__wrapper-form-add(закрывает форму)
const handleClickWrapperFormAdd = (e: Event) => {
  const elem = e.target as HTMLElement;
  if (!refFormAdd.value.contains(elem)) {
    addFormStore.setOpen(false);
  }
};

// обработчик изменения статуса формы при нажатии на dots разных колонок
const statusNewProject = ref<TypeProjectStatus>("NEW");

const handleAddProject = (status: TypeProjectStatus) => {
  addFormStore.setOpen(true);
  statusNewProject.value = status;
};

// добавление карточки через форму
const handleSubmitCreateCard = async (project: FormCardKanban) => {
  await createProject(project);
  await getProjects(projectsStore.projects);
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
const colors_card = COLORS_CARD;
// -------------------------------------------------------------------------

// DRAG AND DROP:

let baseScrollWidthPageProducts = 0;


// -------------------------------------------------------------------------

// проверка
function canScrollRight(element: HTMLElement, scrollWidth: number): boolean {
  const { scrollLeft, clientWidth } = element;

  return scrollLeft + clientWidth < scrollWidth;
}

// -------------------------------------------------------------------------

// watcher


watch(
  () => searchStore.flagSearch,
  (search) => {
    if (search) {
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
      console.log('watch getProjects(projectsStore.projects);');
      
      getProjects(projectsStore.projects);
    }
  }
);

watch(
  () => [asidePanelVisible.value, addFormStore.isOpen],
  ([newValueAsidePanelVisible, newValueFormVisible]) => {
    if (newValueAsidePanelVisible || newValueFormVisible) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "initial";
    }
  }
);

// -------------------------------------------------------------------------

// хуки

onBeforeMount(async () => {
  // await projectsStore.getProjectsByUser();
  // await getProjects(projectsStore.projects);
  console.log(projects.value,'projects.value onBeforeMount');
  
});

onMounted(async () => {
  await projectsStore.getProjectsByUser();
  await getProjects(projectsStore.projects);
  console.log(projects.value,'projects.value onMounted');
  
  baseScrollWidthPageProducts = refPageProjects.value.scrollWidth;
});

onUnmounted(async () => {});

const isDraggingAllowed = ref(false);

const handleScrollPage = (direction: "left" | "right") => {
  refPageProjects.value.style.scrollSnapType = "none";

  if (
    direction === "right" &&
    canScrollRight(refPageProjects.value, baseScrollWidthPageProducts)
  ) {
    isDraggingAllowed.value = true;

    refPageProjects.value.scrollLeft += 10;
  } else if (direction === "left" && refPageProjects.value.scrollLeft > 20) {
    isDraggingAllowed.value = true;

    refPageProjects.value.scrollLeft -= 10;
  } else {
    isDraggingAllowed.value = false;
  }
};
</script>

<template>
  <div ref="refPageProjects" class="page-project">
    <div v-if="loadStore.isLoading" class="page-project__loader">
      <LoadersAppLoader />
    </div>

    <div
      @click="handleClickWrapperFormAdd"
      class="page-project__wrapper-form-add"
      :class="{
        'page-project__wrapper-form-add--visible': addFormStore.isOpen,
      }"
    >
      <div ref="refFormAdd" class="page-project__form-add project-form">
        <div class="project-form__status">
          {{ STATUS_TRANSLATIONS[statusNewProject] }}
        </div>
        <button
          class="project-form__close"
          @click="addFormStore.setOpen(false)"
        >
          <img src="/public/images/icon-close.png" alt="закрыть форму" />
        </button>

        <FormsCreateProject
          :status="statusNewProject"
          @change-status="handleChangeStatus"
          @create-project="handleSubmitCreateCard"
        />
      </div>
    </div>

    <KanbanBoard
     
      @scroll-page="handleScrollPage"
      @card-create="handleAddProject"
      @card-move-to-column="addCardInColumn"
      @card-delete="handleDeleteProject"
      @click-card="handleClickCard"
      :is-dragging-allowed="isDraggingAllowed"
      :projects="projects"
    />

    <div
      @click="handleClickInAsidePanel"
      class="page-project__aside-panel"
      :class="{ 'page-project__aside-panel--visible': asidePanelVisible }"
    >
      <div class="page-project__aside-panel-inner">
        <button
          class="page-project__aside-panel-close"
          @click="handleHiddenAsidePanel"
        >
          <img
            src="/public/images/icon-close.png"
            alt="закрыть боковую панель"
          />
        </button>
         <SectionsAsideCardInfo
          v-if="asidePanelData?.$id"
          :key="asidePanelData?.$id"
          ref="refPanelAside"
          :color="asidePanelData?.color || 'black'"
          :id="asidePanelData?.$id"
          :client="asidePanelData?.client"
          :client_email="asidePanelData?.client_email"
          :client_phone="asidePanelData?.client_phone"
          :name="asidePanelData?.name"
          :price="asidePanelData?.price"
          :description="asidePanelData?.description || ''"
          :comments="asidePanelData?.comments"
          :link="asidePanelData?.link"
          :createdAt="asidePanelData?.$createdAt"
          :deadline="asidePanelData?.deadline"
          @update-card="handleUpdateCard"
          @add-comment="handleAddComment"
          @delete-comment="handleDeleteComment"
        >
          <template #card>
            <CardsKanbanCard
              v-if="asidePanelData?.$id"
              :color="asidePanelData?.color"
              :id="asidePanelData?.$id"
              :status="asidePanelData?.status || ProjectStatus.NEW"
              :client="asidePanelData?.client"
              :name="asidePanelData?.name"
              :price="asidePanelData?.price || 0"
              :description="asidePanelData?.description"
              :link="asidePanelData?.link"
              :deadline="asidePanelData?.deadline"
              :createdAt="asidePanelData?.$createdAt || '-'"
              @delete-card="asidePanelData && handleDeleteProject(asidePanelData)"
            />
          </template>

          <template #color>
            <div style="margin-bottom: 10px">изменить цвет карточки</div>

            <PanelsColorsPanel
              @click-color="(color: string) => handleChangeColorCard(asidePanelData?.$id || '', color)"
              :colors="colors_card"
            />
          </template>
        </SectionsAsideCardInfo>
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
  position: relative;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-top: 50px;
  padding-bottom: 50px;
  padding-right: 20px;
  padding-left: 20px;
  scroll-snap-type: x mandatory;

  &__loader {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2000;
    color: rgb(0, 0, 0);
    width: 200px;
  }

  &__kanban {
    margin-left: auto;
    margin-right: auto;
  }

  &__wrapper-form-add {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;

    opacity: 0;
    backdrop-filter: blur(5px);
    pointer-events: none;
    animation: visibleToHidden var(--timing-animation-min) forwards;

    &--visible {
      overflow-y: auto;
      opacity: 1;
      pointer-events: initial;
      display: block;
      animation: hiddenToVisible var(--timing-animation-min) forwards;

      .page-project__form-add {
        opacity: 1;
        filter: blur(0px);
      }
    }
  }

  &__form-add {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
    filter: blur(2000px);
    transition: filter 0.5s;

    @media (max-width: 550px) {
      transform: none;
      left: 0;
      background-color: red;
    }
  }

  &__aside-panel {
    display: flex;
    justify-content: flex-end;
    position: fixed;
    right: 0;
    top: 0;
    bottom: 0;
    left: 0;
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
    position: relative;
    width: 50vw;
    max-width: 900px;
    padding: 50px 20px 20px 20px;
    overflow-y: auto;
    transition: transform 1s;
    background-color: rgba(48, 48, 48, 0.7);
    color: rgb(224, 224, 224);

    @media (max-width: 1400px) {
      width: 100%;
    }

    @media (max-width: 380px) {
    }
  }

  &__aside-panel-close {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 100;
    background-color: transparent;
    border: none;
    cursor: pointer;
    padding: 15px;

    & img {
      width: 16px;
      height: 16px;
    }
  }
}

.project-form {
  max-width: 450px;
  width: 100%;
  border: solid rgb(255, 255, 255) 2px;
  border-radius: var(--radius-sm);
  background-color: rgba(255, 255, 255, 0.5);

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

    background-color: black;
    transform: translateX(-50%);
    color: rgb(255, 255, 255);
    text-align: center;
    letter-spacing: 1px;
    font-size: 20px;
    font-weight: 900;
    // text-shadow: 1px 0 0 red;
  }

  &__status {
    padding-top: 10px;
    padding-bottom: 10px;
    border-radius: 2px 2px 0 0;

    color: rgb(255, 255, 255);
    text-align: center;
    font-weight: 700;
    background-color: rgb(0, 0, 0);
  }

  &__close {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 1;
    width: 40px;
    height: 40px;
    background-color: transparent;
    border: none;
    padding: 13px 13px 13px 13px;
    cursor: pointer;
  }
}

.kanban {
  display: grid;
  grid-template-columns: repeat(5, 300px);
  justify-content: center;
  width: 1580px;
  height: 100%;
  gap: 20px;

  @media (max-width: 1200px) {
  }

  @media (max-width: 550px) {
    grid-template-columns: repeat(5, 270px);
    width: 1430px;
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

  &__card {
    position: relative;
    width: 250px;
    border-radius: var(--radius-md);
    margin-bottom: 10px;
    animation: cardAdd 0.2s ease-in;

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
    padding-left: 25px;
    padding-right: 25px;
    scrollbar-width: thin;
    scrollbar-color: rgb(250, 250, 250) black;

    @media (max-width: 550px) {
      padding-left: 10px;
      padding-right: 10px;
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

    &--open {
    }

    &--test {
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
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s, transform 1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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
