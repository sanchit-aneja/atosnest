/*
In >= 1 detail record, reason code 6 or reason code 12 has been entered and the date entered in the Effective Date o
f Partial or Non-Payment of Contributions field is before the EPSD (date = to EPSD is accepted) of the CS
*/

export const id31_43Response = {
  dataHeaderRow: {
    contribHeaderId: "3419f2bb-5516-4871-b1fd-8f595773503d",
    fileId: "65fefbb2-10b5-4535-b1ba-38ca38678476",
    nestScheduleRef: "CSM19062201100",
    externalScheduleRef: "2022-19-04-10.59.58.141556.7419 ",
    scheduleType: "N",
    scheduleStatusCd: "CS1",
    scheduleGenerationDate: "2022-06-02",
    employerNestId: "DC100020218",
    subSchemeId: "1",
    earningPeriodStartDate: "2022-05-20",
    earningPeriodEndDate: "2022-06-19",
    paymentPlanNo: "BPJ33638100",
    paymentRef: "NESTBPJ33638100",
    nestPaymentRef: "MCS1",
    paymentSourceName: "paymentSourceName",
    paymentMethod: "DD",
    paymentMethodDesc: "Direct Debit",
    paymentFrequency: "M",
    paymentFrequencyDesc: "Monthly",
    taxPayFrequencyInd: "",
    paymentDueDate: "2022-07-22",
    pegaCaseRef: "pegaCase",
    noOfMembs: "1",
    totScheduleAmt: "0.00",
    recordStartDate: null,
    recordEndDate: null,
    createdBy: null,
    updatedBy: "",
    last_updated_timestamp: "2022-09-26T11:26:04.945Z",
  },
  dataDetailRows: [
    {
      membContribDetlId: "ee8ee1090d2bf2c65",
      contribHeaderId: "3419f2bb-5516-4871-b1fd-8f595773503d",
      nestScheduleRef: "CSM19062201100",
      membEnrolmentRef: "N7893791",
      membContriDueDate: "2022-06-19",
      membPlanRef: "N7893791",
      groupName: "groupName",
      schdlMembStatusCd: "MCS1",
      membPartyId: "membPartyId",
      scmPartyId: "15013484",
      nino: "",
      alternativeId: "EMPA56",
      autoCalcFlag: "Y",
      pensEarnings: "2500.00",
      emplContriAmt: "0.00",
      membContriAmt: "0.00",
      membNonPayReason: "CON13",
      membLeaveEarnings: "0.00",
      newGroupName: null,
      newGroupPensEarnings: null,
      newGroupEmplContriAmt: null,
      newGroupMembContriAmt: null,
      optoutRefNum: null,
      optoutDeclarationFlag: null,
      newPaymentPlanNo: null,
      newPaymentSourceName: "sfsf",
      membNonPayEffDate: "2022-01-26",
      secEnrolPensEarnings: null,
      secEnrolEmplContriAmt: null,
      secEnrolMembContriAmt: null,
      channelType: "WEB",
      memberExcludedFlag: null,
      membPaymentDueDate: null,
      recordStartDate: "2022-09-26",
      recordEndDate: null,
      createdBy: "SYSTEM",
      updatedBy: "",
      lastUpdatedTimestamp: "2022-09-26T11:26:05.104Z",
      empGroupId: "1",
      newEmpGroupId: null,
      employerNestId: "DC100020218",
      origScheduleRef: null,
      last_updated_timestamp: "2022-09-26T11:26:05.104Z",
    },
  ],
};
