<script setup lang='ts'>
type UserInfo = {
  title?: string;
  avatar?: string;
  user_name?: string;
  user_email?: string;
}

const props = defineProps<UserInfo>()

</script>
<template>

  <div class="user-info">
    <div v-if="props.title" class="user-info__title">{{ props.title }}</div>
    <div v-if="props.avatar" class="user-info__avatar">
      <img :src="`${props.avatar}`" alt="автар" />
    </div>
    <div class="header-aside__user-info">
      <div v-if="props.user_name" class="user-info__user-info-name">{{ props.user_name }}</div>
      <div v-if="props.user_email" class="user-info__user-info-email">{{ props.user_email }}</div>
    </div>

  </div>


</template>


<style lang="scss" scoped>
.user-info {
  display: grid;
  grid-template-columns: 40px 1fr;
  gap: 10px;
  width: 100%;



  &__title {
    grid-column: 1/-1;
  }

  &__avatar {
    width: 40px;
    height: 40px;
    border-radius: 100%;
    overflow: hidden;
    & img {
      object-fit: cover;
    }
  }

  &__user-info {
    align-self: center;
  }

  &__user-info-email,
  &__user-info-name {
    width: 100%;
    padding-right: 60px;
    max-width: 350px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__user-info-name {

    font-size: 14px;
    line-height: 1.4;
    color: rgb(23, 43, 77);

  }

  &__user-info-email {
    font-size: 12px;
    color: rgb(68, 84, 111);
    letter-spacing: .04em;
  }

}
</style>