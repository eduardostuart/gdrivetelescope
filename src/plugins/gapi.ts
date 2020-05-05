import _Vue from 'vue'
import { GapiConfig } from '@/interfaces/Gapi'
import Gapi from '@/gapi'

export default function install (Vue: typeof _Vue, options: GapiConfig) {
  const gapiInstance = new Gapi(options)
  Vue.prototype.$gapi = gapiInstance
  Vue.Gapi = gapiInstance
}
