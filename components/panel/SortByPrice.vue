<script lang="ts" setup>




const sort = ref('');
const emit = defineEmits(['sort-select'])

const emitEvent = () => {
  const sortData = sort.value ? sort.value : 'default:default'
  console.log(sortData,'emitEvent');
  
  emit('sort-select', sortData);
}

// const handleClick = () => {
//   resetSort();
//   emitEvent();
// }



function resetSort() {
  sort.value = '';
}





</script>
<template>

  <div class="panel-sort">
    <select class="panel-sort__select" @change="emitEvent" v-model="sort">
      <option class="panel-sort__option" value="">Без сортировки</option>
      <option class="panel-sort__option" value="price:desc">Цена: от высокой к низкой</option>
      <option class="panel-sort__option" value="price:asc">Цена: от низкой к высокой</option>
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

  // background-color: rgba(255, 0, 0, 0.399);
  &__select {
    width: 100%;
    padding-left: 10px;
    background-color: var(--color-light-50);
    background: -webkit-linear-gradient(90deg, #bdbdbd, #dedede, #ffffff);
    background: linear-gradient(90deg, #bdbdbd, #dedede, #ffffff);
    color: var(--main-color);
    font-weight: 600;
    letter-spacing: .05em;
    border: none;
    outline: none;
  }

  &__option {
    background-color: black;
    color: white;
    font-weight: 700;
  }




}
</style>