<script lang="ts" setup>
</script>
<template>



  <div class="setting-panel">

    <div class="setting-panel__header">
      <slot name="header"></slot>
    </div>
    <div class="setting-panel__main">
      <slot  name="main"></slot>
    </div>
    <div class="setting-panel__footer">
      <slot name="footer"></slot>
    </div>

  </div>



</template>


<style lang="scss" scoped>

.setting-panel {
 display: flex;
 flex-direction: column;
 justify-content: space-between;
 gap: 20px;
  

&__header {
}

&__main {
}

&__footer {
}
}


</style>