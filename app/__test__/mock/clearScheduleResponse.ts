export const clearScheduleSuccessResponse = 200;

export const clearScheduleInvalid404Response = {
  type: "",
  instance: "",
  errors: [
    {
      errorCode: "CIA-0503",
      errorDetail:
        "Unique reference does not exists Contribution Header Id 24d924e2-2692-40d6-9400-34134aaa4039",
    },
  ],
};
export const clearScheduleInvalid500response = {
  name: "SequelizeConnectionError",
  message: "Unexpected Server Error",
};
