import Dexie from 'dexie'
import { DriveFile as DriveFileInterface } from '@/interfaces'
import db from '..'

export const FILE_TYPE_FOLDER = 'application/vnd.google-apps.folder'

export class DriveFile {
  private table: Dexie.Table<DriveFileInterface, string>

  constructor (table: Dexie.Table<DriveFileInterface, string>) {
    this.table = table
  }

  async all (): Promise<DriveFileInterface[]> {
    return this.table.toArray()
  }

  async clear (): Promise<void> {
    this.table.clear()
  }

  async folders (): Promise<DriveFileInterface[]> {
    return this.table.where({ mimeType: FILE_TYPE_FOLDER }).toArray()
  }

  async byParent (parent: DriveFileInterface): Promise<DriveFileInterface[]> {
    return this.table.where({ parents: parent.id }).toArray()
  }

  async addItems (items: DriveFileInterface[]): Promise<string> {
    return this.table.bulkAdd(items)
  }
}

export default new DriveFile(db.files)
