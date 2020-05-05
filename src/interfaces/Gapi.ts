export interface GoogleDriveListParams {
  pageSize: number;
  pageToken?: string;
  q?: string;
  fields?: Array<string>;
}

export interface GapiConfig {
  clientId: string;
  discoveryDocs: Array<string>;
  scope: string | Array<string>;
}
