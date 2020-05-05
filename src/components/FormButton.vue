<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'FormButton',
  inheritAttrs: false,
  props: {
    theme: {
      type: String,
      default: undefined
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'button'
    },
    size: {
      type: String,
      default: 'base'
    }
  },
  computed: {
    themeClasses () {
      if (this.theme) {
        return [`btn--${this.theme}`]
      }
      return []
    },
    htmlType () {
      if (this.component === 'button') {
        return this.type
      }
      return ''
    },
    tabIndex () {
      if (this.loading || this.disabled) {
        return '-1'
      }

      return '0'
    },
    component () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const attrs = this.$attrs as any
      if (attrs.to) {
        return 'router-link'
      }
      if (attrs.href) {
        return 'a'
      }
      return 'button'
    }
  },
  methods: {
    handleClick (event: Event) {
      this.$emit('click', event)
    }
  }
})
</script>

<template>
  <component
    :is="component"
    v-bind="$attrs"
    class="btn"
    :type="htmlType"
    :disabled="disabled || loading"
    :tabindex="tabIndex"
    :class="[
      ...themeClasses,
      [`btn--${size}`],
      {
        'btn--disabled': disabled,
        'btn--loading': loading,
      }
    ]"
    role="button"
    @click.capture="handleClick"
  >
    <span class="btn__content-text">
      <slot />
    </span>
  </component>
</template>

<style lang="scss">
  .btn {
    box-shadow: 4px 4px 0px 1px rgba(0,0,0,0.55);
    @apply relative transition-all duration-300 ease-in-out inline-flex flex-row items-center justify-center py-2 px-6 bg-black text-white cursor-pointer;

    &__content-text {
      @apply text-white font-bold uppercase text-base;
    }

    &:hover,
    &:focus {
      box-shadow: 2px 2px 0px 1px rgba(0,0,0,0.55);
    }

    &--pink-outline {
      @apply bg-transparent border-2 rounded border-pink-700;

      .btn__content-text {
        @apply text-pink-700;
      }

      &:hover,
      &:focus {
        @apply border-pink-600;

        .btn__content-text  {
          @apply text-pink-600;
        }
      }
    }

    &--xs {
      @apply py-1 px-3;
    }
  }
</style>
