export interface DocumentModel {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  files: {
    downloadUrl: string;
    filePath: string;
  }[];
  uid: string;
  status: number;
  type: string;
}

export enum DocumentStatus {
  'Chờ duyệt',
  'Đã duyệt',
  'Từ chối',
}

export enum DocumentStatusColor {
  '#d3d3d3',
  '#8ac926',
  '#f94144',
}
