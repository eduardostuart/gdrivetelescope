/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/no-var-requires */
import { MergeUpdate, DriveFile as DriveFileInterface } from './interfaces'
import { FILE_TYPE_FOLDER } from './db/models/DriveFile'
import { factoryFile, factoryFiles } from '@/test/utils/factory'

describe('SyncLocal', () => {
  beforeEach(() => {
    jest.resetModules()
  })

  test('Should merge data locally and get current status', () => {
    const { SyncLocal } = require('@/SyncLocal')

    const items = factoryFiles(5, { size: 2 })
    const update: MergeUpdate = new SyncLocal().merge(items)
    expect(update.totalFiles).toEqual(5)
    expect(update.totalSize).toEqual(10)
  })

  test('Should return a tree of files', async () => {
    const items: Array<DriveFileInterface> = [
      factoryFile({ size: 0, parents: ['root'], name: 'folder x', id: 'x', mimeType: FILE_TYPE_FOLDER }),
      factoryFile({ size: 0, parents: ['x'], name: 'folder y', id: 'y', mimeType: FILE_TYPE_FOLDER }),
      factoryFile({ size: 0, parents: ['y'], name: 'folder o', id: 'o', mimeType: FILE_TYPE_FOLDER }),
      factoryFile({ size: 1, parents: ['root'], name: 'file-b', id: 'b', mimeType: 'image/jpeg' }),
      factoryFile({ size: 1, parents: ['x'], name: 'file-a', id: 'a', mimeType: 'image/jpeg' }),
      factoryFile({ size: 1, parents: ['x'], name: 'file-z', id: 'z', mimeType: 'application/pdf' }),
      factoryFile({ size: 1, parents: ['y'], name: 'file-k', id: 'k', mimeType: 'application/pdf' }),
      factoryFile({ size: 1, parents: ['o'], name: 'file i', id: 'i', mimeType: 'video/mp4' })
    ]

    jest.doMock('@/db/models/DriveFile', jest.fn().mockImplementation(() => {
      return {
        FILE_TYPE_FOLDER: 'application/vnd.google-apps.folder',
        all () {
          return items
        }
      }
    }))

    const { SyncLocal } = require('@/SyncLocal')
    const tree = await new SyncLocal().buildTree('root')

    expect(tree.id).toEqual('root')
    expect(tree.totalFiles).toEqual(5)
    expect(tree.size).toEqual(5)
    expect(tree.mimeType).toEqual('application/vnd.google-apps.folder')
    expect(tree.content.length).toEqual(2)
    expect(tree.totalPerType).toEqual({
      'video/mp4': 1,
      'image/jpeg': 2,
      'application/pdf': 2
    })

    const x = tree.content.find((f: DriveFileInterface) => f.mimeType === FILE_TYPE_FOLDER)
    const b = tree.content.find((f: DriveFileInterface) => f.mimeType !== FILE_TYPE_FOLDER)
    expect(x.name).toEqual('folder x')
    expect(x.size).toEqual(4)
    expect(x.totalFiles).toEqual(4)
    expect(b.name).toEqual('file-b')
    expect(x.totalPerType).toEqual({
      'video/mp4': 1,
      'image/jpeg': 1,
      'application/pdf': 2
    })

    const y = x.content.find(({ id }: DriveFileInterface) => id === 'y')
    expect(y).not.toBeUndefined()
    expect(y.size).toEqual(2)
    expect(y.totalFiles).toEqual(2)
    expect(y.totalPerType).toEqual({
      'application/pdf': 1,
      'video/mp4': 1
    })

    expect(x.content.find(({ id }: DriveFileInterface) => id === 'a')).not.toBeUndefined()
    expect(x.content.find(({ id }: DriveFileInterface) => id === 'z')).not.toBeUndefined()
    expect(y.content.find(({ id }: DriveFileInterface) => id === 'k')).not.toBeUndefined()

    const o = y.content.find(({ id }: DriveFileInterface) => id === 'o')
    expect(o.totalPerType).toEqual({
      'video/mp4': 1
    })
  })
})
