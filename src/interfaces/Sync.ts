/* eslint-disable @typescript-eslint/no-explicit-any */

import { DriveFile } from './DriveFile'

export interface MergeUpdate {
  totalFiles: number;
  totalSize: number;
}

export interface DriveFileNode extends DriveFile {
  content?: Array<DriveFileNode>;
  totalFiles?: number;
  totalPerType?: DriveMetaMimeType;
}

export interface TreeRootMetaInfo {
  filesByType: { [key: string]: number };
  repeatedFiles?: { [key: string]: number };
}

export type DriveTree = DriveFileNode

export interface DriveMetaMimeType {
  [mimeType: string]: number;
}

export interface DriveMeta {
  size: number;
  files: number;
  perType: DriveMetaMimeType;
}

export interface DriveSyncWorker {
  localFiles: Array<any>;
  localTotalSize: number;
  localTotalFiles: number;
  save(): Promise<boolean>;
  merge(newFiles: any): MergeUpdate;
  updateTreeNodeSizes(treeNode: DriveFileNode, meta: DriveMeta): DriveMeta;
  buildTree(rootFolderId: string): Promise<DriveTree>;
}
