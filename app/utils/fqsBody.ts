export interface FQSBody {
  eventBody: EventBody;
}

export interface EventBody {
  correlationId: string;
  payloadType: string;
  srcSystemId: string;
  recievedDateTime: string;
  intentAttributes: IntentAttributes;
}

export interface IntentAttributes {
  FileId: string;
  Stage: string;
  Status: string;
  NumberOfErrors: number;
  error: FQSError;
}

export interface FQSError {
  ErrorItem: string;
  ErrorText: string;
}

export const enum fqsStage {
  HEADER = "validateHeader",
  BODY = "validateBody",
  MATCH = "matchContribution",
  TYPE3 = "ValidateType3",
}

export const enum fqsStatus {
  INPROGRESS = "inProgress",
  COMPLETED = "completed",
  ERROR = "error",
}
