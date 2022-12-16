export const updateMemberStatusSuccessResponse = 200;

export const updateMemberStatusInvalid404Response = {
  type: "",
  instance: "",
  errors: [
    {
      errorCode: "CIA-0503",
      errorDetail: " Member_Contribution_Detail row is not found ",
    },
  ],
};
export const updateMemberStatusInvalid500response = {
  name: "SequelizeConnectionError",
  message: "Unexpected Server Error",
};
