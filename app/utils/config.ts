enum Status {
  SUCCESS = 200,
  FAILURE = 500,
  NOT_FOUND = 404,
  EXIST = 409,
  BAD_REQUEST = 400,

  CREATE_MSG = "Records created successfully",
  DELETE_MSG = "Records deleted successfully",
  UPDATE_MSG = "Records updated successfully",
  GET_MSG = "Records fetched successfully",
  SUCCESS_MSG = "Success Response",
  FAILURE_MSG = "Internal Server Error",
  NOT_FOUND_MSG = "Record does not exist",
  EXIST_MSG = "Record already exist",
  BAD_REQUEST_MSG = "Invalid Request",
}

export default Status;
