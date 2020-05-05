<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Loading'
})
</script>

<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 100 80" preserveAspectRatio="xMidYMid" display="block" class="loading">
    <path fill="none" stroke-width="6.4" stroke-dasharray="42.76482137044271 42.76482137044271" d="M19.44 24C9.12 24 4 34.64 4 40s5.12 16 15.44 16c15.44 0 25.68-32 41.12-32C70.88 24 76 34.64 76 40s-5.12 16-15.44 16c-15.44 0-25.68-32-41.12-32z" stroke-linecap="round" style="transform-origin:50px 50px">
      <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1.6949152542372878s" keyTimes="0;1" values="0;256.58892822265625"/>
    </path>
  </svg>
</template>

<style lang="scss">
  .loading {
    @apply text-white stroke-current;
    width: 80px;
  }
</style>
