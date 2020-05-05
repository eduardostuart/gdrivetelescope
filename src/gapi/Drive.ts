/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleDriveListParams } from '@/interfaces'

export default class Drive {
  private gDrive: any;

  constructor (gDrive: any) {
    this.gDrive = gDrive
  }

  async getRootFolderId (): Promise<string|undefined> {
    const { files } = await this.list({
      q: '"root" in parents and mimeType="application/vnd.google-apps.folder"',
      pageSize: 1
    })

    if (files && files.length > 0) {
      return files[0].parents && files[0].parents.length > 0
        ? files[0].parents[0]
        : undefined
    }

    return undefined
  }

  async list (params: GoogleDriveListParams): Promise<any> {
    const fields = params.fields ?? [
      'nextPageToken',
      'files(id,size,md5Checksum,name,mimeType,parents)'
    ]

    const { result } = await this.gDrive.files.list({
      pageToken: params.pageToken,
      orderBy: 'createdTime',
      pageSize: params.pageSize,
      fields: fields.join(','),
      q: params.q
    })

    return result
  }
}
