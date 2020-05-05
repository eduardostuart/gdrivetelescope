import Dexie from 'dexie'
import { Settings as SettingsInterface } from '@/interfaces'
import db from '..'

export class Settings {
  private table: Dexie.Table<SettingsInterface, number>

  constructor (table: Dexie.Table<SettingsInterface, number>) {
    this.table = table
  }

  async get (): Promise<SettingsInterface | undefined> {
    return this.table.toCollection().first()
  }

  async clear (): Promise<void> {
    this.table.clear()
  }

  async synced (): Promise<boolean> {
    const data = await this.get()

    if (!data) {
      return false
    }

    return data.lastSyncAt !== undefined
  }

  async set (newValues: SettingsInterface): Promise<void> {
    const data: SettingsInterface | undefined = await this.get()

    if (data && data.id) {
      await this.table.update(data.id, newValues)
    } else {
      await this.table.add(newValues)
    }
  }
}

export default new Settings(db.settings)
