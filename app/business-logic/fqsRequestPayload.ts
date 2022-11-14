export interface FQSRequestPayload {
  type?: string;
  errorSummary?: FQSErrorSummary;
  errors?: FQSError[];
  instance?: string;
}

export interface FQSErrorSummary {
  errorsIncluded?: string;
  newMembersIncluded?: string;
  paidMembersIncluded?: string;
  errorType?: string;
  errorCount?: string;
  errorFileDownloadLink?: string;
}

export interface FQSError {
  errorCode: string;
  errorDetail: string;
}
