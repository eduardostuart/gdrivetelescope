import './registerServiceWorker'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

import Vue from 'vue'
import VueVirtualScroller from 'vue-virtual-scroller'
import App from '@/App.vue'
import router from './router'
import { gapiPlugin, driveWorkerPlugin } from '@/plugins'
import { gapi as gapiConfig } from '@/config'

Vue.config.productionTip = false

Vue.use(VueVirtualScroller)
Vue.use(driveWorkerPlugin)
Vue.use(gapiPlugin, gapiConfig)

const mount = () => {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
}

Vue.Gapi.init().then(mount)
