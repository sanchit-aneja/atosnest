export const removeScheduleSuccessResponse = 200;

export const removeScheduleInvalid404Response = {
  type: "",
  instance: "",
  errors: [
    {
      errorCode: "CIA-0503",
      errorDetail: " Member_Contribution_Detail row is not found ",
    },
  ],
};
export const removeScheduleInvalid400Response = {
  type: "",
  instance: "",
  errors: [
    {
      errorCode: "CIA-0500",
      errorDetail: " put data fails validation ",
    },
  ],
};
export const removeScheduleInvalid500response = {
  name: "SequelizeConnectionError",
  message: "Unexpected Server Error",
};
