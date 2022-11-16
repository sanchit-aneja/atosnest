export const memberUpdateSuccessResponse = {
  message: "Contribution Details are updated.",
};

export const memberUpdateInvalid404Response = {
  type: "",
  instance: "",
  errors: [
    {
      errorCode: "CIA-0604",
      errorDetail: "Member Schedule Status Error",
    },
  ],
};
export const memberUpdateInvalid500response = {
  name: "SequelizeConnectionError",
  message: "Unexpected Server Error",
};
