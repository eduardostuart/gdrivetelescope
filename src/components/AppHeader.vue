<script lang="ts">
import Vue, { PropType } from 'vue'
import { User } from '@/interfaces'

export default Vue.extend({
  name: 'AppHeader',
  props: {
    user: Object as PropType<User>
  }
})
</script>

<template>
  <header class="app-header">
    <h1 class="app-header__logo">🔭 g.drive telescope</h1>
    <a href="#" class="app-header__user" @click.prevent="$emit('disconnect')">
      <img :src="user.photoUrl" class="app-header__user-photo" />
      <span class="app-header__user-disconnect">disconnect</span>
    </a>
  </header>
</template>

<style lang="scss">
.app-header {
  @apply flex flex-row items-center bg-white px-6 py-2 shadow;

  &__logo {
    @apply font-body font-bold;
  }

  &__user {
    @apply px-2 py-2 rounded-md bg-gray-200 text-gray-800 ml-auto;

    &:hover,
    &:active {
      @apply bg-gray-300 text-gray-900;
    }
  }

  &__user-photo {
    width: 24px;
    height: 24px;
    @apply rounded-full inline-block mr-1;
  }
}
</style>
