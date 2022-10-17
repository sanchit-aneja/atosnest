export const memberSubmissionGetSuccessResponse =
{
  totalRecordCount: 1,
  results: [
    {
      schdlMembStatusCd: "MS4",
      employerNestId: "A127",
      membEnrolmentRef: "N6681775",
      membContriDueDate: "2022-02-20",
      membPlanRef: "N6681775",
      membPartyId: "membPartyId",
      scmPartyId: "15013056",
      nino: "",
      alternativeId: "EMPA19",
      autoCalcFlag: "Y",
      empGroupId: "1",
      pensEarnings: "2500.01",
      emplContriAmt: "0.00",
      membContriAmt: "0.00",
      membNonPayReason: "CON14",
      membLeaveEarnings: "0.00",
      newGroupName: null,
      newGroupPensEarnings: null,
      newGroupEmplContriAmt: null,
      newGroupMembContriAmt: null,
      optoutRefNum: null,
      optoutDeclarationFlag: null,
      newPaymentPlanNo: null,
      newPaymentSourceName: null,
      membNonPayEffDate: null,
      secEnrolPensEarnings: null,
      secEnrolEmplContriAmt: null,
      secEnrolMembContriAmt: null,
      channelType: "WEB",
      memberExcludedFlag: null,
      membPaymentDueDate: null,
      recordStartDate: "2022-10-17",
      recordEndDate: null,
      firstName: "NA",
      lastName: "NA",
      enrolmentType: "Y",
      secEnrolmentType: null,
      emplContriPct: "0.00",
      membContriPct: "0.00",
      newGroupEmplContriPct: null,
      newGroupMembContriPct: null,
      recordChangedFlag: null,
      memTaxReliefEligibility: null,
      createdBy: "System",
      createdDate: "2022-10-17T07:08:09.000Z",
      contribSubmissionRef: "2de64d14-d384-48d5-a903-3981306fd765",
      membContribDetlId: "0b42de19-1cf0-4993-9fcf-d734b13dd2af",
      membSubmId: "5"
    }
  ]
}

export const memberSubmissionGetInvalid404Response = {
  type: "",
  instance: "",
  errors: [
    {
      errorCode: "CIA-0503",
      errorDetail: "Unique reference does not exists Submission Reference Number b8b0a5bc-bfec-478f-8fb0-97f0d1dac718"
    }
  ]
}
export const memberSubmissionGetInvalid500response = {
  name: "SequelizeConnectionError",
  message: "Unexpected Server Error",
};