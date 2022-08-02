import { errorDetails } from "../utils/constants";

const errorHandler = {
  mapHandleErrorResponse(
    type: any,
    instance: any,
    error_code: any,
    error_msg: any,
    method: any
  ) {
    let errorAry = [];
    if (method == "post" || method == "update") {
      if (error_msg && error_msg.length >= 1) {
        return this.errorCodeAndDetails(error_msg, error_code);
      } else {
        let errorObj = {
          errorCode: error_code,
          errorDetail: error_msg.message,
        };
        errorAry.push(errorObj);
      }
    } else {
      let errorObj = {
        errorCode: error_code,
        errorDetail: error_msg,
      };
      errorAry.push(errorObj);
    }

    return {
      type: type,
      instance: instance,
      errors: errorAry,
    };
  },

  errorCodeAndDetails(error_msg, error_code): Promise<any> {
    let errorAry;
    for (let x in error_msg) {
      let errorObj = {
        errorCode:
          error_msg[x].message.includes("valid") ||
            error_msg[x].message.includes("must") ||
            error_msg[x].message.includes("required") ||
            error_msg[x].message.includes("empty")
            ? errorDetails.CIA0502[0]
            : error_code,
        errorDetail: error_msg[x].message.includes('"')
          ? error_msg[x].message.replace(/\"/g, "")
          : error_msg[x].message,
      };
      errorAry.push(errorObj);
    }
    return errorAry;
  }
};

export default errorHandler;
