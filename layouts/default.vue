<script setup lang='ts'>

const router = useRouter();



</script>
<template>
  <div class="wrapper-page">
    <SectionsHeader/>

    

    <main class="main">
      <slot></slot>
    </main>
    <footer style="color: wheat; font-size: 30px;">
      <h1>footer</h1>
    </footer>
  </div>
</template>


<style lang="scss" scoped>
.wrapper-page {
  display: flex;
  flex-direction: column;
  background-image: url('/images/bg-3.jpg');
  height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: var(--main-color);
  overflow-y: auto;
  overflow-x: auto;
}



.main {
  flex-grow: 1;
  max-width: 1920px;
  width: 100%;
  margin-right: auto;
  margin-left: auto;
}


</style>