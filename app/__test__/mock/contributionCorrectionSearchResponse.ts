export const contributionCorrectionSearchSuccessResponse = {
  totalRecordCount: 2,
  results: [
    {
      contribHeaderId: "ae6ce814-18b5-407e-bd86-394ee64cb4b3",
      origContribHeaderId: null,
      nestScheduleRef: "CSM01072103CH",
      externalScheduleRef: "2022-11-11-04.53.37.053999.10311",
      scheduleType: "CS",
      scheduleStatusCd: "CS1",
      scheduleGenerationDate: "2021-06-14",
      employerNestId: "SCHEMEDATA",
      subSchemeId: "3",
      earningPeriodStartDate: "2021-06-02",
      earningPeriodEndDate: "2021-07-01",
      paymentPlanNo: "BPI72376100",
      paymentRef: "NESTBPI72376100",
      nestPaymentRef: "IT0000000003",
      paymentSourceName: "paymentSourceName",
      paymentMethod: "CH",
      paymentMethodDesc: "Cheque",
      paymentFrequency: "M",
      paymentFrequencyDesc: "Monthly",
      taxPayFrequencyInd: "Y",
      paymentDueDate: "2021-06-02",
      pegaCaseRef: "pegaCase",
      noOfMembs: "3",
      totScheduleAmt: "0.00",
      recordStartDate: null,
      recordEndDate: null,
      createdBy: null,
      updatedBy: "",
      last_updated_timestamp: "2022-12-22T05:59:28.369Z",
      rdschedulestatus: {
        scheduleStatusDesc: "New schedule",
      },
    },
    {
      contribHeaderId: "ae6ce814-18b5-407e-bd86-394ee64cb4b3",
      origContribHeaderId: null,
      nestScheduleRef: "CSM01072103CH",
      externalScheduleRef: "2022-11-11-04.53.37.053999.10311",
      scheduleType: "CS",
      scheduleStatusCd: "CS1",
      scheduleGenerationDate: "2021-06-14",
      employerNestId: "SCHEMEDATA",
      subSchemeId: "3",
      earningPeriodStartDate: "2021-06-02",
      earningPeriodEndDate: "2021-07-01",
      paymentPlanNo: "BPI72376100",
      paymentRef: "NESTBPI72376100",
      nestPaymentRef: "IT0000000003",
      paymentSourceName: "paymentSourceName",
      paymentMethod: "CH",
      paymentMethodDesc: "Cheque",
      paymentFrequency: "M",
      paymentFrequencyDesc: "Monthly",
      taxPayFrequencyInd: "Y",
      paymentDueDate: "2021-06-02",
      pegaCaseRef: "pegaCase",
      noOfMembs: "3",
      totScheduleAmt: "0.00",
      recordStartDate: null,
      recordEndDate: null,
      createdBy: null,
      updatedBy: "",
      last_updated_timestamp: "2022-12-22T05:59:28.369Z",
      rdschedulestatus: {
        scheduleStatusDesc: "New schedule",
      },
    },
  ],
};

export const contributionCorrectionSearchInvalid404Response = {
  type: "",
  instance: "",
  errors: [
    {
      errorCode: 404,
      errorDetail: "No record found for supplied params",
    },
  ],
};

export const contributionCorrectionSearchInvalid400Response = {
  type: "",
  instance: "",
  errors: [
    {
      errorCode: "CIA-0502",
      errorDetail: "Posted parameters fail validation",
    },
  ],
};

export const contributionCorrectionSearchInvalid500response = {
  name: "SequelizeConnectionError",
  message: "Unexpected Server Error",
};
