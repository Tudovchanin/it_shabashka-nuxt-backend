<script setup lang="ts">
import type { DataCommentAppWrite } from "#imports";
import { formatDateToRussianLocale, getDaysUntilDeadline } from "#imports";
import { inputMask } from "~/utils/mask-helpers";

type AsideCardInfo = {
  color?: string;
  id?: string;
  client?: string;
  client_email?: string;
  client_phone?: string;
  name?: string;
  price?: number;
  description?: string;
  link?: string;
  createdAt?: string;
  deadline?: string;
  comments?: DataCommentAppWrite[];
};

const props = defineProps<AsideCardInfo>();

const modelName = ref("");
const modelDescription = ref("");
const modelPrice = ref(0);
const modelLink = ref("");
const modelDeadLine = ref("");
const modelClient = ref("");
const modelClientEmail = ref("");
const valueClientPhone = ref("");

const comment = ref<string>("");
const idCommentDelete = ref<string>("");

const flagHiddenFormComment = ref(true);
const flagHiddenPanelDelete = ref(true);
const flagHiddenFormUpdate = ref(true);
const flagBlur = ref(false);

const refDescriptionTextarea = ref();
const refDescription = ref();
const refInputPhone = ref();

const heightDescription = ref("");

const getColorText = computed(() => {
  switch (props.color) {
    case "black":
      return "white";
      break;

    case "white":
      return "black";
      break;

    case "red":
      return "white";
      break;

    case "black":
      return "white";
      break;

    default:
      return "inherit";
      break;
  }
});

const emit = defineEmits(["add-comment", "delete-comment", "update-card"]);

const emitAddComment = () => {
  comment.value = comment.value.replace(/\s+/g, " ").trim();
  if (!comment.value) return;
  emit("add-comment", comment.value, props.id);
  comment.value = "";
  flagHiddenFormComment.value = true;
};

const emitDeleteComment = () => {
  emit("delete-comment", idCommentDelete.value, props.id);
  idCommentDelete.value = "";
  flagHiddenPanelDelete.value = true;
};

const emitUpdateCard = () => {
  emit("update-card", props.id, {
    name: modelName.value ? modelName.value : props.name,
    description: modelDescription.value,
    price: modelPrice.value ? modelPrice.value : props.price,
    link: modelLink.value,
    deadline: modelDeadLine.value,
    client: modelClient.value ? modelClient.value : props.client,
    client_email: modelClientEmail.value,
    client_phone: valueClientPhone.value
  });
  setStateFlagHiddenFormUpdate(true);
};

const handleKeyUp = ((e: KeyboardEvent) => {
  const inputPhone = e.target as HTMLInputElement;
  if (inputPhone.value ) {
    valueClientPhone.value = inputPhone.value
  }
})

const handleCancelDeleteComment = () => {
  idCommentDelete.value = "";
  flagHiddenPanelDelete.value = true;
};

const handleClickBtnTogglePanelDelete = (idComment: string) => {
  flagHiddenPanelDelete.value = !flagHiddenPanelDelete.value;
  idCommentDelete.value = "";

  if (!flagHiddenPanelDelete.value) {
    idCommentDelete.value = idComment;
  }
};

const handleVisibleFormComment = () => {
  console.log(props);

  flagHiddenFormComment.value = !flagHiddenFormComment.value;
};

const handleVisibleFormUpdateCard = () => {
  console.log(refDescription.value.offsetHeight);
  addValuePropsInRefs();
  setStateFlagHiddenFormUpdate(!flagHiddenFormUpdate.value);
  if (!flagHiddenFormUpdate.value) {
    refDescriptionTextarea.value.style.height = heightDescription.value + "px";
  }
};

const handleEventInputTextarea = () => {
  console.log(heightDescription.value);

  refDescriptionTextarea.value.style.height = "0px";
  refDescriptionTextarea.value.style.height =
    refDescriptionTextarea.value.scrollHeight + "px";
};



function addValuePropsInRefs() {
  if (props.name) {
    modelName.value = props.name;
  }
  if (props.description) {
    modelDescription.value = props.description;
  }
}
function setStateFlagHiddenFormUpdate(value: boolean) {
  flagHiddenFormUpdate.value = value;
}
function setStateFlagBlur(value: boolean) {
  flagBlur.value = value;
}

defineExpose({
  setStateFlagHiddenFormUpdate,
  setStateFlagBlur,
});

watch(
  () => [
    props.id,
    props.name,
    props.description,
    props.price,
    props.link,
    props.deadline,
    props.client,
    props.client_email,
    props.client_phone,
  ],
  () => {
    heightDescription.value = refDescription.value.offsetHeight;

    if (props.name) {
      modelName.value = props.name;
    }
    if (props.description) {
      modelDescription.value = props.description;
    }
    if (props.price) {
      modelPrice.value = props.price;
    }
    if (props.link) {
      modelLink.value = props.link;
    }

    if (props.deadline) {
      modelDeadLine.value = props.deadline;
    }
    if (props.client) {
      modelClient.value = props.client;
    }
    if (props.client_email) {
      modelClientEmail.value = props.client_email;
    }
    if (props.client_phone) {
      valueClientPhone.value = props.client_phone;
    }
  }
);

onMounted(() => {

  const maskStart = 3;
  const maskValue = "+7(___)___-__-__";
  const maskSymbols = [")", "(", "-"];
  const maskHover = true;



  inputMask(maskStart, maskValue, maskSymbols, refInputPhone.value, maskHover);
});
</script>
<template>
  <div class="aside-panel">
    <div class="aside-panel__header">
      <div v-if="$slots.card" class="aside-panel__card" :class="{ 'aside-panel__card--blur': flagBlur }">
        <slot name="card"></slot>
      </div>

      <div class="aside-panel__header-buttons">
        <div v-if="$slots.color" class="aside-panel__change-color-button">
          <slot name="color"></slot>
        </div>
        <div :aria-hidden="flagHiddenFormUpdate" class="aside-panel__button-save"
          :class="{ 'aside-panel__button-save--hidden': flagHiddenFormUpdate }">
          <UiBaseButton :bg-color="props.color || 'black'" :text-color="getColorText" @click="emitUpdateCard">Save
            update</UiBaseButton>
        </div>
      </div>

      <div class="aside-panel__days-until-deadline" v-if="props.deadline">
        Дней до дедлайна:
        <div :style="{
          color: getDaysUntilDeadline(props.deadline) < 5 ? 'red' : 'black',
        }">
          {{ getDaysUntilDeadline(props.deadline) }}
        </div>
      </div>
    </div>

    <div v-show="flagHiddenFormUpdate" class="info-project">

      <div class="info-project__name-project">
        <span> {{ props.name }}</span>
      </div>

      <div ref="refDescription" class="info-project__description">
        <span v-if="props.description">{{ props.description }}</span>

        <span v-else style="opacity: 0.5; font-weight: 500">нет описания</span>

      </div>
      <div class="info-project__price">
        <span>Цена: </span><span>{{ props.price }}</span> р
      </div>

      <a target="_blank" rel="noopener noreferrer" v-if="props.link" :href="props.link"
        class="info-project__link-layout">
        <span>Ссылка на макет: </span>
        <span>{{ props.link }}</span>
      </a>
      <div v-else class="info-project__link-layout">
        <span>Ссылка на макет: </span>
        <span style="opacity: 0.5; font-weight: 500">-</span>
      </div>



      <div class="info-project__deadline">
        <span>Дедлайн: </span>
        <span v-if="props.deadline">
          {{ props.deadline }}
        </span>
        <span v-else style="opacity: 0.5; font-weight: 500">-</span>
      </div>

      <div class="info-project__client layout">
        <span>Клиент: </span>
        <span>
          {{ props.client }}
        </span>
      </div>



      <div class="info-project__contact">
        <span>Email клиента: </span>
        <a class="link-contact info-project__contact-link" v-if="props.client_email"
          :href="'mailto:' + props.client_email" target="_blank" rel="noopener noreferrer"><span
            class="link-contact__text">{{ props.client_email }}</span>
          <span class="link-contact__img">
            <img src="/images/icon-mail.png" alt="иконка почты" />
          </span>
        </a>
        <span style="opacity: 0.5; font-weight: 500" class="info-project__contact-link" v-else>-</span>
      </div>

      <div class="info-project__contact">
        <span>Телефон клиента: </span>
        <a target="_blank" rel="noopener noreferrer" class="link-contact info-project__contact-link"
          v-if="props.client_phone" :href="`https://t.me/${props.client_phone.replace(/[^0-9+]/g, '')}`">
          <span class="link-contact__text">{{ props.client_phone }}</span>
          <span class="link-contact__img">
            <img src="/images/icon-telegram.png" alt="иконка telegram" />
          </span>
        </a>
        <span style="opacity: 0.5; font-weight: 500" class="info-project__contact-link" v-else>-</span>
      </div>
    </div>

    <form v-show="!flagHiddenFormUpdate" class="info-project">
      <div class="aside-panel__wrapper-update-input">
        <input maxlength="50" v-model="modelName" type="text"
          class="info-project__name-project aside-panel__update-input" />
        <div class="aside-panel__update-input-length">
          {{ 50 - modelName.length }}
        </div>
      </div>
      <div class="aside-panel__wrapper-update-input">
        <textarea maxlength="200" @input="handleEventInputTextarea" ref="refDescriptionTextarea"
          v-model="modelDescription"
          class="info-project__description aside-panel__update-input aside-panel__update-text-area"></textarea>

        <div class="aside-panel__update-input-length">
          {{ 200 - modelDescription.length }}
        </div>
      </div>

      <input v-model="modelPrice" type="number" class="info-project__price aside-panel__update-input" />
      <input v-model="modelLink" type="url" class="info-project__link-layout aside-panel__update-input" />
      <input v-model="modelDeadLine" type="date" class="info-project__deadline aside-panel__update-input" />

      <input v-model="modelClient" type="text" class="info-project__client aside-panel__update-input" />

      <div class="info-project__contact">
        <span>Email клиента: </span>
        <input v-model="modelClientEmail" type="email" class="info-project__contact-link aside-panel__update-input" />
      </div>

      <div class="info-project__contact">
        <span>Телефон клиента: </span>
        <input ref="refInputPhone" @keyup="handleKeyUp" type="text"
          class="info-project__contact-link aside-panel__update-input" />
      </div>
    </form>

    <div class="aside-panel__main-middle">
      <div class="aside-panel__label">
        <div class="aside-panel__label-left">
          <div class="aside-panel__label-text">Добавить комментарий</div>
          <button @click="handleVisibleFormComment" class="aside-panel__label-button" :class="{
            'aside-panel__label-button--close': !flagHiddenFormComment,
          }">
            <img :aria-hidden="!flagHiddenFormComment" src="/images/add-comment.png" alt="добавить комментарий" />
            <img :aria-hidden="flagHiddenFormComment" src="/images/icon-close.png"
              alt="закрыть форму добавления комментария" />
          </button>
        </div>

        <button @click="handleVisibleFormUpdateCard" class="aside-panel__label-right">
          <div class="aside-panel__label-text">Редактировать карточку</div>
          <div class="aside-panel__label-button" :class="{
            'aside-panel__label-button--close': !flagHiddenFormUpdate,
          }">
            <img :aria-hidden="!flagHiddenFormUpdate" src="/images/icon-update.png" alt="редактировать карточку" />
            <img :aria-hidden="flagHiddenFormUpdate" src="/public/images/icon-close.png"
              alt="закрыть редактирования карточки" />
          </div>
        </button>
      </div>
      <div class="aside-panel__container-form" :class="{
        'aside-panel__container-form--hidden': flagHiddenFormComment,
      }">
        <form class="aside-panel__form form-comments">
          <div class="form-comments__container-text-area">
            <textarea maxlength="200" placeholder="комментарий не больше 200 символов"
              class="aside-panel__text-area form-comments__text-area" v-model="comment"></textarea>
            <div class="form-comments__length">{{ 200 - comment.length }}</div>
          </div>
          <div @click="emitAddComment" class="form-comments__button">
            <UiBaseButton bg-color="white" text-color="black" type="button">Добавить комментарий
            </UiBaseButton>
          </div>
        </form>
      </div>
    </div>

    <div class="aside-panel__main-footer">
      <div class="aside-panel__panel-delete" :class="{ 'aside-panel__panel-delete--hidden': flagHiddenPanelDelete }">
        <div class="aside-panel__panel-delete-title">
          Вы уверенны что хотите удалить комментарий
        </div>
        <div class="aside-panel__panel-delete-button">
          <UiBaseButton @click.stop="handleCancelDeleteComment" text-color="black" bg-color="white">
            Cancel
          </UiBaseButton>
        </div>
        <div class="aside-panel__panel-delete-button">
          <UiBaseButton @click="emitDeleteComment" text-color="white" bg-color="red">
            Delete
          </UiBaseButton>
        </div>
      </div>

      <div class="aside-panel__container-comments">
        <div class="aside-panel__comment" v-for="comment in props.comments" :key="comment.$id">
          <span class="aside-panel__comment-date">{{
            formatDateToRussianLocale(comment.$createdAt)
            }}</span>
          <span>{{ comment.text }}</span>
          <button :data-id="comment.$id" @click="handleClickBtnTogglePanelDelete(comment.$id)"
            class="aside-panel__comments-delete">
            <img src="/images/icon-close.png" alt="удалить комментарий" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.info-project {
  display: flex;
  flex-direction: column;
  gap: 5px;

  &__name-project,
  &__description,
  &__price,
  &__link-layout,
  &__deadline,
  &__client,
  &__contact-link {
    padding-bottom: 5px;
    border-bottom: solid 1px transparent;
    animation: borderBottomAnimation var(--timing-animation-min) reverse;
  }

  &__name-project {
    font-size: 30px;
  }

  &__description {
    font-size: 16px;
  }

  &__price {
    font-size: 16px;

    & span:nth-child(2) {
      font-weight: 700;
    }
  }

  &__link-layout {
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 400px;

    & span:nth-child(2) {
      font-weight: 700;
    }
  }

  &__deadline {
    height: 22px;
    margin-bottom: 20px;
    font-size: 16px;

    & span:last-child {
      font-weight: 700;
    }
  }

  &__client {
    font-size: 20px;

    & span:nth-child(2) {
      font-weight: 700;
    }
  }

  &__contact {
    display: grid;
    gap: 5px;

    & span:nth-child(2) {
      font-weight: 700;
    }
  }

  &__contact-link {
    height: 31px;
    font-size: 16px;
  }


}

.link-contact {
  display: flex;
  align-items: center;
  gap: 20px;

  &__text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 400px;
  }

  &__img {
    width: 25px;
    height: 25px;
  }
}

.aside-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  padding: 20px 25px 20px;
  color: var(--color-light-50);

  &__header {
    display: flex;
    align-items: flex-start;
    gap: 25px;
    min-height: 220px;
  }

  &__card {
    flex-basis: 300px;
    flex-shrink: 0;
    position: relative;
    border-radius: var(--radius-middle-v1);
    overflow: hidden;
    color: var(--color-light-50);
    transition: filter 1s;

    &--blur {
      filter: blur(10px);
    }
  }

  &__header-buttons {
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%;
  }

  &__days-until-deadline {
    align-self: stretch;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    font-size: 18px;
    font-weight: 600;

    & div {
      font-weight: 600;
      font-size: 50px;
    }
  }

  &__main-middle {
    position: relative;
  }

  &__main-footer {
    position: relative;
  }

  &__button-save {
    color: white;
    max-width: 200px;
    width: 100%;
    filter: blur(0);
    transition: filter var(--timing-animation-min),
      opacity var(--timing-animation-min);

    &--hidden {
      pointer-events: none;
      filter: blur(5px);
      opacity: 0;
    }
  }

  &__wrapper-update-input {
    position: relative;
    padding-right: 20px;
  }

  &__update-input-length {
    position: absolute;
    bottom: 0;
    right: 0;
  }

  &__update-text-area {
    display: block;
    overflow: hidden;
    font-size: 16px;
    font-family: inherit;
    padding-bottom: 6px;
  }

  &__update-input {
    display: block;
    width: 100%;
    max-width: 100%;
    border: none;
    border-bottom: solid 1px var(--color-light-50);
    outline: none;
    background-color: transparent;
    color: inherit;
    animation: borderBottomAnimation var(--timing-animation-min);
    transition: border-color var(--timing-animation-min) linear;

    &:focus {
      border-bottom: solid 1px red;
    }
  }

  &__container-form {
    max-width: 400px;
    width: 100%;
    height: 180px;
    position: absolute;
    bottom: -180px;
    left: 0;
    z-index: 100;
    opacity: 1;
    transition: opacity var(--timing-animation-min) linear;
    border-radius: var(--radius-sm);
    overflow: hidden;

    &--hidden {
      opacity: 0;
      pointer-events: none;
    }
  }

  &__form {
    height: 100%;
    background-color: var(--main-color);
  }

  &__text-area {
    width: 100%;
    opacity: 1;
    height: 100%;
    padding: 10px;
    background-color: var(--main-color);
    color: var(--color-light-50);
    border: none;
    outline: none;
  }

  &__label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 30px;
    user-select: none;
  }

  &__label-left,
  &__label-right {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  &__label-right {
    background-color: transparent;
    border: none;
    font-size: inherit;
    color: inherit;
    cursor: pointer;
  }

  &__label-button {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    width: 50px;
    height: 50px;
    border: none;
    cursor: pointer;
    position: relative;

    & img {
      position: absolute;
      width: 35px;
      height: 35px;
      opacity: 1;
      transition: opacity var(--timing-animation-min) linear;
    }

    & img:last-child {
      width: 20px;
      height: 20px;
      opacity: 0;
    }

    &:active {
      transform: scale(var(--scale-decrease-middle));
    }

    &--close {
      & img:first-child {
        opacity: 0;
      }

      & img:last-child {
        opacity: 1;
      }
    }
  }

  &__container-comments {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 0;
  }

  &__comment {
    overflow-wrap: break-word;
    line-height: 1.5;
    position: relative;
    padding-right: 30px;
  }

  &__comment-date {
    margin-right: 20px;
  }

  &__comments-delete {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 25px;
    height: 25px;
    position: absolute;
    right: 0;
    border: none;
    background-color: var(--main-color);
    cursor: pointer;

    & img {
      width: 15px;
      height: 15px;
    }
  }

  &__panel-delete {
    display: grid;
    gap: 20px;
    position: absolute;
    z-index: 100;
    left: 50%;
    top: 0;
    max-width: 300px;
    height: 250px;
    transform: translateX(-50%);
    padding: 20px;
    border-radius: var(--radius-md);
    background-color: var(--main-color);
    transition: filter var(--timing-animation-min),
      opacity var(--timing-animation-min);

    &--hidden {
      filter: blur(30px);
      opacity: 0;
      pointer-events: none;
    }
  }

  &__panel-delete:not(.aside-panel__panel-delete--hidden)+.aside-panel__container-comments>.aside-panel__comment {
    filter: blur(2px);
    opacity: 0.5;
    pointer-events: none;
  }
}

.form-comments {
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__container-text-area {
    position: relative;
    height: 100%;
  }

  &__length {
    position: absolute;
    left: 10px;
    bottom: 5px;
  }
}

@keyframes shadow {
  from {
    box-shadow: 0 0 30px 20px red;
  }

  to {
    box-shadow: 0 0 0 0 red;
  }
}

@keyframes blur {
  from {
    filter: blur(10px);
  }

  to {
    filter: blur(0);
  }
}

@keyframes borderBottomAnimation {
  from {
    border-bottom: 1px solid transparent;
  }

  to {
    border-bottom: 1px solid var(--color-light-50);
  }
}
</style>
