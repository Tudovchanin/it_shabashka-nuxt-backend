<script setup lang="ts">
import { UiBaseLogo } from '#components';

const authStore = useAuthStore();
const searchStore = useSearchStore();
const loadStore = useIsLoadingStore();

const modelSearchCard = ref("");
const refInputSearch = ref();

const emit = defineEmits(['click-avatar'])

const handleClickButtonSearch = () => {
  if (!modelSearchCard.value.trim) return;
  searchStore.setSearchQuery(modelSearchCard.value);
  searchStore.flagSearch = true;
};

const emitClickInAvatar = () => {
  emit('click-avatar');
}




watch(
  () => [modelSearchCard.value, loadStore.isLoading],
  () => {
    if (modelSearchCard.value.trim().length === 0 || loadStore.isLoading) {
      searchStore.resetSearchQuery();
      searchStore.flagSearch = false;
      refInputSearch.value.resetInputSearch();
    }
  }
);
</script>
<template>
  <div class="header-content">

    <UiBaseLogo size="small" />
    

    <div @keyup.enter="handleClickButtonSearch" class="header-content__search">
      <UiBaseSearchInput ref="refInputSearch" placeholder="искать карточку по названию" max-length="50"
        v-model="modelSearchCard">
      </UiBaseSearchInput>
      <div @click="handleClickButtonSearch" class="header-content__search-button"
        :class="{ 'header-content__search-button--disabled': !modelSearchCard.length }">
        <UiBaseButton bg-color="white" text-color="black">Искать</UiBaseButton>
      </div>
    </div>

    <div role="button" @click="emitClickInAvatar" class="header-content__user-ava">
      <img v-if="authStore.user.avatar" :src="`${authStore.user.avatar}`" alt="avatar images" />
    </div>



  </div>
</template>

<style lang="scss" scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 5px;
  padding-bottom: 5px;
  gap: 50px;
  width: 100%;
  color: white;

  @media (max-width:900px) {
    gap: 10px;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  @media (max-width:550px) {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
  }

  &__search {
    min-height: 35px;
    display: flex;
    margin-left: auto;
    font-size: 14px;

    @media (max-width:550px) {
      margin-left: 0;
      order: 3;
      grid-column: 2/4;
      justify-self: end;
      min-height: 30px;
      font-size: 12px;
    }
    @media (max-width: 320px) {
      grid-column: 1/4;
      width: 100%;
    }
  }

  &__search-button {
    flex-shrink: 0;
    outline: solid black 1px;
    border-radius: var(--radius-input);
    transition: opacity var(--timing-animation-min);
    position: relative;
    overflow: hidden;
    z-index: 1;

    @media (max-width:650px) {
      display: none;
    }

    &--disabled {
      pointer-events: none;
      opacity: 0.2;
      overflow: hidden;
    }
  }

  &__user-ava {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 100%;
    overflow: hidden;
    cursor: pointer;

    @media (max-width:550px) {
      width: 35px;
      height: 35px;
      grid-column: 3/4;
      justify-self: end;
    }


    & img {
      object-fit: cover;
    }
  }
}
</style>
