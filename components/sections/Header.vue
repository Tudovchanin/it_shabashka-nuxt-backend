<script setup lang="ts">
const authStore = useAuthStore();
const searchStore = useSearchStore();
const loadStore = useIsLoadingStore();


const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  await router.push("/");
};

const searchCard = ref("");
const refInputSearch = ref();



const handleClickButtonSearch = () => {
  if(!searchCard.value.trim) return;
  searchStore.setSearchQuery(searchCard.value);
  searchStore.flagSearch = true;
};

watch(()=> [searchCard.value, loadStore.isLoading], (newValue, prevValue) => {
  
  if(searchCard.value.trim().length === 0 || loadStore.isLoading) {
    searchStore.resetSearchQuery();
    searchStore.flagSearch = false;
    refInputSearch.value.resetInputSearch();
  }

});
</script>
<template>
    

  <header class="header">
    <div class="header__content">
      <a href="/" class="logo">
        <img src="/images/logo.png" alt="картинка логотипа" />
        IT_Shabashka
      </a>
      <!-- 
        <button style="background-color: red; padding: 10px 20px; cursor: pointer" @click="handleLogout">
          Выйти
        </button> -->

      <div class="header__search">
        <UiBaseSearchInput
          ref="refInputSearch"
          placeholder="искать карточку по имени"
          max-length="50"
          v-model="searchCard"
        >
        </UiBaseSearchInput>
        <div
          @click="handleClickButtonSearch"
          class="header__search-button"
          :class="{ 'header__search-button--disabled': !searchCard.length }"
        >
          <UiBaseButton bg-color="white" text-color="black"
            >Искать</UiBaseButton
          >
        </div>
      </div>

      <div class="header__user-ava"></div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
.header {
  position: fixed;
  width: 100vw;
  top: 0;
  z-index: 500;
  background: linear-gradient(
    -220deg,
    #ff8ae9,
    #6100b5,
    #0000a1,
    #000729,
    #000000
  );

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 50px;
    max-width: 1920px;
    width: 100%;
    padding-right: 20px;
    padding-left: 20px;
    height: 60px;
    margin-right: auto;
    margin-left: auto;
    color: white;
  }

  &__search {
    display: flex;

    margin-left: auto;
  }

  &__search-button {
    transition: opacity var(--timing-animation-min);
    position: relative;
    right: 5px;
    z-index: 1;
    &--disabled {
      pointer-events: none;
      opacity: 0.5;
      overflow: hidden;
    }
  }

  &__user-ava {
    width: 50px;
    height: 50px;
    background-color: wheat;
    border-radius: 100%;
    cursor: pointer;
  }
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 50px;
  background-color: var(--main-color);
  padding: 0 20px;
  font-size: 30px;
  font-weight: 700;

  & img {
    width: 50px;
    height: 40px;
  }
}
</style>
