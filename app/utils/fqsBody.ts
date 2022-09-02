interface FQSBody {
  eventBody: EventBody;
}

interface EventBody {
  correlationId: string;
  payloadType: string;
  srcSystemId: string;
  recievedDateTime: string;
  intentAttributes: IntentAttributes;
}

interface IntentAttributes {
  FileId: string;
  Stage: string;
  Status: string;
  NumberOfErrors: number;
  error: Error;
}

interface Error {
  ErrorItem: string;
  ErrorText: string;
}

export const fqsbody = {} as FQSBody;

export const eventbody = {} as EventBody;

export const intentAttributes = {} as IntentAttributes;

export const fqserror = {} as Error;

export const enum fqsStage {
  HEADER = "validateHeader",
  BODY = "validateBody",
  MATCH = "matchContribution",
}

export const enum fqsStatus {
  INPROGRESS = "inProgress",
  COMPLETED = "completed",
  ERROR = "error",
}
