export const preCorrectionSummarySuccessResponse = {
  results: {
    contribHeaderId: "7995478a-00b0-4e2e-92ad-7cd81a3f8f4d",
    origContribHeaderId: "0a6fcb5d-7450-4a51-8dd6-c705223b05a0",
    nestScheduleRef: "CCM18012023001",
    origNestScheduleRef: "CCM18012023001",
    origPaymentDueDate: "2021-04-02",
    earningsPeriodStartDate: "2021-04-02",
    earningsPeriodEndDate: "2021-05-01",
    paymentFrequency: "M",
    paymentFrequencyDesc: "Monthly",
    paymentSourceName: "paymentSourceName",
    paymentMethod: "CH",
    paymentMethodDesc: "Cheque",
    paymentPlanId: "BPI72376100",
    totContrSubmissionAmt: 67.56,
    ccTotContrSubmissionAmt: 77,
    memberSummary: [
      {
        schdlMembStatusCd: "MCS13",
        statusCount: 1,
      },
    ],
  },
};

export const preCorrectionSummaryInvalid404Response = {
  type: "",
  instance: "",
  errors: [
    {
      errorCode: "CIA-0503",
      errorDetail:
        "Contribution_Header row is not found a47fc34a-e840-493d-b4db-9a48eeeaf13d",
    },
  ],
};
