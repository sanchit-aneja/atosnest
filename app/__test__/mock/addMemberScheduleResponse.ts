export const addMemberScheduleSuccessResponse = 200;

export const addMemberScheduleInvalid404Response = {
  type: "",
  instance: "",
  errors: [
    {
      errorCode: "CIA-0503",
      errorDetail: "Unique reference does not exists Contribution Header Id ",
    },
  ],
};
export const addMemberScheduleInvalid500response = {
  name: "SequelizeConnectionError",
  message: "Unexpected Server Error",
};
