import {
  MergeUpdate,
  DriveSyncWorker,
  DriveFile as DriveFileInterface,
  DriveMeta,
  DriveFileNode,
  DriveTree,
  DriveMetaMimeType
} from './interfaces'
import driveFile, { FILE_TYPE_FOLDER } from '@/db/models/DriveFile'

const isFolder = (mimeType: string) => mimeType === FILE_TYPE_FOLDER
const isFile = (mimeType: string) => mimeType !== FILE_TYPE_FOLDER

export class SyncLocal implements DriveSyncWorker {
  localFiles: any[]; // eslint-disable-line @typescript-eslint/no-explicit-any
  localTotalSize: number;
  localTotalFiles: number;

  constructor () {
    this.localFiles = []
    this.localTotalFiles = 0
    this.localTotalSize = 0
  }

  async save (): Promise<boolean> {
    try {
      await driveFile.addItems(this.localFiles)
      this.localFiles = []
      this.localTotalSize = 0
      this.localTotalFiles = 0
      return true
    } catch (e) {
      console.error(e.message)
      return false
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  merge (newItems: any): MergeUpdate {
    for (let i = 0; i < newItems.length; i++) {
      const item = newItems[i]

      if (isFile(item.mimeType)) {
        this.localTotalFiles++
      }

      // Normalize new item size
      const size = item.size && !isNaN(item.size) ? parseInt(item.size, 10) : 0

      this.localTotalSize += size
      newItems[i].size = size
    }

    // eslint-disable-next-line prefer-spread
    this.localFiles.push.apply(this.localFiles, newItems)

    return {
      totalFiles: this.localTotalFiles,
      totalSize: this.localTotalSize
    } as MergeUpdate
  }

  updateTreeNodeSizes (tree: DriveFileNode, meta: DriveMeta): DriveMeta {
    if (tree.content) {
      for (let i = 0; i < tree.content.length; i++) {
        const item: DriveFileNode = tree.content[i]

        if (isFolder(item.mimeType)) {
          const folder = this.updateTreeNodeSizes(tree.content[i], {
            size: 0,
            files: 0,
            perType: {} as DriveMetaMimeType
          })

          // Get only top 3 sizes
          const perType = Object.fromEntries(
            Object.entries(folder.perType).sort((a, b) => b[1] - a[1]).slice(0, 3)
          )

          tree.content[i].totalFiles = folder.files
          tree.content[i].size = folder.size
          tree.content[i].totalPerType = perType

          meta.size += folder.size
          meta.files += folder.files
          meta.perType = Object.assign({}, meta.perType, perType)
        } else if (isFile(item.mimeType)) {
          meta.files++
          meta.size += item.size

          if (!meta.perType[item.mimeType]) {
            meta.perType[item.mimeType] = 0
          }
          meta.perType[item.mimeType]++
        }
      }
    }

    return meta
  }

  async buildTree (rootFolderId: string): Promise<DriveTree> {
    const data: DriveFileInterface[] = await driveFile.all()

    const root: DriveFileInterface = {
      name: 'root',
      id: rootFolderId,
      mimeType: FILE_TYPE_FOLDER,
      size: 0
    }

    const tree: DriveTree = {
      id: root.id,
      name: root.name,
      mimeType: root.mimeType,
      size: root.size,
      totalFiles: 0,
      content: []
    }

    const contentOf: { [parentId: string]: Array<DriveFileInterface> } = {}

    for (let i = 0; i < data.length; i++) {
      // Ignorning items without parent.
      // All items from google drive should have a parent id
      if (!data[i].parents) {
        continue
      }

      const item: DriveFileNode = this.mapDriveFileIntoDriveFileNode(data[i])

      if (!contentOf[item.id]) {
        contentOf[item.id] = []
      }

      if (isFolder(item.mimeType)) {
        item.content = contentOf[item.id]
      }

      // If current item belongs to root folder, we
      // include it to the tree and jump to the next item
      if (item.parents?.includes(root.id) && tree.content) {
        tree.content.push(item)
        continue
      }

      // eslint-disable-next-line no-unused-expressions
      item.parents?.forEach((parentId: string) => {
        if (!contentOf[parentId]) {
          contentOf[parentId] = []
        }
        contentOf[parentId].push(item)
      })
    }

    const sizes = this.updateTreeNodeSizes(tree, { size: 0, files: 0, perType: {} })

    return {
      ...tree,
      size: sizes.size,
      totalFiles: sizes.files,
      totalPerType: sizes.perType
    }
  }

  private mapDriveFileIntoDriveFileNode (item: DriveFileInterface): DriveFileNode {
    const mapped = {
      ...item,
      id: item.id,
      name: item.name,
      mimeType: item.mimeType,
      size: item.size
    }

    if (!isFolder(item.mimeType)) {
      return mapped
    }

    return {
      ...mapped,
      totalFiles: 0,
      content: []
    }
  }
}

export default new SyncLocal()
