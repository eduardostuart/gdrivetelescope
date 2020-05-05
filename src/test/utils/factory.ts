/* eslint-disable @typescript-eslint/no-explicit-any */

import * as faker from 'faker'
import { DriveFile } from '@/interfaces'

export const factoryFile = (data: any = {}): DriveFile => {
  return {
    id: faker.random.uuid(),
    name: faker.system.fileName(),
    size: faker.random.number(),
    mimeType: faker.system.mimeType(),
    md5Checksum: 'blabla',
    parents: [],
    ...data
  }
}

export const factoryFiles = (quantity = 1, data: any = {}): Array<DriveFile> => {
  const items: Array<DriveFile> = []
  for (let i = 0; i < quantity; i++) {
    items.push(factoryFile(data))
  }
  return items
}
