export const groupNameGetSuccessResponse = {
  totalRecordCount: 3,
  results: [
    {
      groupId: 0,
      groupName: "groupA",
    },
    {
      groupId: 1,
      groupName: "groupB",
    },
    {
      groupId: 2,
      groupName: "groupC",
    },
  ],
};

export const groupNameGetInvalid404Response = {
  type: "",
  instance: "",
  errors: [
    {
      errorCode: "CIA-0503",
      errorDetail:
        "No suitable record found for Contribution Header Id 4a2f768b--invalid",
    },
  ],
};
export const groupNameGetInvalid500response = {
  name: "SequelizeConnectionError",
  message: "Unexpected Server Error",
};
