<script lang="ts">
import Vue from 'vue'
import Loading from '@/components/Loading.vue'
import FormButton from '@/components/FormButton.vue'
import { prettySize } from '@/utils'
import { MergeUpdate } from '../interfaces'
import { settings } from '@/db/models'

enum STATUS {
  IDLE = 'idle',
  COMPLETED = 'completed',
  SAVING = 'saving',
  CANCELLED = 'cancelled',
  SYNCING = 'syncing',
  SAVING_ERROR = 'saving-error'
}

export default Vue.extend({
  name: 'DriveSync',
  data () {
    return {
      status: STATUS.IDLE as STATUS,
      totalSize: 0,
      totalFiles: 0
    }
  },
  components: {
    Loading,
    FormButton
  },
  computed: {
    saving (): boolean {
      return this.status === STATUS.SAVING.valueOf()
    },
    idle (): boolean {
      return this.status === STATUS.IDLE.valueOf()
    },
    syncing (): boolean {
      return this.status === STATUS.SYNCING.valueOf()
    },
    completed (): boolean {
      return this.status === STATUS.COMPLETED.valueOf()
    }
  },
  watch: {
    async status (value: STATUS) {
      if (value.valueOf() === STATUS.COMPLETED) {
        await this.onSyncComplete()
      }
    }
  },
  async mounted () {
    await this.updateRootFolderId()
  },
  methods: {
    prettySize,
    stop () {
      this.status = STATUS.CANCELLED
    },
    async updateRootFolderId () {
      const rootFolderId = await this.$gapi.drive().getRootFolderId()
      return settings.set({ rootFolderId })
    },
    async onSyncComplete () {
      await settings.set({ lastSyncAt: new Date() })
      this.$router.go({ name: 'tree' })
    },
    async sync () {
      this.status = STATUS.SYNCING

      await this.listAllDriveFiles()

      if (this.status === STATUS.CANCELLED.valueOf()) {
        return
      }

      this.status = STATUS.SAVING
      const saved = await this.$driveWorker.save()

      if (saved) {
        this.status = STATUS.COMPLETED
      } else {
        this.status = STATUS.SAVING_ERROR
      }
    },
    async listAllDriveFiles () {
      let result = await this.$gapi.drive().list({ pageSize: 1000 })
      let pageToken = result.nextPageToken
      this.updateLocalFiles(result.files)

      while (pageToken) {
        if (this.status === STATUS.CANCELLED.valueOf()) {
          console.warn('cancelled')
          return
        }
        result = await this.$gapi.drive().list({ pageSize: 1000, pageToken })
        this.updateLocalFiles(result.files)
        pageToken = result.nextPageToken
      }
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async updateLocalFiles (newFiles: any) {
      const update: MergeUpdate = await this.$driveWorker.merge(newFiles)
      this.totalSize = update.totalSize
      this.totalFiles = update.totalFiles
    }
  }
})
</script>

<template>
  <div class="drive-sync" :class="[`drive-sync--${status}`]">
    <div class="drive-sync__container">
      <form-button class="drive-sync__btn" @click.prevent="sync" v-if="idle">
        START
      </form-button>

      <div class="drive-sync__body" v-if="!idle">

        <div class="drive-syncing" v-if="syncing">
          <div class="drive-syncing__body">
            <div class="drive-syncing__body-info">
              <loading class="drive-syncing__loading" />
              <p>{{ totalFiles }} files</p>
              <p>{{ prettySize(totalSize) }}</p>
            </div>
            <div class="drive-syncing__body-stop">
              <form-button @click.prevent="stop" theme="pink-outline" size="xs">stop</form-button>
            </div>
          </div>
          <div class="drive-syncing__warning">
            This might take a few minutes
            <svg xmlns="http://www.w3.org/2000/svg" class="ml-auto text-white fill-current" height="16" viewBox="0 0 24 24" width="16">
              <path d="M0 0h24v24H0V0z" fill="none"/>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1zm1-8h-2V7h2v2z"/>
            </svg>
          </div>
        </div>

        <div class="drive-sync__body drive-sync__body--saving" v-if="saving || completed">
          <loading /> <span v-if="saving">Saving...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.drive-sync {
  @apply w-full h-full overflow-hidden flex items-center justify-center;

  &__container {
    width: 120px;
    @apply relative ease-in-out duration-300 transition-shadow flex flex-col;
  }

  &--syncing {
    .drive-sync__container {
      width: 280px;
    }
  }

  &--saving {
    .drive-sync__container {
      width: 200px;;
    }
  }

  &__body {
    box-shadow: 4px 4px 0px 1px rgba(0,0,0,0.55);
    @apply bg-black text-white font-semibold transition-all ease-in-out duration-300 w-full h-full flex items-center justify-center flex-row;

    &--saving {
      @apply p-4;

      > svg {
        width: 65px;
        height: 32px;
      }
    }
  }

  &__info {
    @apply flex flex-col flex-1 pl-4;
  }

  &__info-loading {
    width: 36px;
    height: 26px;
  }

  &__footer {
    height: 36px;
    @apply w-full flex-none hidden items-center flex-row px-4 border-t border-gray-200 bg-indigo-200 rounded-b-md text-sm text-black;
  }

  &__footer-info {
      width: 16px;
      height: 16px;
      @apply fill-current text-black ml-auto flex-none;
    }
}

.drive-syncing {
  @apply w-full;

  &__loading {
    width: 40px;
    height: 24px;
    @apply text-white;
  }

  &__warning {
    @apply py-1 px-4 text-xs text-gray-600 bg-gray-900 font-semibold flex flex-row items-center;
  }

  &__body {
    @apply p-4 flex flex-row items-center;
  }

  &__body-info {
    flex-basis: 80%;
  }
  &__body-stop {
    flex-basis: 20%;
  }
}
</style>
