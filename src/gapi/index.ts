/* eslint-disable @typescript-eslint/no-explicit-any */
import { GapiConfig } from '@/interfaces'
import Auth from './Auth'
import Drive from './Drive'

export default class Gapi {
  private config: GapiConfig;

  // window.gapi instance
  private gapi: any;

  constructor (config: GapiConfig) {
    this.config = config
  }

  private loadScript (): Promise<void> {
    if (!document.getElementById('gapi')) {
      const script: HTMLElement = document.createElement('SCRIPT')
      script.setAttribute('src', 'https://apis.google.com/js/api:client.js?onload=onGapiLoad')
      script.setAttribute('async', '')
      script.setAttribute('id', 'gapi')
      script.setAttribute('defer', '')
      document.head.appendChild(script)
    }

    return new Promise((resolve) => {
      window.onGapiLoad = () => resolve(window.gapi)
    })
  }

  async init (): Promise<void> {
    try {
      this.gapi = await this.loadScript()
    } catch (e) {
      throw new Error('Error while loading google api')
    }

    const scope = Array.isArray(this.config.scope)
      ? this.config.scope.join(' ')
      : this.config.scope

    const config = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      client_id: this.config.clientId,
      discoveryDocs: this.config.discoveryDocs,
      scope
    }

    return new Promise((resolve, reject) => {
      this.gapi.load('auth2', () => {
        this.gapi.auth2.init(config).then(() => { /* load drive */
          this.gapi.client.load('drive', 'v3').then(resolve, reject)
        }, reject)
      })
    })
  }

  client () {
    return this.gapi.client
  }

  auth () {
    return new Auth(this.gapi.auth2)
  }

  drive () {
    return new Drive(this.gapi.client.drive)
  }
}
