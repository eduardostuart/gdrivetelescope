import Vue from 'vue'
import Gapi from '@/gapi'
import { Remote } from 'comlink'
import { DriveSyncWorker } from '@/interfaces'

declare module 'vue/types/vue' {
  interface Vue {
    $gapi: Gapi;
    $driveWorker: Remote<DriveSyncWorker>;
  }

  interface VueConstructor {
    Gapi: Gapi;
  }
}
