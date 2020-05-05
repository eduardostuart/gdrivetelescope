import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import { settings } from '@/db/models'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/Login.vue')
  },
  {
    path: '/',
    name: 'sync',
    component: () => import(/* webpackChunkName: "sync" */ '@/views/DriveSync.vue')
  },
  {
    path: '/tree/:id?',
    name: 'tree',
    component: () => import(/* webpackChunkName: "tree" */ '@/views/DriveTree.vue')
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach(async (to, from, next) => {
  const isAuthenticated = Vue.Gapi.auth().isAuthenticated()

  // Not authenticated
  if (to.name !== 'login' && !isAuthenticated) {
    return next({ name: 'login' })
  }

  // Check if lastSync date exists
  const isSynced = await settings.synced()

  // Is authenticated and trying to visit login page
  if (to.name === 'login' && isAuthenticated) {
    const name = isSynced ? 'tree' : 'sync'
    return next({ name })
  }

  // Is trying to visualize the tree but there's not data yet
  if (to.name === 'tree' && !isSynced) {
    return next({ name: 'sync' })
  }

  if (to.name === 'sync' && isSynced) {
    return next({ name: 'tree' })
  }

  next()
})

export default router
