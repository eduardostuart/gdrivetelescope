import Dexie from 'dexie'
import { DriveFile, Settings, DBConfig } from '@/interfaces'
import { db as dbConfig } from '@/config'

export class DB extends Dexie {
  files: Dexie.Table<DriveFile, string>;
  settings: Dexie.Table<Settings, number>;

  constructor (config: DBConfig) {
    super(config.dbName)

    this.version(config.version).stores({
      settings: '++id,rootFolderId,lastSyncAt',
      files: 'id,md5Checksum,name,mimeType,*parents,size'
    })

    this.files = this.table('files')
    this.settings = this.table('settings')
  }
}

export default new DB(dbConfig)
