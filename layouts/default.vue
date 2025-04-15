<script setup lang="ts">
import { PanelAppRooms, PanelSettingPage, UiBaseLogoButton } from "#components";

import type { Room } from "~/components/panel/AppRooms.vue";

const authStore = useAuthStore();
const projectsStore = useProjectsStore();
const searchStore = useSearchStore();
const eventStore = useEventStore();

const router = useRouter();
const route = useRoute();

const flagMenuUserHidden = ref(true);
const flagAvatarFormHidden = ref(true);
const flagChangeRoom = ref(false);

const handleClickAvatar = () => {
  flagMenuUserHidden.value = !flagMenuUserHidden.value;
  console.log("emit avatar");
};
const closePanelOnOutsideClick = (e: Event) => {
  if (!e.target) return;
  const elem = e.target as HTMLElement;
  if (elem.closest(".page__aside-panel")) return;
  flagMenuUserHidden.value = true;
};
const handleLogout = async () => {
  await authStore.logout();
  await router.push("/");
};

const readyProjects = computed(() => {
  return projectsStore.projects.filter((project) => project.status === "DONE")
    .length;
});

const priceAllProjects = computed(() => {
  return projectsStore.projects.reduce(
    (sum, project) => sum + project.price,
    0
  );
});

const priceDoneProjects = computed(() => {
  return projectsStore.projects
    .filter((project) => project.status === "DONE")
    .reduce((sum, project) => sum + project.price, 0);
});

const roomUserImg = ref("loft-2.jpg");
const flagAnimateImageRoom = ref(false);

function setLocalStorageUserRoomImgName(
  userId: string,
  pageName: string,
  roomImgName: string
) {
  if (!pageName.trim() || !roomImgName.trim() || !userId.trim()) return;
  const dataPageRoomUser: Record<string, string> = {};

  dataPageRoomUser[pageName] = roomImgName;

  localStorage.setItem(`${userId}-room`, JSON.stringify(dataPageRoomUser));
}
// в локальном хранилище хранится объект по ключу `${userId}-room`, {имя страницы:имя картинки}
// пример key: 123344567-room  value: {projects: 'loft.jpg'}


let timerId: number | null = null
const handleChangeRoom = (room: Room) => {
  if (roomUserImg.value === room.img) return;

  if (!flagAnimateImageRoom.value) {
    roomUserImg.value = room.img;
    flagAnimateImageRoom.value = true;


    // записываем localStorage
    setLocalStorageUserRoomImgName(
      authStore.user.$id,
      route.name as string,
      roomUserImg.value
    );

    timerId = window.setTimeout(() => {
      flagAnimateImageRoom.value = false;
    }, 700);
  }
};

const buttonAriaLabel = computed(() =>
  flagChangeRoom.value
    ? "закрыть панель смены фона"
    : "открыть панель смены фона"
);

// Реакция на изменение поиска
watch(() => searchStore.flagSearch, (initSearch) => {
  if (initSearch) {
    flagChangeRoom.value = false;
  }
})

// Реакция на изменение роута
watch(() => route.name, (newNamePage) => {

  const userId = authStore.user.$id;
  const localStoredRoomUser = localStorage.getItem(`${userId}-room`);


  if (localStoredRoomUser?.trim()) {
    const roomImgInLocalStorage = JSON.parse(localStoredRoomUser);


    roomUserImg.value = roomImgInLocalStorage[newNamePage as string];
    console.log(roomUserImg.value, 'onBeforeMount roomUserImg.value');
  }

})


const refDesc = ref();
const refMain = ref();
watch(() => eventStore.getDragover, ((isDragover) => {
  console.log(isDragover, 'isDragover');

}));


const handleClickMainSection = (e: Event) => {
  if (!e.target) return;
  const elem = e.target as HTMLElement;
  if (elem.closest(".page__rooms")) return;
  flagChangeRoom.value = false;
}

onMounted(() => {

})

onBeforeUnmount(() => {
  if (timerId) {
    clearInterval(timerId);
  }
});
</script>
<template>
  <div ref="refPage" :style="{ '--room-img': `url(/images/${roomUserImg})` }" class="page"
    :class="{ 'page--animate-img': flagAnimateImageRoom }">
    <header class="page__header">
      <div class="x-center width">
        <SectionsHeader @click-avatar="handleClickAvatar" />
      </div>
    </header>

    <main @click="handleClickMainSection" ref="refMain" class="page__main">
      <button @click.stop="flagChangeRoom = !flagChangeRoom" :aria-label="buttonAriaLabel" class="page__button-room"
        :class="{ 'page__button-room--reverse': flagChangeRoom }">
        <UiBaseLogoButton tag="div" :reverse="flagChangeRoom" />
      </button>

      <div ref="refDesc" class="desc x-center" :class="{ 'desc--hidden': flagChangeRoom }">
        <slot></slot>
      </div>

      <div class="page__rooms" :class="{ 'page__rooms--hidden': !flagChangeRoom }">
        <PanelAppRooms @click-room="handleChangeRoom" :active-room="roomUserImg" />
      </div>
    </main>

    <aside @click="closePanelOnOutsideClick" class="page__aside" :class="{ 'page__aside--hidden': flagMenuUserHidden }">
      <button aria-hidden="true" @click="flagMenuUserHidden = true" class="page__aside-close"
        :class="{ 'page__aside-close--hidden': flagMenuUserHidden }">
        <img src="/images/icon-close.png" alt="закрыть" />
      </button>

      <div class="page__aside-panel" :class="{ 'page__aside-panel--move-left': !flagMenuUserHidden }">
        <PanelSettingPage>
          <template #header>
            <div class="aside-header decor-line-bottom">
              <BlocksUserInfo title="Учетная запись" :avatar="authStore.user.avatarUrl" :user_name="authStore.user.name"
                :user_email="authStore.user.email" />
              <BlocksProjectsInfo :number_of_projects="projectsStore.projects.length" :ready_projects="readyProjects"
                :price_all_projects="priceAllProjects" :price_done_projects="priceDoneProjects" />
            </div>
          </template>

          <template #main>
            <div class="decor-line-bottom change-avatar">
              <button @click="flagAvatarFormHidden = !flagAvatarFormHidden" class="change-avatar__button">
                <div class="change-avatar__button-title">Изменить аватар</div>
                <div class="change-avatar__button-img" aria-hidden="true">
                  {{ flagAvatarFormHidden ? "&#x271B;" : "&#x2715;" }}
                </div>
              </button>
              <div class="change-avatar__form" :class="{ 'change-avatar__form--hidden': flagAvatarFormHidden }">
                <FormsAvatarChange />
              </div>
            </div>
          </template>

          <template #footer>
            <UiBaseButton style="width: 100px" @click="handleLogout" bg-color="red" text-color="black">Выйти
            </UiBaseButton>
          </template>
        </PanelSettingPage>
      </div>
    </aside>

    <footer class="page__footer" style="color: wheat; font-size: 30px">
      <h1>footer</h1>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
@keyframes changeRoom {
  0% {
    transform: rotate(-90deg) scale(3);
    opacity: 0;
    filter: blur(200px);
  }

  100% {
    opacity: 1;
    filter: blur(0px);
  }
}

.page {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  width: 100vw;
  padding-top: 100px;
  overflow: hidden;
// что бы на touch устройствах не было  микроскролла
  @media (hover: none) and (pointer: coarse) {
    // width: 100%;
  }

  @media (max-width: 550px) {
    padding-top: 120px;
  }


  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;
    background-image: var(--room-img);
   
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    @media (hover: none) and (pointer: coarse) {
      background-attachment: fixed;
    }
  }

  &--animate-img::before {
    animation: changeRoom 0.5s ease-in;
  }


  &__header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 500;
    width: 100vw;
    padding-right: 20px;
    background-color: rgba(48, 48, 48, 0.98);
    @media (hover: none) and (pointer: coarse) {
    // width: 100%;
  }
    @media (max-width: 1400px) {
      padding-right: 0px;
  }
  }


  &__main {
    position: relative;
  }

  &__rooms {
    position: absolute;
    top: 300px;
    left: 50%;
    transform-origin: left top;
    transform: scaleY(1) translate(-50%, -50%);
    background-color: rgb(0, 0, 0);
    color: white;
    padding: 20px;
    border: solid 1px white;
    transition: visibility 0.7s, transform 0.5s, filter 0.5s, opacity 0.6s;

    @media (max-width: 550px) {
      top: 260px;
    }

    @media (max-width: 380px) {
      top: 210px;
    }

    &--hidden {
      transform: scaleY(0.01) translate(-50%, -50%);
      filter: blur(200px);
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
    }
  }

  &__button-room {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    left: 50%;
    top: -30px;
    z-index: 1;
    width: 80px;
    height: 60px;
    border: none;
    background-color: transparent;
    transform-origin: top right;
    transform: translateX(-50%) rotateY(0deg);
    transition: transform 0.5s, filter 0.5s, background-color 0.5s;
    cursor: pointer;

    @media (max-width: 550px) {}

    &:active {}

    &--reverse {
      transform-origin: top right;
      transform: translateX(-75%) rotateY(-180deg);
    }

  }

  &__aside {
    position: fixed;
    top: 0;
    right: 0;
    width: 100vw;
    bottom: 0;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.452);

    &--hidden {
      right: -150%;
    }
  }

  &__aside-close {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 70px;
    right: 0;
    z-index: 1;
    width: 50px;
    height: 50px;
    background-color: transparent;
    opacity: 1;
    border: none;
    transition: opacity 1s;
    cursor: pointer;

    & img {
      width: 14px;
      height: 14px;
      filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 1));
    }

    &--hidden {
      opacity: 0;
    }
  }

  &__aside-panel {
    position: absolute;
    top: 70px;
    right: 0;

    width: 400px;
    padding: 30px 20px;

    border-top-left-radius: var(--radius-lg);
    border-bottom-left-radius: var(--radius-lg);
    background-color: rgb(255, 255, 255);
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.479);

    overflow: hidden;

    transform: translateX(100%);
    transition: transform 0.5s;

    &--move-left {
      transform: translateX(0);
    }
  }



  &__footer {
    width: 100%;
    background-color: rgb(18, 18, 18);
  }
}

.desc {
  height: max(940px, 100vh);
  overflow-y: hidden;
  transition: visibility 0.6s, opacity 0.5s;

  @media (max-width: 1700px) {}

  &--hidden {
    opacity: 0;
    overflow: hidden;
    visibility: hidden;
    pointer-events: none;
  }


}

.decor-line-bottom {
  border-bottom: solid 1px rgb(128, 128, 128);
  padding-bottom: 10px;
}

.change-avatar {
  &__button {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
    width: 100%;
    border: none;
    font-size: 20px;
    background-color: transparent;
    cursor: pointer;
  }

  &__button-title {
    font-size: 16px;
  }

  &__form {
    max-height: 200px;

    transition: max-height 0.5s, opacity 0.5s linear;
    overflow: hidden;

    &--hidden {
      opacity: 0;
      max-height: 1px;
    }
  }
}

.aside-header {
  display: grid;
  gap: 20px;
}
</style>
