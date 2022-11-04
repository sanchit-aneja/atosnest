export const contributionDetailsSearchSuccessResponse = {
  totalRecordCount: 10,
  results: [
    {
      membContribDetlId: "f098dbdd-7d09-496f-8a49-bdef516e569a",
      nestScheduleRef: "CSM01022201100",
      membEnrolmentRef: "N8961200",
      membContriDueDate: "2022-02-01",
      membPlanRef: "N8961200",
      groupName: "groupName",
      schdlMembStatusCd: "MCS1",
      membPartyId: "membPartyId",
      scmPartyId: "15013462",
      nino: "",
      alternativeId: "EMPA52",
      autoCalcFlag: "Y",
      pensEarnings: "2500.00",
      emplContriAmt: "0.00",
      membContriAmt: "0.00",
      membNonPayReason: "CON15",
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
      recordStartDate: "2022-10-10",
      recordEndDate: null,
      createdBy: "SYSTEM",
      updatedBy: "",
      lastUpdatedTimestamp: "2022-10-10T01:31:54.679Z",
      empGroupId: "1",
      newEmpGroupId: null,
      employerNestId: "SMP44",
      origScheduleRef: null,
      contribHeaderId: "bf2db774-349e-4fae-8081-28d77e5c545e",
      firstName: "Adam",
      lastName: "Gilchrist",
      last_updated_timestamp: "2022-10-10T01:31:54.679Z",
      rdschedulememberstatus: {
        schdlMembStatusDesc: "To be reviewed",
      },
      rdpartcontribreason: {
        reasonDescription: "Pay for Previous and New Group",
      },
      errorDetails: [
        {
          errorLogId: "3",
          errorFileId: "4402aed4-3cb5-4fbe-b955-a8d3f629e83b",
          errorType: null,
          errorSequenceNum: "1",
          sourceRecordId: null,
          errorCode: "ID31",
          errorMessage: "Error Occured",
        },
      ],
    },
  ],
};

export const contributionDetailsSearchInvalid404Response = {
  type: "",
  instance: "",
  errors: [
    {
      errorCode: "CIA-0503",
      errorDetail:
        "Unique reference does not exists No Records Found for Nest Schedule Ref & Employer Nest Id",
    },
  ],
};

export const contributionDetailsSearchInvalid500response = {
  name: "SequelizeConnectionError",
  message: "Unexpected Server Error",
};
