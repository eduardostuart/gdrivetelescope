<script lang="ts">
import Vue from 'vue'
import Loading from '@/components/Loading.vue'
import { DriveFileNode, DriveTree, DriveFile as DriveFileInterface } from '@/interfaces'
import { settings } from '@/db/models'
import { prettySize } from '@/utils'
import { FILE_TYPE_FOLDER } from '@/db/models/DriveFile'

export default Vue.extend({
  name: 'DriveTree',
  components: {
    Loading
  },
  data () {
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      mimeTypes: {} as any,
      loading: false,
      selectedFolder: undefined as (undefined | DriveFileNode),
      path: {} as (undefined | {[key: string]: DriveFileNode }),
      tree: undefined as (undefined | DriveTree)
    }
  },
  computed: {
    breadcrumb (): Array<DriveFileNode> | undefined {
      if (this.selectedFolder && this.tree) {
        const breadcrumb: {[key: string]: string} = {}
        breadcrumb[this.tree.id] = this.tree.name
      }
      return undefined
    },
    selected (): Array<DriveFileInterface> {
      const data: Array<DriveFileNode> | undefined = this.selectedFolder
        ? this.selectedFolder.content
        : this.tree?.content

      if (!data) {
        return []
      }

      return data
        .slice(0)
        .sort((a: DriveFileInterface, b: DriveFileInterface) => b.size - a.size)
    }
  },
  watch: {
    $route (to) {
      if (
        to.params?.id &&
        this.path && this.path[to.params.id] &&
        this.selectedFolder?.id !== to.params.id
      ) {
        this.selectedFolder = this.path[to.params.id]
      } else if (!to.params.id && this.selectedFolder) {
        this.selectedFolder = undefined
        this.path = undefined
      }
    }
  },
  async mounted () {
    this.loading = true

    const data = await settings.get()

    if (data && data.rootFolderId) {
      this.tree = await this.$driveWorker.buildTree(data.rootFolderId)
    }

    this.loading = false
  },
  methods: {
    prettySize,
    isFolder: (mimeType: string) => mimeType === FILE_TYPE_FOLDER,
    onTreeItemSelect (item: DriveFileNode) {
      if (!item.content || item.content.length < 1) {
        return
      }

      if (!this.path) {
        this.path = {}
      }
      this.path[item.id] = item

      this.$router.push({ name: 'tree', params: { id: item.id } })

      this.selectedFolder = item
    }
  }
})
</script>

<template>
  <div class="drive-tree">
    <div class="drive-tree__files" v-if="!loading">
      <ul v-if="breadcrumb">
        <li v-for="(breadcrumbItem, index) in breadcrumb" :key="index">
          {{ breadcrumb.name }}
        </li>
      </ul>
      <RecycleScroller
        class="drive-tree__files-scroller"
        :items="selected"
        :item-size="70"
        key-field="id"
        v-slot="{ item }"
      >
        <div
          class="drive-item"
          :class="{
            'drive-item--has-content': (item.content && item.content.length > 0),
            'drive-item--folder': isFolder(item.mimeType)
          }"
          @click.prevent="onTreeItemSelect(item)"
        >

          <div class="drive-item__body">
            <div class="drive-item__body-name" :title="item.name">
              {{ item.name }}
            </div>
            <div class="drive-item__body-meta">
              <span v-if="item.totalFiles">
                {{ item.totalFiles }} files
              </span>
              <span v-if="item.totalFiles && item.size" class="mx-1">
                -
              </span>
              <span>{{ prettySize(item.size || 0) }}</span>
            </div>
          </div>
          <div class="drive-item__arrow">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
              <path d="M9.29 15.88L13.17 12 9.29 8.12a.996.996 0 1 1 1.41-1.41l4.59 4.59c.39.39.39 1.02 0 1.41L10.7 17.3a.996.996 0 0 1-1.41 0c-.38-.39-.39-1.03 0-1.42z"/>
            </svg>
          </div>
        </div>
    </RecycleScroller>
    </div>
    <div class="drive-tree__files-loading" v-if="loading">
      <loading />
    </div>
  </div>
</template>

<style lang="scss">
  .drive-tree {
    @apply w-full h-full box-border flex flex-row overflow-hidden;

    &__files {
      flex-basis: 30%;
      @apply w-full h-full overflow-y-auto p-2;
    }

    &__files-scroller {
      @apply h-full;
    }

    &__files-sidebar {
      @apply h-full overflow-y-auto;
    }

    &__files-loading {
      @apply w-full h-full flex items-center justify-center;

      svg {
        width: 200px;
        height: 100px;
      }
    }
  }

  .drive-item {
    height: 60px;
    @apply w-full flex flex-row items-center bg-gray-200 text-gray-800 mb-2 relative;

    &__body {
      flex-basis: 80%;
      @apply text-sm w-full;
    }

    &__body-name {
      @apply font-semibold truncate w-5/6 px-2;
    }

    &__body-meta {
      @apply px-2;
    }

    &__per-type {
      @apply flex flex-row absolute left-0 bottom-0 right-0 w-full;

      > div {
        content: ' ';
        height: 3px;
      }
    }

    &__arrow {
      flex-basis: 20%;
      @apply hidden items-center justify-end px-2;
    }

    &--has-content {
      &:hover,
      &:focus {
        @apply bg-gray-300 text-gray-900;
      }

      .drive-item__arrow {
        @apply flex;
      }
    }

    &--folder {
      @apply cursor-pointer;
    }

  }
</style>
