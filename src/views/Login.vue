<script>
import Vue from 'vue'
import FormButton from '@/components/FormButton.vue'

export default Vue.extend({
  name: 'Login',
  components: {
    FormButton
  },
  data () {
    return {
      user: undefined
    }
  },
  methods: {
    async login () {
      await this.$gapi.auth().signIn()
      this.$router.replace({ name: 'sync' })
    }
  }
})
</script>

<template>
  <div class="login">
    <form-button class="login__button" @click.prevent="login">
      connect to google
    </form-button>
  </div>
</template>

<style lang="scss">
  .login {
    @apply w-full h-full flex items-center justify-center;
  }
</style>
