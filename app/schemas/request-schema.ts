import {
  ContributionStgScheduleResponse,
  ContributionStgMemberResponse,
  ContributionStgPolicyResponse,
  ContributionHeaderResponse,
  MemberContributionDetailsResponse
} from "./response-schema";

type commonFields = "createdBy" | "updatedBy" | "updatedAt";

export interface ContributionStgScheduleRequest
  extends Omit<ContributionStgScheduleResponse, ''> { }

export interface ContributionStgMemberRequest
  extends Omit<ContributionStgMemberResponse, ''> { }

export interface ContributionStgPolicyRequest
  extends Omit<ContributionStgPolicyResponse, ''> { }

export interface ContributionHeaderRequest
  extends Omit<ContributionHeaderResponse, ''> { }

export interface MemberContributionDetailsRequest
  extends Omit<MemberContributionDetailsResponse, ''> { }
