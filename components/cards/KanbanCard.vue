<script setup lang="ts">
import type { FormCardKanban } from "../forms/CreateProject.vue";
import { formatDate } from "#imports";

export type CardKanban = FormCardKanban & {
  createdAt: string;
  id: string;
  color: string;
};

const props = defineProps<CardKanban>();
const hiddenPanelConfirm = ref(true);
const createdAtFormatted = computed(() => formatDate(props.createdAt));
const deadLineFormatted = computed(() => props.deadline && formatDate(props.deadline));


const emit = defineEmits(["delete-card", "click-card"]);
const emitEventDeleteCard = () => {
  emit("delete-card");
  hiddenPanelConfirm.value = true;
};

const emitEventClickCard = () => {
  emit("click-card");
  console.log('click card');

};

const cancelClick = () => {
  hiddenPanelConfirm.value = true;
}






const COLOR_TEXT_MAP = {
  'black': "white",
  'maroon': "white",
  'linear-gradient(90deg, #e2632c,#fb4955,#ff3286,#fc39be,#d35bf8)': "white",
  'linear-gradient(90deg, #ee6ef5,#57b9ff)': "black",
  'linear-gradient(90deg, #29482a,#4e8950,#9fb97f)': "white",
  'white': "black",
  'red': "black",
  'green': "black",
  'gold': "black",
  'blue': "black",
} as const;


type ColorKeyTextMap = keyof typeof COLOR_TEXT_MAP;

const getColorText = computed(() => {
  return COLOR_TEXT_MAP[props.color as ColorKeyTextMap] || "inherit";
});


</script>
<template>
  <div :style="{ 'background': props.color, 'color': getColorText }" @click="emitEventClickCard" class="project">
    <button @click.stop="hiddenPanelConfirm = false" class="project__delete">
      <img src="/images/icon-close.png" alt="удалить карточку">
    </button>
    <div class="project__client">{{ props.client || "нет клиента" }}</div>
    <div class="project__name">{{ props.name || "нет названия" }}</div>
    <div class="project__price">{{ props.price }} руб</div>
    <div @click.stop v-if="props.link" class="project__link">
      <a target="_blank" rel="noopener noreferrer" :href="props.link">ссылка на макет</a>
    </div>
    <div v-if="props.createdAt" class="project__date-add">
      <span>добавлен</span><span>{{ createdAtFormatted }}</span>
    </div>
    <div class="project__deadline" v-if="props.deadline">
      <span>сделать до</span> <span>{{ deadLineFormatted }}</span>
    </div>
    <div class="project__deadline" v-else>
      <span>сделать до</span><span>-</span>
    </div>
    <div :aria-hidden="hiddenPanelConfirm" class="project__delete-confirm"
      :class="{ 'project__delete-confirm--hidden': hiddenPanelConfirm }">
      <p class="project__confirm-text">
        Вы уверены, что хотите удалить эту карточку?
      </p>
      <div class="project__ui-button">
        <UiBaseButton @click.stop="emitEventDeleteCard" text-color="white" bg-color="red">
          Delete
        </UiBaseButton>
      </div>
      <div class="project__ui-button">
        <UiBaseButton @click.stop="cancelClick" text-color="black" bg-color="white">
          Cancel
        </UiBaseButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.project {
  display: grid;
  gap: 5px;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 15px;
  border-radius: var(--radius-md);
  outline: solid 3px currentColor;



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
  }

  &__name {
    font-size: 16px;
    font-weight: 700;
  }

  &__price {
    font-size: 14px;
  }

  &__link {
    text-shadow: 0 0 10px currentColor;
    border-bottom: solid transparent 1px;
    padding-bottom: 5px;
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
    font-size: 12px;
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
      filter: drop-shadow(0px 0px 1px rgb(0, 0, 0));

    }
  }

  &__delete-confirm {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;
    position: absolute;
    top: 0px;
    left: 0px;
    right: 0px;
    bottom: 0px;
    padding: 20px;
    border-radius: var(--radius-md);
    outline: solid 3px currentColor;

    background-color: rgb(54, 54, 54);
    transition: opacity .5s;


    &--hidden {
      opacity: 0;
      pointer-events: none;
    }
  }

  &__confirm-text {
    line-height: 1.4;
    font-size: 12px;
    color: var(--color-light-50);
    letter-spacing: var(--letter-spacing);
  }

  &__ui-button {
   
  &:active {
    transform: scale(.99);
  } 
  }
}
</style>
