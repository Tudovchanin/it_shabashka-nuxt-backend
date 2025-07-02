<script setup lang="ts">
import { ProjectStatus } from "~/stores/cards.store";
import type { DataCardAppWrite, TypeProjectStatus } from "~/stores/cards.store";
import type { FormCardKanban } from "~/components/forms/CreateProject.vue";
import { STATUS_TRANSLATIONS } from "~/constants/project.constants";

import { COLORS_CARD } from "~/constants/project.constants";

// definePageMeta({
//   middleware: "auth",
// });

// store
const projectsStore = useProjectsStore();
const addFormStore = useFormAddStore();
const commentsStore = useCommentsStore();
const loadStore = useIsLoadingStore();
const searchStore = useSearchStore();
// const eventStore = useEventStore();
// const colorColumnStore = useColumnColor();

const projects = ref<DataCardAppWrite[]>([]);

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

function setProjects(arrProjects: DataCardAppWrite[]) {
  projects.value = [...arrProjects];
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
  setProjects(projectsStore.projects);
}
const handleDeleteProject = async (project: DataCardAppWrite) => {
  await deleteProject(project);
  setProjects(projectsStore.projects);
  asidePanelVisible.value = false;
};

async function deleteProject(project: DataCardAppWrite) {
  await projectsStore.deleteProject(project.$id);
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
  setProjects(projectsStore.projects);
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
    setProjects(projectsStore.projects);
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
    setProjects(projectsStore.projects);
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

// проверка
function canScrollRight(element: HTMLElement): boolean {
  let baseScrollWidthPageProducts = element.scrollWidth;
  const { scrollLeft, clientWidth } = element;

  return scrollLeft + clientWidth < baseScrollWidthPageProducts;
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
        setProjects(validCards);
      }
    } else {
      setProjects(projectsStore.projects);
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

let timerIdPageScroll: number | null = null;

const handleCardDrag = () => {
  refPageProjects.value.style.scrollSnapType = "none";
};

const handleCardDragEnd = () => {
  // добавляем задержку, что бы колонки выравнивались из за x mandatory, когда пройдет 1500мс после начала анимации cardDrop
  timerIdPageScroll = window.setTimeout(() => {
    refPageProjects.value.style.scrollSnapType = "x mandatory";
  }, 1500);
};

// -------------------------------------------------------------------------

// хуки

onBeforeMount(async () => {
  await projectsStore.getProjectsByUser();
  setProjects(projectsStore.projects);
});

onMounted(() => {});

onUnmounted(() => {
  if (timerIdPageScroll) {
    clearInterval(timerIdPageScroll);
  }
});

const isDraggingAllowed = ref(false);

const handleScrollPage = (direction: "left" | "right") => {
  // refPageProjects.value.style.scrollSnapType = "none"

  if (direction === "right" && canScrollRight(refPageProjects.value)) {
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
      @card-click="handleClickCard"
      @card-drag-end="handleCardDragEnd"
      @card-drag="handleCardDrag"
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
              @delete-card="
                asidePanelData && handleDeleteProject(asidePanelData)
              "
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
.page-project {
  display: grid;
  justify-items: center;
  position: relative;
  height: 100%;
  overflow-x: auto;
  overflow-y: hidden;
  padding-top: 150px;
  padding-bottom: 50px;
  padding-right: 20px;
  padding-left: 20px;
  scroll-snap-type: x mandatory;
  background-color: blue;

  @media (max-width: 550px) {
    padding-top: 200px;
  }

  &__loader {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2000;
    color: rgb(0, 0, 0);
    width: 200px;
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
