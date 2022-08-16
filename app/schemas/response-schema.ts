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
  /**
  * @isInt
  */
  membContribDetlId: number;
  nestScheduleRef: string;
  membEnrolmentRef: string;
  /**
  * @isDate
  */
  membContriDueDate: Date;
  membPlanRef?: string;
  /**
  * @isInt
  */
  empGroupId: number;
  groupName: string;
  schdlMembStatusCd: string;
  membPartyId: string;
  scmPartyId?: string;
  nino?: string;
  alternativeId?: string;
  /**
  * @isFloat
  */
  lastPaidPensEarnings?: number;
  lastPaidReasonCode?: string;
  /**
  * @isFloat
  */
  lastPaidEmplContriAmt?: number;
  /**
  * @isFloat
  */
  lastPaidMembContriAmt?: number;
  autoCalcFlag?: string;
  /**
  * @isFloat
  */
  pensEarnings?: number;
  /**
  * @isFloat
  */
  emplContriAmt?: number;
  membNonPayReason: string;
  /**
  * @isFloat
  */
  membLeaveEarnings?: number;
  /**
  * @isInt
  */
  newEmpGroupId?: number;
  newGroupName?: string;
  /**
  * @isFloat
  */
  newGroupPensEarnings?: number;
  /**
  * @isFloat
  */
  newGroupEmplContriAmt?: number;
  /**
  * @isFloat
  */
  newGroupMembContriAmt?: number;
  optoutRefNum?: string;
  optoutDeclarationFlag?: string;
  newPaymentPlanNo?: string;
  newPaymentSourceName?: string;
  /**
  * @isDate
  */
  membNonPayEffDate?: Date;
  /**
  * @isFloat
  */
  secEnrolPensEarnings?: number;
  /**
  * @isFloat
  */
  secEnrolEmplContriAmt?: number;
  /**
  * @isFloat
  */
  secEnrolMembContriAmt?: number;
  channelType?: string;
  memberExcludedFlag?: string;
  /**
  * @isDate
  */
  membPaymentDueDate?: Date;
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

interface FilterOptions {
  /**
   * @isInt
   */
  limit?: number;
  /**
   * @isInt
   */
  offset?: number;
  sort?: string[];
}

interface FilterParams {
  contribHeaderId?: string;
  nestScheduleRef?: string;
  employerNestId?: string;
}

export interface FilterElements {
  options?: FilterOptions;
  params: FilterParams;
}

export interface SearchResultsetResponse<T> {
  totalRecordCount: number;
  results: T[];
}