import {
  ContributionStgScheduleResponse,
  ContributionStgMemberResponse,
  ContributionStgPolicyResponse,
  ContributionHeaderResponse,
  MemberContributionDetailsResponse,
  ContributionCorrectionAddMemberDetails,
} from "./response-schema";

type commonFields = "createdBy" | "updatedBy" | "updatedAt";

export interface ContributionStgScheduleRequest
  extends Omit<ContributionStgScheduleResponse, ""> {}

export interface ContributionStgMemberRequest
  extends Omit<ContributionStgMemberResponse, ""> {}

export interface ContributionStgPolicyRequest
  extends Omit<ContributionStgPolicyResponse, ""> {}

export interface ContributionHeaderRequest
  extends Omit<ContributionHeaderResponse, ""> {}

export interface MemberContributionDetailsRequest
  extends Omit<MemberContributionDetailsResponse, ""> {}

export interface ContributionCorrectionAddMemberRequest {
  contribHeaderId: string;
  contributionDetail: Array<ContributionCorrectionAddMemberDetails>;
}

export interface SubmissionErrorRequest {
  contributionSubmissionId: string;
  errorCode: string;
  payload: string;
  payloadType: string;
}

export interface FileUploadRequest {
  key: string,
  documentName: string,
  path: string,
  FQSId: string,
  correlationId: string,
  callerId: string,
  kafkaTopicFailure: string,
  kafkaTopicSuccess: string,
  Payload: {}
}