<script setup lang='ts'>
import { PanelSettingPage } from '#components';

const authStore = useAuthStore();
const router = useRouter();



const flagMenuUserHidden = ref(true);


const handleClickAvatar = () => {
  flagMenuUserHidden.value = !flagMenuUserHidden.value;
  console.log('emit avatar');
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



const refFileInput = ref<HTMLInputElement | null>(null);
const fileName = ref("Файл не выбран");

const handleFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement;
  fileName.value = target.files?.[0]?.name || "Файл не выбран";
};
const handleSubmitAvatar = async () => {
  if (!refFileInput.value?.files) return;

  const file = refFileInput.value.files[0];
  if (!file) return;

  if (file.size > 500 * 1024) {
    alert("Файл слишком большой! Максимум 500 КБ.");
    return;
  }

  await authStore.createAvatar(file);
  refFileInput.value.value = ""; // Сброс значения
  fileName.value = "Файл не выбран";
};




</script>
<template>
  <div class="page">

    <header class="page__header">
      <div class="x-center width">
        <SectionsHeader @click-avatar="handleClickAvatar" />
      </div>
    </header>

    <main class="page__main">
      <div class="desc x-center">
        <slot></slot>

      </div>
    </main>

    <aside @click="closePanelOnOutsideClick" class="page__aside" :class="{ 'page__aside--hidden': flagMenuUserHidden }">
      <button @click="flagMenuUserHidden = true" class="page__aside-close"
        :class="{ 'page__aside-close--hidden': flagMenuUserHidden }">X</button>


      <div class="page__aside-panel" :class="{ 'page__aside-panel--move-left': !flagMenuUserHidden }">


        <PanelSettingPage>
          <template #header>

            <BlocksUserInfo
            title="Учетная запись"
            :avatar="authStore.user.avatarUrl"
            :user_name="authStore.user.name"
            :user_email="authStore.user.email"
            
            />
          </template>


          <template #main>
            <div class="main-aside">
              <form class="avatar-form" @submit.prevent="handleSubmitAvatar">

                <div class="avatar-form__input-group">

                  <input ref="refFileInput" type="file" accept=".jpg,.jpeg,.png,.webp" @change="handleFileChange"
                    class="avatar-form__file-input" id="avatarUpload" />

                  <label for="avatarUpload" class="avatar-form__button avatar-form__button--select">
                    Выбрать файл
                  </label>
                </div>


                <div class="avatar-form__info">
                  <p class="avatar-form__filename">{{ fileName }}</p>
                  <p class="avatar-form__hint">Форматы: JPG, PNG, WebP (до 500 КБ)</p>
                </div>


                <button type="submit" class="avatar-form__button avatar-form__button--submit">
                  Сохранить аватар
                </button>
              </form>
            </div>
          </template>

          <template #footer>

            <UiBaseButton style="width: 100px;" @click="handleLogout" bg-color="red" text-color="black">Выйти
            </UiBaseButton>
          </template>

        </PanelSettingPage>




      </div>

    </aside>





    <footer class="page__footer" style="color: wheat; font-size: 30px;">
      <h1>footer</h1>
    </footer>
  </div>
</template>


<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background-image: url('/images/bg-4.jpg');
  min-height: 100vh;

  background-repeat: no-repeat;
  background-size: cover;
  background-color: var(--main-color);




  &__header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 500;
    background-color: rgba(48, 48, 48, .9);
  }



  &__aside {
    position: fixed;
    top: 0;
    right: 0;
    width: 100vw;
    bottom: 0;
    z-index: 1000;
    // background-color: rgba(0, 0, 0, 0.452);

    &--hidden {
      right: -150%;

    }

  }

  &__aside-close {
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

    &--hidden {
      opacity: 0;
    }
  }

  &__aside-panel {
    width: 400px;

    position: absolute;
    top: 70px;
    right: 0;
    padding: 12px;


    border-top-left-radius: var(--radius-lg);
    border-bottom-left-radius: var(--radius-lg);
    background-color: rgb(255, 255, 255);
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.479);

    overflow: hidden;

    transform: translateX(100%);
    transition: transform .5s;

    &--move-left {
      transform: translateX(0);
    }
  }


  &__main {
    width: 100%;
    overflow-y: visible;
    overflow-x: auto;
  }

  &__footer {
    // align-self:  stretch;
    width: 100%;
    background-color: rgba(5, 4, 4, 0.671);
  }
}

.desc {
  display: flex;
  justify-content: center;
  width: 1900px;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 50px;
  padding-bottom: 50px;
  height: max(940px, 100vh);
  // background-color: rgba(0, 128, 128, 0.562);
  overflow-y: hidden;
}
</style>