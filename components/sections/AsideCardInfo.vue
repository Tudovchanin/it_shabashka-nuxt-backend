<script setup lang="ts">
import type { DataCommentAppWrite } from "#imports";
import { formatDateToRussianLocale, getDaysUntilDeadline } from "#imports";
import { InputMask } from "~/utils/mask-helpers";

import type { ColorKeyTextMap } from "~/constants/color-mapping.constants";
import { COLOR_TEXT_MAP } from "~/constants/color-mapping.constants";



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
// используем для маски телефона, так как модель с маской глючит
const valueClientPhone = ref("");

const comment = ref<string>("");
const idCommentDelete = ref<string>("");

const flagHiddenFormAddComment = ref(true);
const flagHiddenPanelDeleteComment = ref(true);
const flagHiddenFormUpdate = ref(true);
const flagBlur = ref(false);

const refDescription = ref();

const refNameProjectInput = ref();
const refDescriptionTextarea = ref();
const refInputPhone = ref();
const refClientEmailInput = ref();
const refLinkInput = ref();
const refClientNameInput = ref();

const heightDescriptionTextarea = ref("");

// цвет для текста кнопки, в зависимости от цвета карточки

const getColorText = computed(() => {
  return COLOR_TEXT_MAP[props.color as ColorKeyTextMap] || "inherit";
});

const emit = defineEmits(["add-comment", "delete-comment", "update-card"]);

// --------------------------------------------------------------------------------

// Комментарии

const emitAddComment = () => {
  comment.value = comment.value.replace(/\s+/g, " ").trim();
  if (!comment.value) return;
  emit("add-comment", comment.value, props.id);
  flagHiddenFormAddComment.value = true;
  resetRefValueComment();
};

const emitDeleteComment = () => {
  emit("delete-comment", idCommentDelete.value, props.id);
  flagHiddenPanelDeleteComment.value = true;
  resetRefValueComment();
};

const handleCancelDeleteComment = () => {
  flagHiddenPanelDeleteComment.value = true;
  resetRefValueComment();
};

const handleClickBtnTogglePanelDeleteComment = (
  idComment: string,
  commentValue: string
) => {
  flagHiddenPanelDeleteComment.value = !flagHiddenPanelDeleteComment.value;
  flagHiddenFormAddComment.value = true;
  resetRefValueComment();

  if (!flagHiddenPanelDeleteComment.value) {
    idCommentDelete.value = idComment;
    comment.value = commentValue;
  }
};

const handleVisibleFormComment = () => {
  flagHiddenFormAddComment.value = !flagHiddenFormAddComment.value;
  flagHiddenPanelDeleteComment.value = true;
  resetRefValueComment();
};

function resetRefValueComment() {
  idCommentDelete.value = "";
  comment.value = "";
}

// --------------------------------------------------------------------------

// Карточка

const emitUpdateCard = () => {
  if (modelDescription.value) {
    modelDescription.value = modelDescription.value.replace(/\s+/g, " ").trim();
  }

  if (modelName.value.length === 0) {
    refNameProjectInput.value.setCustomValidity("");
    refNameProjectInput.value.setCustomValidity(
      "Имя проекта не может быть пустым"
    );
    refNameProjectInput.value.reportValidity();
    return;
  }
  if (modelLink.value.length > 254) {
    refLinkInput.value.setCustomValidity("");
    refLinkInput.value.setCustomValidity(
      "Пожалуйста, введите ссылку максимум 254 символов"
    );
    refLinkInput.value.reportValidity();
    return;
  }

  if (modelClient.value.length === 0) {
    refClientNameInput.value.setCustomValidity("");
    refClientNameInput.value.setCustomValidity(
      "Имя клиента не может быть пустым"
    );
    refClientNameInput.value.reportValidity();
    return;
  }
  if (modelClientEmail.value) {
    refClientEmailInput.value.setCustomValidity("");

    const isValid = refClientEmailInput.value.checkValidity();
    if (!isValid) {
      console.log(modelClientEmail.value, "!isValid");

      refClientEmailInput.value.reportValidity(); // Показывает браузерное сообщение
      return;
    }

    if (modelClientEmail.value.length > 254) {
      refClientEmailInput.value.setCustomValidity(
        "Пожалуйста, введите корректный email (максимум 254 символов)"
      ); // кастомное сообщение
      refClientEmailInput.value.reportValidity();
      return;
    }

    refClientEmailInput.value.setCustomValidity("");
  }

  emit("update-card", props.id, {
    name: modelName.value ? modelName.value : props.name,
    description: modelDescription.value,
    price: modelPrice.value ? modelPrice.value : props.price,
    link: modelLink.value,
    deadline: modelDeadLine.value,
    client: modelClient.value ? modelClient.value : props.client,
    client_email: modelClientEmail.value,
    client_phone: refInputPhone.value.value,
  });
  setStateFlagHiddenFormUpdate(true);
};

// используем для маски телефона, так как модель с маской глючит
const handleKeyUp = (e: KeyboardEvent) => {
  const inputPhone = e.target as HTMLInputElement;

  if (inputPhone.value) {
    valueClientPhone.value = inputPhone.value;
  }
};

const handleVisibleFormUpdateCard = () => {
  addValuePropsInRefs();

  setStateFlagHiddenFormUpdate(!flagHiddenFormUpdate.value);
  if (!flagHiddenFormUpdate.value) {
    // removePhoneMask();
    maskPhone?.removeMaskListeners();

    refInputPhone.value.value = props.client_phone;
    // removePhoneMask = inputMask(
    //   maskStart,
    //   maskValue,
    //   maskSymbols,
    //   refInputPhone.value,
    //   maskHover
    // );
    maskPhone = new InputMask(maskStart, mask, maskSymbolsNotReplace, refInputPhone.value);
    maskPhone.initMask();
    refDescriptionTextarea.value.style.height =
      heightDescriptionTextarea.value + "px";
  }
};

// для подбора высоты Textarea
const handleEventInputTextarea = () => {
  refDescriptionTextarea.value.style.height = "0px";
  refDescriptionTextarea.value.style.height =
    refDescriptionTextarea.value.scrollHeight + "px";
};

// при клике на редактирование карточки, добавляет состояние в input и textarea
function addValuePropsInRefs() {
  if (props.name) {
    modelName.value = props.name;
  }
  if (props.description) {
    modelDescription.value = props.description;
  }
  if (props.link) {
    modelLink.value = props.link;
  }
  if (props.client) {
    modelClient.value = props.client;
  }
  if (props.price) {
    modelPrice.value = props.price;
  }
  if (props.deadline) {
    modelDeadLine.value = props.deadline;
  }
  if (props.client_email) {
    modelClientEmail.value = props.client_email;
  }
  if (props.client_phone) {
    console.log(props.client_phone, "props.client_phone");

    valueClientPhone.value = props.client_phone;
  }
}

function setStateFlagHiddenFormUpdate(value: boolean) {
  flagHiddenFormUpdate.value = value;
}

// эффект blur при update card и изменении цвета
function setStateFlagBlur(value: boolean) {
  flagBlur.value = value;
}

// -------------------------------------------------------

// маска телефона
// let removePhoneMask: any = null;
let maskPhone:null | InputMask = null;

const maskStart = 3;
const mask = "+7(___)___-__-__";
const maskSymbolsNotReplace = [")", "(", "-"];
// const maskHover = false;


defineExpose({
  setStateFlagBlur,
});


onMounted(() => {
  heightDescriptionTextarea.value = refDescription.value.offsetHeight;
  maskPhone = new InputMask(maskStart, mask, maskSymbolsNotReplace, refInputPhone.value);
maskPhone.initMask();
  // removePhoneMask = inputMask(
  //   maskStart,
  //   maskValue,
  //   maskSymbols,
  //   refInputPhone.value,
  //   maskHover
  // );


});

onBeforeUnmount(() => {

  // if (removePhoneMask) {
  //   removePhoneMask();
  // }

  maskPhone?.removeMaskListeners();

});
</script>
<template>
  <div class="aside-panel">
    <div class="aside-panel__header">
      <div
        v-if="$slots.card"
        class="aside-panel__card"
        :class="{ 'aside-panel__card--blur': flagBlur }"
      >
        <slot name="card"></slot>
      </div>

      <div class="aside-panel__header-buttons">
        <div v-if="$slots.color" class="aside-panel__change-color-button">
          <slot name="color"></slot>
        </div>
        <div
          :aria-hidden="flagHiddenFormUpdate"
          class="aside-panel__button-save"
          :class="{ 'aside-panel__button-save--hidden': flagHiddenFormUpdate }"
        >
          <UiBaseButton
            :bg-color="props.color || 'black'"
            :text-color="getColorText"
            @click="emitUpdateCard"
            >Save
          </UiBaseButton>
        </div>
      </div>

      <div
        class="aside-panel__days-until-deadline days-until-deadline"
        v-if="props.deadline"
      >
        <div class="days-until-deadline__text">Дней до дедлайна:</div>

        <div
          class="days-until-deadline__number"
          :style="{
            color: getDaysUntilDeadline(props.deadline) < 5 ? 'red' : 'black',
          }"
        >
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
        <span v-else style="opacity: 0.7; font-weight: 500">нет описания</span>
      </div>

      <div class="info-project__price">
        <span>Цена: </span><span>{{ props.price?.toLocaleString('ru-RU') }}</span> р
      </div>

      <a
        target="_blank"
        rel="noopener noreferrer"
        v-if="props.link"
        :href="props.link"
        class="info-project__link-layout"
      >
        <span>Ссылка на макет: </span>
        <span>{{ props.link }}</span>
      </a>

      <div v-else class="info-project__link-layout">
        <span>Ссылка на макет: </span>
        <span style="opacity: 0.7; font-weight: 500">-</span>
      </div>

      <div class="info-project__deadline">
        <span>Дедлайн: </span>
        <span v-if="props.deadline">
          {{ props.deadline }}
        </span>
        <span v-else style="opacity: 0.7; font-weight: 500">-</span>
      </div>

      <div class="info-project__client">
        <span>Клиент: </span>
        <span>
          {{ props.client }}
        </span>
      </div>

      <div class="info-project__contact">
        <span>Email клиента: </span>
        <a
          class="link-contact info-project__contact-link"
          v-if="props.client_email"
          :href="'mailto:' + props.client_email"
          target="_blank"
          rel="noopener noreferrer"
          ><span class="link-contact__text">{{ props.client_email }}</span>
          <span class="link-contact__img">
            <img src="/images/icon-mail.png" alt="иконка почты" />
          </span>
        </a>
        <span
          style="opacity: 0.7; font-weight: 500"
          class="info-project__contact-link"
          v-else
          >-</span
        >
      </div>

      <div class="info-project__contact">
        <span>Телефон клиента: </span>
        <a
          target="_blank"
          rel="noopener noreferrer"
          class="link-contact info-project__contact-link"
          v-if="props.client_phone"
          :href="`https://t.me/${props.client_phone.replace(/[^0-9+]/g, '')}`"
        >
          <span class="link-contact__text">{{ props.client_phone }}</span>
          <span class="link-contact__img">
            <img src="/images/icon-telegram.png" alt="иконка telegram" />
          </span>
        </a>
        <span
          style="opacity: 0.7; font-weight: 500"
          class="info-project__contact-link"
          v-else
          >-</span
        >
      </div>
    </div>

    <form v-show="!flagHiddenFormUpdate" class="info-project">
      <div class="aside-panel__wrapper-update-input">
        <input
          ref="refNameProjectInput"
          maxlength="50"
          v-model="modelName"
          type="text"
          class="info-project__name-project aside-panel__update-input"
        />
        <div class="aside-panel__update-input-length">
          {{ 50 - modelName.length }}
        </div>
      </div>

      <div class="aside-panel__wrapper-update-input">
        <textarea
          maxlength="200"
          placeholder="описание шабашки"
          @input="handleEventInputTextarea"
          ref="refDescriptionTextarea"
          v-model="modelDescription"
          class="info-project__description aside-panel__update-input aside-panel__update-text-area"
        ></textarea>

        <div class="aside-panel__update-input-length">
          {{ 200 - modelDescription.length }}
        </div>
      </div>

      <input
        v-model="modelPrice"
        type="number"
        class="info-project__price aside-panel__update-input"
      />

      <input
        ref="refLinkInput"
        v-model="modelLink"
        type="url"
        placeholder="ссылка на макет"
        class="info-project__link-layout aside-panel__update-input"
      />

      <input
        v-model="modelDeadLine"
        type="date"
        class="info-project__deadline aside-panel__update-input"
      />

      <div class="aside-panel__wrapper-update-input">
        <input
          ref="refClientNameInput"
          maxlength="50"
          v-model="modelClient"
          type="text"
          class="info-project__client aside-panel__update-input"
        />
        <div class="aside-panel__update-input-length">
          {{ 50 - modelClient.length }}
        </div>
      </div>

      <div class="info-project__contact">
        <div>Email клиента:</div>
        <input
          ref="refClientEmailInput"
          v-model="modelClientEmail"
          type="email"
          title="Пожалуйста, введите корректный email (максимум 320 символов)"
          class="info-project__contact-link aside-panel__update-input"
        />
      </div>

      <div class="info-project__contact">
        <span>Телефон клиента: </span>
        <input
          autocomplete="nope"
          placeholder="+7(___)___-__-__"
          ref="refInputPhone"
          @keyup="handleKeyUp"
          type="text"
          class="info-project__contact-link aside-panel__update-input"
        />
      </div>
    </form>

    <div class="aside-panel__main-middle">
      <div class="aside-panel__label">
        <button
          @click="handleVisibleFormComment"
          class="aside-panel__label-left"
        >
          <div class="aside-panel__label-text">
            {{
              flagHiddenFormAddComment
                ? "Добавить комментарий"
                : "Закрыть редактор"
            }}
          </div>

          <div
            class="aside-panel__label-button"
            :class="{
              'aside-panel__label-button--close': !flagHiddenFormAddComment,
            }"
          >
            <img
              aria-hidden="true"
              src="/images/add-comment.png"
              alt="иконка"
            />
            <img aria-hidden="true" src="/images/icon-close.png" alt="иконка" />
          </div>
        </button>

        <button
          @click="handleVisibleFormUpdateCard"
          class="aside-panel__label-right"
        >
          <div class="aside-panel__label-text">{{
              flagHiddenFormUpdate
                ? "Редактировать карточку"
                : "Закрыть редактор"
            }}</div>
          <div
            class="aside-panel__label-button"
            :class="{
              'aside-panel__label-button--close': !flagHiddenFormUpdate,
            }"
          >
            <img
              :aria-hidden="!flagHiddenFormUpdate"
              src="/images/icon-update.png"
              alt="редактировать карточку"
            />
            <img
              :aria-hidden="flagHiddenFormUpdate"
              src="/public/images/icon-close.png"
              alt="закрыть редактирования карточки"
            />
          </div>
        </button>
      </div>
      <div
        class="aside-panel__container-form"
        :class="{
          'aside-panel__container-form--hidden': flagHiddenFormAddComment,
        }"
      >
        <form class="aside-panel__form form-comments">
          <div class="form-comments__container-text-area">
            <textarea
              maxlength="200"
              placeholder="комментарий не больше 200 символов"
              class="aside-panel__text-area form-comments__text-area"
              v-model="comment"
            ></textarea>
            <div class="form-comments__length">{{ 200 - comment.length }}</div>
          </div>
          <div @click="emitAddComment" class="form-comments__button">
            <UiBaseButton bg-color="white" text-color="black" type="button"
              >Добавить комментарий
            </UiBaseButton>
          </div>
        </form>
      </div>
    </div>

    <div class="aside-panel__main-footer">
      <div
        class="aside-panel__panel-delete"
        :class="{
          'aside-panel__panel-delete--hidden': flagHiddenPanelDeleteComment,
        }"
        :aria-hidden="flagHiddenPanelDeleteComment"
      >
        <div class="aside-panel__panel-delete-title">
          Вы уверенны что хотите удалить комментарий
        </div>
        <div class="aside-panel__panel-delete-button">
          <UiBaseButton
            :aria-hidden="flagHiddenPanelDeleteComment"
            aria-label="не удалять комментарий"
            @click.stop="handleCancelDeleteComment"
            text-color="black"
            bg-color="white"
          >
            Cancel
          </UiBaseButton>
        </div>
        <div class="aside-panel__panel-delete-button">
          <UiBaseButton
            :aria-hidden="flagHiddenPanelDeleteComment"
            :aria-label="`удалить комментарий ${comment}`"
            @click="emitDeleteComment"
            text-color="white"
            bg-color="red"
          >
            Delete
          </UiBaseButton>
        </div>
      </div>

      <div v-if="props.comments" class="aside-panel__container-comments">
        <div
          class="aside-panel__comment"
          v-for="comment in props.comments"
          :key="comment.$id"
        >
          <span class="aside-panel__comment-date">{{
            formatDateToRussianLocale(comment.$createdAt)
          }}</span>
          <span>{{ comment.text }}</span>
          <button
            :aria-label="
              flagHiddenPanelDeleteComment
                ? `Открыть панель удаления комментария от ${formatDateToRussianLocale(
                    comment.$createdAt
                  )}`
                : 'Закрыть панель'
            "
            :data-id="comment.$id"
            @click="
              handleClickBtnTogglePanelDeleteComment(comment.$id, comment.text)
            "
            class="aside-panel__comments-delete"
          >
            <img src="/images/icon-close.png" alt="иконка" aria-hidden="true" />
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
    margin-bottom: 10px;
    animation: borderBottomAnimation var(--timing-animation-min) reverse;
  }

  &__name-project {
    font-weight: 700;
    font-size: 22px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
    @media (max-width: 700px) {
      font-size: 16px;
    }
    @media (max-width: 500px) {
      max-width: 400px;
    }

  }

  &__description {
    font-size: 16px;
    overflow-wrap: break-word;

    @media (max-width: 700px) {
      font-size: 14px;
    }
  }

  &__price {
    font-size: 16px;

    @media (max-width: 700px) {
      font-size: 14px;
    }

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

    @media (max-width: 700px) {
      font-size: 14px;
    }
    @media (max-width: 430px) {
      max-width: 250px;
    }


    & span:nth-child(2) {
      font-weight: 700;
    }
  }

  &__deadline {
    height: 22px;
    margin-bottom: 20px;
    font-size: 16px;

    @media (max-width: 700px) {
      font-size: 14px;
    }

    & span:last-child {
      font-weight: 700;
    }
  }

  &__client {
    font-size: 20px;
    font-weight: 700;
    @media (max-width: 700px) {
      font-size: 14px;
    }

    & span:nth-child(1) {
      font-weight: 400;
    }
  }

  &__contact {
    display: grid;
    gap: 5px;

    @media (max-width: 700px) {
      font-size: 14px;
    }

    & span:nth-child(2) {
      font-weight: 700;
    }
  }

  &__contact-link {
    height: 31px;
    font-size: 16px;

    @media (max-width: 700px) {
      font-size: 14px;
    }
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

    @media (max-width: 430px) {
      max-width: 250px;
    }
  }

  &__img {
    width: 30px;
    height: 30px;
    padding: 2px;
  }
}

.aside-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;

  &__header {
    display: flex;
    align-items: flex-start;

    gap: 20px;

    // min-height: 150px;
    @media (max-width: 760px) {
      flex-wrap: wrap;
    }
  }

  &__card {
    flex-basis: 250px;
    flex-shrink: 0;
    position: relative;
    color: var(--color-light-50);
    transition: filter 1s;
    background-color: transparent;
    @media (max-width: 290px) {
      flex-basis: 100%;
    }
    &--blur {
      filter: blur(10px);
    }
  }

  &__header-buttons {
    flex-shrink: 0;
    align-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
    width: 100%;
    max-width: 250px;
  }

  &__days-until-deadline {
    align-self: flex-end;
    display: flex;
    flex-direction: column;

    @media (max-width: 760px) {
      flex-direction: row;
      align-items: center;
      gap: 20px;
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
    max-width: 100px;
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
    bottom: 10px;
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

    animation: borderBottomAnimation var(--timing-animation-min);
    transition: border-color var(--timing-animation-min) linear;
    color: inherit;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;

    &:focus {
      border-bottom: solid 1px red;
    }

    &::placeholder {
      opacity: 0.5;
      color: white;
    }
  }

  &__label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row-reverse;
    gap: 30px;
    user-select: none;

    @media (max-width: 600px) {
      gap: 20px;
    }
    @media (max-width: 480px) {
      justify-content: space-around;
    }
  }

  &__label-left,
  &__label-right {
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    justify-content: flex-end;
    gap: 10px;
    min-width: 230px;
    background-color: transparent;
    border: none;
    font-size: inherit;
    color: inherit;
    cursor: pointer;
    @media (max-width: 700px) {
      min-width: 200px;
    }

    @media (max-width: 480px) {
      min-width: initial;
      gap: 0;
    }
  }
 

  &__label-text {
    text-align: left;
    font-size: 16px;

    @media (max-width: 700px) {
      font-size: 14px;
    }

    @media (max-width: 480px) {
      font-size: 0px;
      opacity: 0;
    }
  }
  &__label-button {
    background-color: transparent;
    width: 30px;
    height: 30px;
    border: none;
    cursor: pointer;
    position: relative;

    & img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 26px;
      height: 26px;
      opacity: 1;
      transition: opacity var(--timing-animation-min) linear;
    }

    & img:last-child {
      width: 15px;
      height: 15px;
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

  &__container-form {
    display: block;
    max-width: 400px;
    width: 100%;
    position: absolute;
    top: 50px;
    left: 0;
    z-index: 100;
    padding-top: 20px;
    padding-bottom: 20px;
    opacity: 1;
    transition: visibility var(--timing-animation-min) linear, var(--timing-animation-min) linear;
    &--hidden {
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
    }
  }

  &__form {
    height: 100%;
    border-radius: var(--radius-sm);
  }

  &__text-area {
    width: 100%;
    opacity: 1;
    height: 130px;
    padding: 10px 10px 20px 10px;
    border-radius: var(--radius-sm);
    outline: solid rgb(255, 255, 255) 2px;
    background-color: var(--main-color);
    color: var(--color-light-50);
    border: none;
    overflow-y: hidden;
    margin-bottom: 20px;
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
    @media (max-width: 700px) {
      font-size: 14px;
    }
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
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 20px;
    position: absolute;
    z-index: 100;
    left: 50%;
    top: 0;
    max-width: 300px;
    width: 100%;

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
      width: 1px;
      height: 1px;
      overflow: hidden;
    }
  }

  &__panel-delete-button {
    font-size: 14px;

    @media (max-width: 300px) {
      margin-left: auto;
      margin-right: auto;
    }
  }

  &__panel-delete:not(.aside-panel__panel-delete--hidden)
    + .aside-panel__container-comments
    > .aside-panel__comment {
    filter: blur(2px);
    opacity: 0.5;
    pointer-events: none;
  }
}

.form-comments {
  display: flex;
  flex-direction: column;
  position: relative;

  &__text-area {
    padding-right: 20px;
  }

  &__length {
    position: absolute;
    right: 0;
    top: 0px;
    font-size: 12px;
    font-weight: 700;
    color: black;
    background-color: white;
  }
}

.days-until-deadline {
  font-size: 18px;
  font-weight: 600;

  @media (max-width: 780px) {
    font-size: 14px;
  }

  &__number {
    font-size: 30px;

    @media (max-width: 780px) {
      font-size: 20px;
    }
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
