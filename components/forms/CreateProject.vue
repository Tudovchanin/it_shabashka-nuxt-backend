<script setup lang="ts">
import type {
  DataProjectAppWrite,
  TypeProjectStatus,
} from "~/stores/projects.store";
import { ProjectStatus } from "~/stores/projects.store";
import { STATUS_TRANSLATIONS } from "~/constants/project.constants";
import { InputMask } from "~/utils/mask-helpers";

export type FormProjectKanban = Pick<
  DataProjectAppWrite,
  | "name"
  | "price"
  | "status"
  | "description"
  | "client"
  | "link"
  | "deadline"
  | "client_email"
  | "client_phone"
>;

const props = defineProps<{
  status?: TypeProjectStatus;
}>();

const formData = ref<FormProjectKanban>({
  client: "",
  client_phone: "",
  client_email: "",
  name: "",
  price: 0,
  link: "",
  deadline: "",
  status: ProjectStatus.NEW,
  description: "",
});

const refInput = ref();

watch(
  () => props.status,
  () => {
    if (props.status) {
      formData.value.status = props.status;
    }
  }
);

const emit = defineEmits(["create-project", "change-status"]);

const emitChangeStatus = () => {
  emit("change-status", formData.value.status);
};

const emitCreateProject = () => {
  if (formData.value.description) {
    formData.value.description = formData.value.description
      .replace(/\s+/g, " ")
      .trim();
  }
  emit("create-project", formData.value);
  resetForm();
  // removePhoneMask();
  maskPhone?.removeMaskListeners;
  // значение инпута в маске
  refInput.value.value = "";
  // removePhoneMask = inputMask(maskStart, maskValue, maskSymbols, refInput.value, maskHover);
  maskPhone = new InputMask(
    maskStart,
    mask,
    maskSymbolsNotReplace,
    refInput.value
  );
};

// для маски нужно использовать события, v-model глючит
const handleKeyUp = (e: any) => {
  formData.value.client_phone = e.target.value;
};

function resetForm() {
  formData.value = {
    name: "",
    price: 0,
    status: props.status ? props.status : ProjectStatus.NEW,
    description: "",
    client: "",
    client_phone: "",
    client_email: "",
    link: "",
    deadline: "",
  };
}

//         pattern="^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$"
const maskStart = 3;
const mask = "+7(___)___-__-__";
const maskSymbolsNotReplace = [")", "(", "-"];

let maskPhone: null | InputMask = null;

// let removePhoneMask: any = null;
onMounted(() => {
  maskPhone = new InputMask(
    maskStart,
    mask,
    maskSymbolsNotReplace,
    refInput.value
  );
  maskPhone.initMask();
  // removePhoneMask = inputMask(maskStart, maskValue, maskSymbols, refInput.value, maskHover);
});

onBeforeUnmount(() => {
  // removePhoneMask();
  maskPhone?.removeMaskListeners();
});
</script>
<template>
  <form @submit.prevent="emitCreateProject" class="form-create-project">
    <div class="form-create-project__field">
      <label class="form-create-project__label" for="client"
        >Клиент
        <span class="required-asterisk" aria-hidden="true">*</span></label
      >
      <input
        maxlength="50"
        v-model="formData.client"
        id="client"
        type="text"
        pattern="^.{1,50}$"
        title="Не более 50 символов"
        placeholder="Имя/Компания (до 50 симв.)"
        class="form-create-project__input"
        required
      />
    </div>

    <div class="form-create-project__field">
      <label class="form-create-project__label" for="phone"
        >Телефон клиента</label
      >
      <input
        autocomplete="nope"
        ref="refInput"
        @keyup="handleKeyUp"
        id="phone"
        type="text"
        pattern="^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$"
        placeholder="+7(___)___-__-__"
        title="Введите полный номер в формате: +7(XXX)XXX-XX-XX"
        class="form-create-project__input"
      />
    </div>

    <div class="form-create-project__field">
      <label class="form-create-project__label" for="email"
        >Email клиента</label
      >
      <input
        v-model="formData.client_email"
        id="email"
        type="email"
        placeholder="example@domain.com"
        class="form-create-project__input"
        pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        title="Введите корректный email адрес"
      />
    </div>

    <div class="form-create-project__field">
      <label class="form-create-project__label" for="project"
        >Название шабашки
        <span class="required-asterisk" aria-hidden="true">*</span></label
      >
      <input
        v-model="formData.name"
        id="project"
        type="text"
        pattern="^[\p{L}\p{N}\- ]{1,50}$"
        title="Можно использовать буквы, цифры, пробелы и тире (макс. 50 символов)"
        placeholder="до 50 символов"
        class="form-create-project__input"
        required
      />
    </div>
    <div class="form-create-project__field">
      <label class="form-create-project__label" for="price">Цена шабашки</label>
      <input
        v-model="formData.price"
        id="price"
        placeholder="0"
        type="number"
        max="100000000"
        min="0"
        class="form-create-project__input"
      />
    </div>
    <div class="form-create-project__field">
      <label class="form-create-project__label" for="link"
        >Ссылка на макет</label
      >
      <input
        v-model="formData.link"
        id="link"
        pattern="https://.*"
        placeholder="https://example.com"
        title="Введите корректный URL, начинающийся с https://"
        type="url"
        class="form-create-project__input"
      />
    </div>
    <div class="form-create-project__field">
      <label class="form-create-project__label" for="date">Дедлайн</label>
      <input
        v-model="formData.deadline"
        id="date"
        type="date"
        class="form-create-project__input"
      />
    </div>
    <div class="form-create-project__field">
      <label class="form-create-project__label" for="status"
        >Статус шабашки</label
      >
      <select
        @change="emitChangeStatus"
        v-model="formData.status"
        id="status"
        class="form-create-project__input"
      >
        <option :key="status" v-for="status in ProjectStatus" :value="status">
          {{ STATUS_TRANSLATIONS[status] }}
        </option>
      </select>
    </div>
    <div class="form-create-project__field description">
      <label class="form-create-project__label description__label"
        >Описание шабашки</label
      >
      <textarea
        maxlength="200"
        placeholder="описание не больше 200 символов"
        v-model="formData.description"
        class="description__text-area form-create-project__input"
      ></textarea>
      <div class="form-create-project__label description__length">
        {{ 200 - (formData.description ? formData.description.length : 0) }}
      </div>
    </div>
    <button class="form-create-project__button" type="submit">
      Добавить шабашку
    </button>
  </form>
</template>
<style lang="scss" scoped>
.form-create-project {
  width: 100%;
  padding: 15px 25px;

  // background-color: red;
  @media (max-width: 550px) {
    padding: 12px 20px;
  }

  &__field {
    display: grid;
    gap: 8px;
    margin-bottom: 10px;
  }

  &__label {
    color: rgb(0, 0, 0);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: var(--letter-spacing);

    @media (max-width: 550px) {
      font-size: 12px;
    }
  }

  &__input {
    height: 35px;
    padding-left: 10px;
    outline: none;
    border: none;
    border-radius: var(--radius-sm);
    background-color: rgb(0, 0, 0);
    color: rgb(255, 255, 255, 0.5);
    font-size: 14px;

    @media (max-width: 550px) {
      font-size: 12px;
    }

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }

    &:focus {
      opacity: 1;
      color: white;
    }
  }

  &__button {
    width: 100%;
    height: 40px;
    position: relative;
    z-index: 1;

    background-color: rgb(0, 0, 0);
    border: none;
    border-radius: var(--radius-input);
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--color-light-50);
    letter-spacing: 0.079em;
    transition: color var(--timing-animation-min);
    cursor: pointer;

    @media (max-width: 550px) {
      font-size: 12px;
    }

    @media (hover: hover) {
      &:hover {
        color: black;
      }

      &:hover::before {
        width: 100%;
      }
    }

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      z-index: -1;
      width: 0;

      border-radius: var(--radius-input);
      background-color: var(--color-light-50);
      transition: width var(--timing-animation-min);
    }

    &:active {
      transform: scale(0.99);
    }
  }
}

.description {
  position: relative;

  &__text-area {
    height: 100px;
    padding: 10px;
  }

  &__length {
    position: absolute;
    right: 0;
    top: 2px;
    color: rgb(0, 0, 0);
  }
}

input[type="date"] {
  cursor: pointer;
}

/* Стиль для кнопки календаря */
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  /* Инвертирует цвет (белая на черном) */
  cursor: pointer;

  /* Или явно задайте цвет */
  /* background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg..."); */
}

input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 500px rgb(0, 0, 0) inset;
  -webkit-text-fill-color: rgb(255, 255, 255, 0.5);
}
</style>
