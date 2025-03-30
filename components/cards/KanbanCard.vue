<script setup lang="ts">
import type { FormCardKanban } from "../form/CreateProject.vue";
import { formatDate } from "#imports";

export type CardKanban = FormCardKanban & {
  createdAt: string;
  id: string;
  color: string;
};

const props = defineProps<CardKanban>();
const hiddenPanelConfirm = ref(true);
const dateAdd = computed(() => formatDate(props.createdAt));


const emit = defineEmits(["delete-card", "click-card"]);
const emitEventDeleteCard = () => {
  emit("delete-card");
  hiddenPanelConfirm.value = true;
};

const emitEventClickCard = () => {
  emit("click-card");
  console.log('click card');
  
};

const cancelClick = ()=> {
hiddenPanelConfirm.value = true;
}

const getColorText = computed(()=> {
  switch (props.color) {
    case "black":
      return "white"
      break;

      case "white":
      return "black"
      break;
      
      case "red":
      return "white"
      break;
      
      case "black":
      return "white"
      break;
  
    default:
      return "inherit";
      break;
  }
})





</script>
<template>
  <div :style="{'background': props.color, 'color': getColorText}" @click="emitEventClickCard" class="project">
    <button
      @click.stop="hiddenPanelConfirm = false"
      class="project__delete"
    >
      <img src="/images/icon-close.png" alt="удалить карточку">
    </button>
    <div class="project__client">{{ props.client || "нет клиента" }}</div>
    <div class="project__name">{{ props.name || "нет названия" }}</div>
    <div class="project__price">{{ props.price }} руб</div>
    <div v-if="props.link" class="project__link">
      <a target="_blank" rel="noopener noreferrer" :href="props.link">ссылка на макет</a>
    </div>
    <div v-if="props.createdAt" class="project__date-add">
      <span>добавлен</span><span>{{ dateAdd }}</span>
    </div>
    <div class="project__deadline" v-if="props.deadline">
      <span>сделать до</span> <span>{{ props.deadline }}</span>
    </div>
    <div class="project__deadline" v-else>
      <span>сделать до</span><span>-</span>
    </div>
    <div
      :aria-hidden="hiddenPanelConfirm"
      class="project__delete-confirm"
      :class="{ 'project__delete-confirm--hidden': hiddenPanelConfirm }"
    >
      <p class="project__confirm-text">
        Вы уверены, что хотите удалить эту карточку?
      </p>
      <div class="project__ui-button">
        <UiBaseButton @click.stop="emitEventDeleteCard" text-color="white" bg-color="red">
        Delete
      </UiBaseButton>
      </div>
      <div class="project__ui-button">
        <UiBaseButton  @click.stop="cancelClick" text-color="black" bg-color="white">
        Cancel
      </UiBaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.project {
  display: grid;
  gap: 10px;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 15px 20px;
  border-radius: var(--radius-md);
  overflow: hidden;


  &__client,
  &__name,
  &__price,
  &__description,
  &__deadline {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__client {
    font-size: 14px;
    font-weight: 300;
  }

  &__name {
    font-size: 16px;
    font-weight: 700;
  }

  &__price {
    font-size: 14px;
  }

  &__link {
    text-shadow: 0 0 10px red;
    border-bottom: solid transparent 1px;
    padding-bottom: 10px;
    width: max-content;
    font-size: 14px;

    @media (hover: hover) {
      transition: border 0.3s;

      &:hover {
        border-bottom: solid 1px;
      }
    }
  }

  &__deadline,
  &__date-add {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }

  &__delete {
    position: absolute;
    right: 0;
    top: 0;
    width: 30px;
    height: 30px;
    padding: 10px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    & img {
      filter: drop-shadow(0px 0px 1px rgba(0,0,0,1));

    }
  }

  &__delete-confirm {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 20px;
    transition: transform 0.5s;
    background-color: rgb(1, 1, 1);

    &--hidden {
      transform: translateY(100%);
    }
  }

  &__confirm-text {
    color: var(--color-light-50);
  }

  &__ui-button {
    // width: 40%;
  }
}


</style>
