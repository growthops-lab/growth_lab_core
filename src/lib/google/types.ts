import type {
  GoogleApiActionRequired,
  GoogleApiName,
  RequestType,
} from "@prisma/client";

export type GoogleTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  scope?: string;
  token_type?: string;
  error?: string;
  error_description?: string;
};

export type GoogleApiErrorShape = {
  statusCode?: number;
  errorCode?: string;
  message: string;
  retryable: boolean;
  actionRequired: GoogleApiActionRequired;
};

export type GoogleRequestContext = {
  mediaId?: string | null;
  googleConnectionId?: string | null;
  apiName: GoogleApiName;
  endpoint: string;
  requestType: RequestType;
  propertyId?: string | null;
};
