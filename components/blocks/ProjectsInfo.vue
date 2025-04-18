<script setup lang='ts'>

type ProjectsInfo = {
  number_of_projects?: number;
  ready_projects?: number;
  price_all_projects?: number;
  price_done_projects?: number;
}

const props = defineProps<ProjectsInfo>()
</script>
<template>

  <div class="projects-info">
    <div class="projects-info__title">Мои шабашки:</div>

    <div class="projects-info__field">
      <!-- <div class="projects-info__title">Готово</div> -->
      <div class="projects-info__content">
        <span class="projects-info__img" aria-hidden="true">
          <img src="/images/icon-done.png" alt="готово"></span>
        {{ props.ready_projects || 0 }} / {{ props.number_of_projects || 0 }}
      </div>
      <progress class="projects-info__progress" :value="props.ready_projects || 0"
        :max="props.number_of_projects || 0"></progress>
    </div>
    <div class="projects-info__field">
      <!-- <div class="projects-info__title">Общий колым</div> -->
      <div class="projects-info__content">
        <span class="projects-info__img" aria-hidden="true"><img src="/images/icons-ruble.png"
            alt="рубль"></span>
        {{ props.price_done_projects || 0 }} / {{ props.price_all_projects || 0 }} руб
      </div>
      <progress class="projects-info__progress" :class="{'projects-info__progress--red': (props.price_done_projects || 0) < (props.price_all_projects || 0)}" :value="props.price_done_projects || 0"
        :max="props.price_all_projects || 0"></progress>
    </div>



  </div>
</template>


<style lang="scss" scoped>
.projects-info {

  &__title {
    margin-bottom: 10px;
  }

  &__field {
    margin-bottom: 10px;
  }

  &__content {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 14px;
    
  }

  &__img {
    width: 25px;
    height: 25px;
  }

  &__progress {
    height: 7px;
    width: 100%;
    appearance: none;
    border-radius: 20px;
    overflow: hidden;

    &::-webkit-progress-bar {
      background: #cfcece;
    }

    &::-moz-progress-bar {
      background: rgb(0, 0, 0);
    }
    &::-webkit-progress-value {
      background: rgb(0, 0, 0);
    }

    &--red::-webkit-progress-value {
      background-color: rgb(0, 0, 0);
    }
  }


// progress::-webkit-progress-bar {
//   background: #cfcece;
// }

// progress::-webkit-progress-value {
//   background: rgb(0, 0, 0);
// }

// progress::-moz-progress-bar {
//   background: rgb(0, 0, 0);
// }


}
</style>