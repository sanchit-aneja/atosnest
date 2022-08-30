/**
 * This is Contribution member details interface
 */
export interface ContributionMemberDetails{
    membContribDetlId: number;
    schdlMembStatusCd?: string;
    membPartyId?: string;
    scmPartyId?: string;
    nino?: string;
    alternativeId?: string;
    autoCalcFlag?: string;
    pensEarnings?: number;
    emplContriAmt?: number;
    membContriAmt?: number;
    membNonPayReason?: string;
    membLeaveEarnings?: number;
    newEmpGroupId?: number;
    newGroupName?: string;
    newGroupPensEarnings?: number;
    newGroupEmplContriAmt?: number;
    newGroupMembContriAmt?: number;
    optoutRefNum?: string;
    optoutDeclarationFlag?: string;
    newPaymentPlanNo?: string;
    newPaymentSourceName?: string;
    membNonPayEffDate?: Date;
    secEnrolPensEarnings?: number;
    secEnrolEmplContriAmt?: number;
    secEnrolMembContriAmt?: number;
    channelType?: string;
    memberExcludedFlag?: string;
    membPaymentDueDate?: Date;
    recordStartDate?: Date;
    recordEndDate?: Date;
}

/**
 * This is Contribution member details update API Request DTO interface
 */
export interface ContributionDetailsRequestDTO
{
    contributionDetail:Array<ContributionMemberDetails>;
}
