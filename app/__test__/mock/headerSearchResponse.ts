export const headerGetSuccessResponse = {
  ContributionHeader: {
    contribHeaderId: "1130039",
    fileId: "2d85ebc2-ee96-44f4-b6b9-36703c3cdf93",
    nestScheduleRef: "1",
    externalScheduleRef: "2022-23-02-05.35.45.302656.6621",
    scheduleType: "N",
    scheduleStatusCd: "CS1",
    scheduleGenerationDate: "2022-02-02",
    employerNestId: "A123            ",
    groupSchemeId: "A123            ",
    subSchemeId: "1",
    earningPeriodStartDate: "2022-01-20",
    earningPeriodEndDate: "2022-02-19",
    paymentPlanNo: "BPM02147100",
    paymentRef: "BPM02147100                   ",
    paymentSourceName: "paymentSourceName",
    paymentMethod: "DD",
    paymentMethodDesc: "Direct Debit        ",
    paymentFrequency: "M ",
    paymentFrequencyDesc: "Monthly",
    taxPayFrequencyInd: " ",
    futurePaymentDate: "9999-12-12",
    paymentDueDate: "2022-02-28",
    pegaCaseRef: "",
    noOfMembs: "1",
    totScheduleAmt: "0.00",
    origScheduleRef: "",
    recordStartDate: null,
    recordEndDate: null,
    createdBy: null,
    updatedBy: "",
    last_updated_timestamp: "2022-08-17T15:16:36.141Z",
  },
};

export const headerGetInvalid404Response = {
  type: "",
  instance: "",
  errors: [
    {
      errorCode: "CIA-0503",
      errorDetail:
        "Unique reference does not exists Schedule Reference Number 2022-23-02-invalid",
    },
  ],
};
export const headerGetInvalid500response = {
  name: "SequelizeConnectionError",
  message: "Unexpected Server Error",
};
