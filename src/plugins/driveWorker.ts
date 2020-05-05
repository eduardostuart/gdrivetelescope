import _Vue from 'vue'
import { wrap, Remote } from 'comlink'
import { DriveSyncWorker } from '@/interfaces'

export default function install (Vue: typeof _Vue) {
  const worker: Remote<DriveSyncWorker> = wrap(
    new Worker('@/Worker.ts', { type: 'module' })
  )

  Vue.prototype.$driveWorker = worker
}
