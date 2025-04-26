<script setup lang="ts">

export type Room = {
  name: string;
  img: string;
};

type PropsRoomsPanel = {
  rooms: Room[];
  activeRoom?: string
}

const props = defineProps<PropsRoomsPanel>()


const emit = defineEmits(['click-room']);

const emitClickInTheRoom = ((room: Room) => {
  emit('click-room', room)
})

</script>
<template>
  <div class="rooms">
    <div class="rooms__title">Rooms</div>
    <div class="rooms__container">
      <div v-for="room in rooms" class="room" :key="room.name">
        <button @click="emitClickInTheRoom(room)" aria-label="кнопка выбора комнаты" class="room__button"
          :class="{ 'room__button--active': props.activeRoom === '' }">
          <img :src="`/images/min-${room.img}`" :alt="room.name" />
        </button>
        <div class="room__title">
          {{ room.name }}
        </div>

      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rooms {
  text-align: center;

  &__title {
    margin-bottom: 50px;
    font-size: 40px;
    @media (max-width: 750px)  {
      font-size: 30px;
      margin-bottom: 20px;
    }
    @media (max-width: 380px){
      font-size: 24px;
    }
  }

  &__container {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
   
    gap: 40px;
    @media (max-width: 750px) {
      grid-template-columns:1fr 1fr;
      gap: 20px;
    }
    @media (max-width: 550px){
      gap: 15px;
    }
  }
}

.room {
  &__title {
    font-size: 20px;
    font-weight: 700;
    text-decoration: gray underline solid;
    @media (max-width: 380px){
      font-size: 16px;
    }
    @media (hover:hover) {
      transition: color .5s ease-out, text-decoration .5s ease-in;
    }
  }

  &__button {
    width: 200px;
    height: 100px;
    border: none;
    margin-bottom: 10px;
    background-color: transparent;
    opacity: .4;
    cursor: pointer;
    & img {
      width: 100%;
      height: 100%;
    }

    @media (max-width: 550px){
      width: 150px;
      height: 75px;
    }

    @media (max-width: 380px){
      width: 100px;
      height:50px;
    }
    @media (hover:hover) {
      transition: all 1s;

      &:hover {
        opacity: 8;
      }

      &:hover+.room__title {
        color: gray;
        text-decoration: rgb(255, 255, 255) underline solid;
      }
    }

    &--active {
      opacity: 1;
      outline: solid white 2px;
      pointer-events: none;
    }
  }
}
</style>
