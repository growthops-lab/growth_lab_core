export type SearchConsoleApiRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

export type SearchConsoleQueryResponse = {
  rows?: SearchConsoleApiRow[];
};
