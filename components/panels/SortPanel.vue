<script lang="ts" setup>

const sort = ref('');
const emit = defineEmits(['sort-select'])

const emitEvent = () => {
  const sortData = sort.value ? sort.value : 'default:default'
  
  emit('sort-select', sortData);
}

</script>
<template>

  <div class="panel-sort">
    <select class="panel-sort__select" @change="emitEvent" v-model="sort">
      <option class="panel-sort__option panel-sort__option--not-sort" value="">Без сортировки</option>
      <option class="panel-sort__option" value="price:desc">Цена: по убыванию</option>
      <option class="panel-sort__option" value="price:asc">Цена: по возрастанию</option>
      <option class="panel-sort__option" value="deadline:desc">Дедлайн: сначала поздние</option>
      <option class="panel-sort__option" value="deadline:asc">Дедлайн: сначала ближайшие</option>
    </select>
  </div>

</template>


<style lang="scss" scoped>

.panel-sort {
  display: flex;
  gap: 20px;

  height: 30px;
  justify-content: space-between;

  &__select {
    width: 100%;
    padding-left: 10px;
    background-color: rgba(255, 255, 255, 0.9);
   
    color: var(--main-color);
    font-weight: 600;
    letter-spacing: .05em;
    border: none;
    outline: none;

  }
  // SelectSort.vue
  &__option {
    background-color: black;
    color: white;
    font-weight: 700;
    &--not-sort {
      color: black;
      background-color: rgb(246, 246, 246);
    }
  }




}
</style>