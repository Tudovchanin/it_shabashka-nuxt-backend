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

    <div class="header-content__search">
      <UiBaseSearchInput ref="refInputSearch" placeholder="искать карточку по имени" max-length="50"
        v-model="modelSearchCard">
      </UiBaseSearchInput>
      <div @click="handleClickButtonSearch" class="header-content__search-button"
        :class="{ 'header-content__search-button--disabled': !modelSearchCard.length }">
        <UiBaseButton bg-color="white" text-color="black">Искать</UiBaseButton>
      </div>
    </div>

    <div role="button" @click="emitClickInAvatar" class="header-content__user-ava">
      <img v-if="authStore.user.avatarUrl" :src="`${authStore.user.avatarUrl}`" alt="avatar images" />
    </div>



  </div>
</template>

<style lang="scss" scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 50px;
  width: 100%;
  height: 60px;
  color: white;

  &__search {
    display: flex;
    margin-left: auto;
  }

  &__search-button {
    outline: solid black 1px;
    border-radius: var(--radius-input);
    transition: opacity var(--timing-animation-min);
    position: relative;
    overflow: hidden;
    z-index: 1;

    &--disabled{
      pointer-events: none;
      opacity: 0.2;
      overflow: hidden;
    
    }
  }

  &__user-ava {
    width: 50px;
    height: 50px;
    border-radius: 100%;
    overflow: hidden;
    cursor: pointer;
  }
}


</style>
