<template>
  <div  style="height: 70px; overflow: hidden;" id="radiobells_container">
    <a  href="https://www.radiobells.com/" id="RP_link">Онлайн радио</a> 
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  // Задаём глобальные переменные, т.к. внешний скрипт их требует
  window.rad_backcolor = "#00000000"
  window.rad_logo = "#00000000"
  window.rad_autoplay = false
  window.rad_width = "fixed"
  window.rad_width_px = 180
  window.rad_stations = [
    ['https://ep256.hostingradio.ru:8052/europaplus256.mp3','Европа плюс','europaplus'],
    ['https://radiorecord.hostingradio.ru/rr_main96.aacp','Радио Рекорд','radiorecord'],
    ['https://nashe1.hostingradio.ru/nashe-256','Наше радио','nashe'],
    ['https://pub0101.101.ru/stream/air/aac/64/100','Авторадио','avtoradio'],
    ['https://pub0202.101.ru:8443/stream/air/aac/64/99','Радио Energy','nrj'],
    ['https://radiopotok2.online/http://online.kissfm.ua/KissFM_HD','Kiss FM','kissfm']
  ];


  // Динамически подключаем скрипт плеера
  const script = document.createElement('script')
  script.src = 'https://www.radiobells.com/script/v2_1.js'
  script.async = true
  document.body.appendChild(script)
})
</script>


<style>
@import url('https://www.radiobells.com/script/style.css');
#radiobells_container {
 border: solid #00000000;
}
#rad_player{
  width: 100% !important;
}

#rad_select_main_text {
  color: aliceblue;
}

#rad_play_btn {
  border: solid 2px rgb(238, 238, 238);
  border-radius: 50%;
}

#rad_dropdown {
  color: aliceblue;
}

#rad_stationname {
  width: 100px !important;
}
</style>
