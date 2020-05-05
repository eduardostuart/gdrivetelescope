export interface DriveFile {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  md5Checksum?: string;
  parents?: Array<string>;
}
