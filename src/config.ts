import { GapiConfig, DBConfig } from './interfaces'

export const gapi: GapiConfig = {
  clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID || '',
  discoveryDocs: [
    'https://content.googleapis.com/discovery/v1/apis/drive/v3/rest'
  ],
  scope: [
    'https://www.googleapis.com/auth/drive.readonly'
  ]
}

export const db: DBConfig = {
  dbName: 'gdrive',
  version: 1
}
