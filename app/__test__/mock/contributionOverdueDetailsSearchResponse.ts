export const contributionOverdueDetailsSearchSuccessResponse = {
  rowcount: 1,
  results: [
    {
      paymentDueDate: "2021-05-02",
      employerNestId: "SCHEMEDATA",
      employerName: "Tesco",
      status: "PAID",
    },
  ],
};

export const contributionOverdueDetailsSearchInvalid400Response = {
  type: "",
  instance: "",
  errors: [
    {
      errorCode: "CIA-0502",
      errorDetail: "Invalid data format params",
    },
  ],
};

export const contributionOverdueDetailsSearchInvalid500response = {
  name: "SequelizeConnectionError",
  message: "Unexpected Server Error",
};
