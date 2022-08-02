export interface ContributionStgPolicyResponse {
  /**
  * @isInt
  */
  contrPolicyId: number;
  recordId: string;
  scheduleReference: string;
  planReference: string;
  policyId: string;
  taxReliefStatus: string;
  taxReliefStatusDesc: string;
  salaryBasis: string;
  salaryBasisDesc: string;
  regularContributionType: string;
  regularContributionTypeDesc: string;
  /**
  * @isInt
  */
  contributionPercentage: number;
  /**
  * @isInt
  */
  lastPaidAmount: number;
  /**
  * @isDate
  */
  recordStartDate?: Date;
  /**
  * @isDate
  */
  recordEndDate?: Date;
  createdBy?: string;
}

export interface ContributionStgMemberResponse {
  recordId: string;
  scheduleReference: string;
  /**
  * @isInt
  */
  cmPartyId: number;
  crmPartyId: string;
  planReference: string;
  membershipId: string;
  schemePayrollReference: string;
  nino: string;
  forename: string;
  surname: string;
  /**
  * @isDate
  */
  membershipEffectiveDate: Date;
  membershipStatus: string;
  membershipStatusDesc: string;
  /**
  * @isInt
  */
  category: number;
  categoryName: string;
  /**
  * @isInt
  */
  pensionableSalary: number;
  reasonCode: string;
  /**
  * @isInt
  */
  currentEmployerContribution: number;
  /**
  * @isInt
  */
  currentMemberContribution: number;
  /**
  * @isInt
  */
  newEmployerContribution: number;
  /**
  * @isInt
  */
  newMemberContribution: number;
  /**
  * @isInt
  */
  newSalary: number;
  /**
  * @isDate
  */
  recordStartDate?: Date;
  /**
  * @isDate
  */
  recordEndDate?: Date;
  createdBy?: string;
}

export interface ContributionStgScheduleResponse {
  scheduleReference: string;
  groupSchemeID?: string;
  subSchemeId?: string;
  /**
  * @isDate
  */
  effectiveDate: Date;
  scheduleType: string;
  paymentPlanNo: number;
  payReference?: string;
  /**
  * @isDate
  */
  paymentDueDate?: Date;
  /**
  * @isDate
  */
  startDate?: Date;
  /**
  * @isDate
  */
  endDate?: Date;
  mopType: string;
  mopTypeDesc?: string;
  premFrequency?: string;
  premFrequencyDesc?: string;
  taxPeriodFreqInd?: string;
  numberOfMembers?: number;
  /**
  * @isDate
  */
  recordStartDate?: Date;
  /**
  * @isDate
  */
  recordEndDate?: Date;
  createdBy?: string;
}

export interface ContributionHeaderResponse {
  fileId?: number;
  nestScheduleRef: string;
  externalScheduleRef?: string;
  scheduleType: string;
  scheduleStatusCd: string;
  /**
  * @isDate
  */
  scheduleGenerationDate: Date;
  employerNestId: string;
  groupSchemeId: string;
  subSchemeId?: string;
  /**
  * @isDate
  */
  earningPeriodStartDate: Date;
  /**
  * @isDate
  */
  earningPeriodEndDate: Date;
  paymentPlanNo?: string;
  paymentRef?: string;
  paymentSourceName: string;
  paymentMethod: string;
  paymentMethodDesc: string;
  paymentFrequency: string;
  paymentFrequencyDesc: string;
  taxPayFrequencyInd?: string;
  /**
  * @isDate
  */
  paymentDueDate: Date;
  pegaCaseRef?: string;
  noOfMembs?: number;
  totScheduleAmt?: number,
  origScheduleRef?: string;
  /**
  * @isDate
  */
  recordStartDate?: Date;
  /**
  * @isDate
  */
  recordEndDate?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface MemberContributionDetailsResponse {

  schdlMembStatusCd: string;
  /**
  * @isDate
  */
  contributionDueDate: Date;
  enrolmentReference: string;
  /**
  * @isInt
  */
  fileId?: number;
  firstName: string;
  lastName: string;
  crmPartyId: string;
  /**
  * @isInt
  */
  cmPartyID: number;
  nino: string;
  alternativeID: string;
  groupRefNum: string;
  groupName: string;
  /**
  * @isInt
  */
  lastPaidPensEarnings: number;
  lastReasonCode: string;
  /**
  * @isInt
  */
  lastPaidEmplContriAmt: number;
  /**
  * @isInt
  */
  lastPaidMemblContriAmt: number;
  enrolmentType: string;
  /**
  * @isInt
  */
  pensEarnings: number;
  /**
  * @isInt
  */
  emplContriAmt: number;
  /**
  * @isInt
  */
  membContriAmt: number;
  /**
  * @isInt
  */
  emplContriPct: number;
  /**
  * @isInt
  */
  membContriPct: number;
  autoCalcFlag: string;
  membNonPayReason: string;
  /**
  * @isInt
  */
  membLeaveEarnings: number;
  newGroupRefNum: string;
  newGroupName: string;
  /**
  * @isInt
  */
  newGroupPensEarnings: number;
  /**
  * @isInt
  */
  newGroupEmplContriAmt: number;
  /**
  * @isInt
  */
  newGroupMembContriAmt: number;
  /**
  * @isInt
  */
  newGroupEmplContriPct: number;
  /**
  * @isInt
  */
  newGroupMembContriPct: number;
  optoutRefNum: string;
  optoutDeclarationFlag: string;
  newPaymentPlanNo: string;
  newPaymentSourceName: string;
  /**
  * @isDate
  */
  membNonPayEffDate: Date;
  newEnrolmentType: string;
  /**
  * @isInt
  */
  secEnrolPensEarnings: number;
  /**
  * @isInt
  */
  secEnrolEmplContriAmt: number;
  /**
  * @isInt
  */
  secEnrolMembContriAmt: number;
  /**
  * @isDate
  */
  memberLevelDueDate: Date;
  memberExclusionFlag: string;
  scheduleReference: string;
  /**
  * @isDate
  */
  recordStartDate?: Date;
  /**
  * @isDate
  */
  recordEndDate?: Date;
  createdBy?: string;
  updatedBy?: string;
}