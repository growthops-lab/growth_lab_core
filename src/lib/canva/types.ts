export type CanvaApiResult<T> = {
  ok: boolean;
  endpoint: string;
  method: string;
  mockMode: boolean;
  statusCode?: number;
  data?: T;
  error?: string;
};

export type CanvaMockDesign = {
  designId: string;
  designUrl: string;
};

export type CanvaMockExport = {
  exportJobId: string;
  downloadUrl: string;
};
