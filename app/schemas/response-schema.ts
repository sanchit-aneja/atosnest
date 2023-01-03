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
  contribHeaderId: string;
  nestScheduleRef: string;
  externalScheduleRef?: string;
  scheduleType: string;
  scheduleStatusCd: string;
  /**
   * @isDate
   */
  scheduleGenerationDate: Date;
  employerNestId: string;
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
  nestPaymentRef: string;
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
  totScheduleAmt?: number;
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
  membContribDetlId: string;
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
  autoCalcFlag?: string;
  /**
   * @isFloat
   */
  pensEarnings?: number;
  /**
   * @isFloat
   */
  emplContriAmt?: number;
  /**
   * @isFloat
   */
  membContriAmt?: number;
  /**
   * @isFloat
   */
  membNonPayReason: string;
  /**
   * @isFloat
   */
  membLeaveEarnings?: number;
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
   * @isInt
   */
  newEmpGroupId?: number;
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
  employerNestId?: string;
  origScheduleRef?: string;
  contribHeaderId?: string;
  firstName: string;
  lastName: string;
  enrolmentType?: string;
  secEnrolmentType?: string;
  /**
   * @isFloat
   */
  emplContriPct: number;
  /**
   * @isFloat
   */
  membContriPct: number;
  /**
   * @isFloat
   */
  newGroupEmplContriPct?: number;
  /**
   * @isFloat
   */
  newGroupMembContriPct?: number;
  recordChangedFlag?: string;
  memTaxReliefEligibility?: string;
  origMembNonPayReason?: string;
}

export interface ErrorDetailsResponse {
  /**
   * @isInt
   */
  errorLogId: number;
  errorFileId: string;
  /**
   * @isFloat
   */
  errorSequenceNum: number;
  errorCode: string;
  errorMessage?: string;
  /**
   * @isInt
   */
  errorTypeId?: number;
}

interface OverdueFilterOptions {
  /**
   * @isDate
   */
  fromDate: Date;
  filter: string;
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

interface HeaderFilterParams {
  contribHeaderId?: string;
  nestScheduleRef?: string;
  employerNestId?: string;
}

interface OverdueFilterParams {
  employerNestId?: string;
}

export interface HeaderFilterElements {
  options?: FilterOptions;
  params: HeaderFilterParams;
}

export interface OverdueScheduleFilterElements {
  options?: FilterOptions;
  searchOptions: OverdueFilterOptions;
  params: OverdueFilterParams;
}

interface DetailsFilterParams {
  nestScheduleRef: string;
  fitstName: string;
  lastName: string;
}

interface DetailsEligibleFilterParams {
  contribHeaderId: string;
}

export interface DetailsFilterElements {
  options?: FilterOptions;
  params: DetailsFilterParams;
}

export interface DetailsEligibleFilterElements {
  options?: FilterOptions;
  params: DetailsEligibleFilterParams;
}

export interface SearchResultsetResponse<T> {
  totalRecordCount: number;
  results: T[];
}

export interface CreateContributionResponse {
  contributionSubmissionRef: string;
  scheduleSubmissionSeq: number;
  countSubmitted: number;
  countRowsSubmitted: number;
}

export interface RetriveEligibleContributionDetailsResponse {
  contribHeaderId?: string;
  origScheduleRef?: string;

  employerNestId?: string;
  updatedBy?: string;
  /**
   * @isDate
   */
  membPaymentDueDate?: Date;

  /**
   * @isDate
   */

  recordEndDate?: Date;
  createdBy?: string;
  /**
   * @isInt
   */
  newEmpGroupId?: number;

  recordStartDate?: Date;
  /**
   * @isDate
   */

  memberExcludedFlag?: string;
  nestScheduleRef: string;
  membEnrolmentRef: string;

  membContribDetlId: string;

  membPlanRef?: string;
  /**
   * @isDate
   */

  membContriDueDate: Date;
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
  autoCalcFlag?: string;
  /**
   * @isFloat
   */
  emplContriAmt?: number;
  /**
   * @isFloat
   */
  pensEarnings?: number;

  /**
   * @isFloat
   */
  membContriAmt?: number;
  /**
   * @isFloat
   */
  membLeaveEarnings?: number;

  membNonPayReason: string;
  /**
   * @isFloat
   */
  newGroupPensEarnings?: number;
  /**
   * @isFloat
   */
  newGroupName?: string;
  /**
   * @isFloat
   */

  optoutDeclarationFlag?: string;

  newGroupEmplContriAmt?: number;
  optoutRefNum?: string;

  /**
   * @isFloat
   */
  newGroupMembContriAmt?: number;

  newPaymentPlanNo?: string;
  /**
   * @isFloat
   */
  secEnrolMembContriAmt?: number;

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
  channelType?: string;
  enrolmentType?: string;
  /**
   * @isFloat
   */
  emplContriPct: number;
  /**
   * @isFloat
   */
  membContriPct: number;
  /**
   * @isFloat
   */
  newGroupEmplContriPct?: number;
  secEnrolEmplContriAmt?: number;
  firstName: string;
  secEnrolmentType?: string;
  lastName: string;
  /**
   * @isFloat
   */
  newGroupMembContriPct?: number;
  recordChangedFlag?: string;
  origMembNonPayReason?: string;
  memTaxReliefEligibility?: string;
  errorDetails: ErrorDetailsResponse;
  rdschedulememberstatus: RDScheduleMemberStatusResponse;
  rdpartcontribreason: RDPartContribReasonResponse;
  includedInCorrection: IncludedInCorrectionResponse;
}

export interface IncludedInCorrectionResponse {
  includedInCorrection: string;
}

export interface RetriveContributionDetailsResponse {
  contribHeaderId?: string;
  origScheduleRef?: string;

  employerNestId?: string;
  updatedBy?: string;
  /**
   * @isDate
   */
  membPaymentDueDate?: Date;

  /**
   * @isDate
   */

  recordEndDate?: Date;
  createdBy?: string;
  /**
   * @isInt
   */
  newEmpGroupId?: number;

  recordStartDate?: Date;
  /**
   * @isDate
   */

  memberExcludedFlag?: string;
  nestScheduleRef: string;
  membEnrolmentRef: string;

  membContribDetlId: string;

  membPlanRef?: string;
  /**
   * @isDate
   */

  membContriDueDate: Date;
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
  autoCalcFlag?: string;
  /**
   * @isFloat
   */
  emplContriAmt?: number;
  /**
   * @isFloat
   */
  pensEarnings?: number;

  /**
   * @isFloat
   */
  membContriAmt?: number;
  /**
   * @isFloat
   */
  membLeaveEarnings?: number;

  membNonPayReason: string;
  /**
   * @isFloat
   */
  newGroupPensEarnings?: number;
  /**
   * @isFloat
   */
  newGroupName?: string;
  /**
   * @isFloat
   */

  optoutDeclarationFlag?: string;

  newGroupEmplContriAmt?: number;
  optoutRefNum?: string;

  /**
   * @isFloat
   */
  newGroupMembContriAmt?: number;

  newPaymentPlanNo?: string;
  /**
   * @isFloat
   */
  secEnrolMembContriAmt?: number;

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
  channelType?: string;
  enrolmentType?: string;
  /**
   * @isFloat
   */
  emplContriPct: number;
  /**
   * @isFloat
   */
  membContriPct: number;
  /**
   * @isFloat
   */
  newGroupEmplContriPct?: number;
  secEnrolEmplContriAmt?: number;
  firstName: string;
  secEnrolmentType?: string;
  lastName: string;
  /**
   * @isFloat
   */
  newGroupMembContriPct?: number;
  recordChangedFlag?: string;
  origMembNonPayReason?: string;
  memTaxReliefEligibility?: string;
  errorDetails: ErrorDetailsResponse;
  rdschedulememberstatus: RDScheduleMemberStatusResponse;
  rdpartcontribreason: RDPartContribReasonResponse;
}

export interface RDScheduleMemberStatusResponse {
  schdlMembStatusDesc: string;
}

export interface RDPartContribReasonResponse {
  reasonDescription: string;
}
export interface SearchMemberContributionResultResponse<T> {
  totalRecordCount: number;
  results: T[];
}

export interface ContributionSubmissionUpdateResponse {
  countSubmitted: number;
  countMembersInSchedule: number;
  countUnsubmitted: number;
}

export interface ContributionCorrectionAddMemberDetails {
  membContribDetlId: string;
}

export interface ClearScheduleStatusResponse {
  clearSuccess: string;
}

export interface ContributionXmlResponse {
  isStreaming: boolean;
  docs: {}[];
  totalRecordCount: number;
}

export interface ContributionUpdateIndividualDetails {
  contribScheduleId: string;
  schdlMembStatusCd: string;
}

export interface ContributionUpdateIneligibilityResponse {
  IneligibleSchedules: Array<ContributionUpdateIndividualDetails>;
}

export interface GetGroupNamesResponse {
  groupId: string;
  groupName: string;
}
