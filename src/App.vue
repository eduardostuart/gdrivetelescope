<script lang="ts">
import Vue from 'vue'
import { User } from '@/interfaces'
import AppHeader from '@/components/AppHeader.vue'
import Loading from '@/components/Loading.vue'
import { settings, driveFile } from '@/db/models'

export default Vue.extend({
  name: 'App',
  components: {
    AppHeader,
    Loading
  },
  data () {
    return {
      loading: false as boolean,
      user: undefined as (User | undefined)
    }
  },
  mounted () {
    this.user = this.$gapi.auth().user()
    this.$gapi.auth().listen(this.onUserChange.bind(this))
  },
  methods: {
    onUserChange (user?: User) {
      this.user = user
    },
    async disconnect () {
      this.loading = true

      try {
        if (this.$gapi.auth().isAuthenticated()) {
          this.$gapi.auth().signOut()
        }
      } catch (e) {
        console.log(e)
      }

      try {
        await Promise.all([
          settings.clear(),
          driveFile.clear()
        ])
      } catch (e) {
        console.error(e)
      }

      this.loading = false

      this.$router.replace({ name: 'login' })
    }
  }
})
</script>

<template>
  <div class="main-container">

    <app-header
      v-if="false"
      :user="user"
      @disconnect="disconnect"
      class="main-container__header"
    />

    <div class="main-container__body" :class="{'main-container__body--loading': loading}">
      <router-view v-if="!loading" />
      <loading v-if="loading" />
    </div>

  </div>
</template>

<style lang="scss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  html, body, #app {
    @apply w-full h-full overflow-hidden;
  }

  body {
    @apply font-body bg-pink-500;
    background: linear-gradient(135deg, theme('colors.pink.500') 0%, theme('colors.pink.700') 27%, theme('colors.purple.800') 100%);
  }

  #app {
    @apply flex items-center justify-center;
  }

.main-container {
  @apply w-full h-full flex flex-col;

  &__body {
    @apply w-full h-full overflow-hidden;

    &--loading {
      @apply flex items-center justify-center;

      svg {
        width: 200px;
        height: 100px;
      }
    }
  }

  &__header {
    @apply flex-none;
  }
}
</style>
