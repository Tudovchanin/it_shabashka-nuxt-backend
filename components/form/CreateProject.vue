<script setup lang="ts">
import type { DataCardAppWrite, TypeProjectStatus } from "~/stores/cards.store";
import { ProjectStatus } from "~/stores/cards.store";
import { STATUS_TRANSLATIONS } from "~/constants/project.constants";
import { inputMask } from "~/utils/mask-helpers";

export type FormCardKanban = Pick<
  DataCardAppWrite,
  "name" | "price" | "status" | "description" | "client" | "link" | "deadline"| "client_email" | "client_phone"
>;

const props = defineProps<{
  status?: TypeProjectStatus;
}>();

const formData = ref<FormCardKanban>({
  client: "",
  client_phone: '',
  client_email: '',
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
const emitChangeStatus = (()=> {
    
  emit("change-status", formData.value.status);
  console.log(formData.value.description,'formData.value.description');

});
const emitCreateProject = (()=> {
  if(formData.value.description) {
    console.log(formData.value.description,'formData.value.description');
    
    formData.value.description = formData.value.description
    .replace(/\s+/g, ' ') 
    .trim()
  }
  emit("create-project", formData.value);
  resetForm();
})

// для маски нужно использовать события, v-model глючит
const handleKeyUp = ((e:any)=> {
formData.value.client_phone = e.target.value
})


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

let removePhoneMask:any = null;
onMounted(() => {
  const maskStart = 3;
  const maskValue = "+7(___)___-__-__";
  const maskSymbols = [")", "(", "-"];
  const maskHover = true;

  removePhoneMask =  inputMask(maskStart, maskValue, maskSymbols, refInput.value, maskHover);
});

onBeforeUnmount(()=> {
  removePhoneMask ();
})
</script>
<template>
  <form @submit.prevent="emitCreateProject" class="form-create-project">
    <div class="form-create-project__field">
      <label class="form-create-project__label" for="client"
        >Клиент <span class="required-asterisk" aria-hidden="true">*</span></label
      >
      <input
        maxlength="50"
        v-model="formData.client"
        id="client"
        type="text"
        pattern="^[\p{L}\p{N}\- ]{1,50}$"
        title="Можно использовать буквы, цифры, пробелы и тире (макс. 50 символов)"
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
        autocomplete="off"
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
  display: grid;
  gap: 15px;
  width: 100%;
  padding: 15px 25px;


  &__field {
    display: grid;
    gap: 8px;
  }

  &__label {
    color: var(--color-light-50);
    font-size: 14px;
    letter-spacing: var(--letter-spacing);
  }

  &__input {
    height: 35px;
    padding-left: 10px;
    font-size: 14px;
    background-color: rgba(179, 156, 137, 0.816);
    border: solid 1px transparent;
    color: var(--color-light-50);
    outline: none;
    border-radius: var(--radius-sm);
    opacity: 0.7;
    transition: border 0.3s;

    &::placeholder {
      color: var(--color-light-50);
      opacity: 0.7;
    }

    &:focus {
      opacity: 1;
      border: solid 1px var(--color-light-50);
    }
  
  }

  &__button {
    position: relative;
    z-index: 1;
    height: 40px;
    background-color: red;
    border: none;
    border-radius: var(--radius-input);
    box-shadow: 0 0 20px rgba(219, 64, 64, 0.687);
    font-weight: 700;
    text-transform: uppercase;
    color: var(--color-light-50);
    letter-spacing: 0.079em;
    transition: color var(--timing-animation-min);
    cursor: pointer;
    overflow: hidden;
    @media (hover: hover) {
      &:hover {
        color: black;
        box-shadow: 0 0 20px rgb(255, 255, 255);
     
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
      z-index: -1;
      width: 0;
      height: 100%;
      border-radius: var(--radius-min-v1);
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
  }
}

input:-webkit-autofill {
    -webkit-box-shadow:0 0 0 500px rgba(179, 156, 137, 0.816) inset;
    -webkit-text-fill-color: var(--color-light-50);;
}
</style>
