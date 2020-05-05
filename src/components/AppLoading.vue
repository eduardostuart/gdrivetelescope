<script>
import Vue from 'vue'
import Loading from './Loading.vue'

export default Vue.extend({
  name: 'AppLoading',
  components: {
    Loading
  }
})
</script>

<template>
  <div class="app-loading">
    <loading />
  </div>
</template>

<style lang="scss">
  .app-loading {
    @apply w-full h-full flex items-center justify-center;
  }
</style>
