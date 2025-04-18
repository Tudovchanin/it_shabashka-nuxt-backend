<script lang="ts" setup>

const currentYear = ref(new Date().getFullYear());
</script>
<template>
  <div class="footer-content">
    <a 
      href="mailto:contact@it-shabashka.ru" 
      class="footer-content__email"
    >
      sotto36623@yandex.ru
    </a>

    <p class="footer-content__copyright">© {{ currentYear }} IT_Shabashka | Powered by <a style="font-weight: 700;" href="https://appwrite.io" target="_blank">Appwrite</a></p>
  </div>
</template>


<style lang="scss" scoped>

.footer-content {

  &__email {
    display: block;
    opacity: .7;
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 10px;
    @media(hover:hover) {
      transition: opacity var(--timing-animation-min);
      &:hover {
        opacity: 1;
      }
    }
    @media (max-width: 430px) {
      font-size: 14px;
    }
  }

  &__copyright {
    font-size: 14px;
    font-weight: 300;
    opacity: .7;
    @media (max-width: 430px) {
      font-size: 12px;
    }
  }
}
</style>