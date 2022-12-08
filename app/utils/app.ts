import * as moment from "moment";
import { Model, Op } from "sequelize";
import * as csvf from "fast-csv";
import { regexPattern } from "./constants";
import Status from "../utils/config";
import {
  DetailsEligibleFilterElements,
  DetailsFilterElements,
  HeaderFilterElements,
} from "../schemas/response-schema";
import errorHandler from "../utils/errorHandler";

const app = {
  DEFAULT_DATE_FORMAT: "YYYY-MM-DD",
  DEFAULT_TIME_FORMAT: "HH:mm:ss",
  loggedUser: "Admin",
  DEFAULT_LIMIT: 20,
  DEFAULT_OFFSET: 0,
  DEFAULT_EFFECTIVE_START_DATE: "1970-01-01",
  DEFAULT_EFFECTIVE_END_DATE: "9999-12-31",

  splitStr(str, index) {
    return [str.slice(0, index), str.slice(index)];
  },

  async createNestScheduleRef(item): Promise<any> {
    let nestScheduleRef = item["dataValues"]["nestScheduleRef"];
    let splittxt = nestScheduleRef?.split("CS");
    nestScheduleRef = nestScheduleRef?.substring(0, 2).replace("CS", "CC");
    nestScheduleRef = nestScheduleRef + splittxt[1];
    let splittxt1 = app.splitStr(nestScheduleRef, 9);
    let splittxt2 = app.splitStr(splittxt1[1], 2);
    let count = app.addLeadingZeros(parseInt(splittxt2[0]) + 1, 2);
    return splittxt1[0] + count + splittxt2[1];
  },

  isValidDate(input) {
    if (moment(input, "YYYY-MM-DD", true).isValid()) {
      return false;
    } else {
      return true;
    }
  },

  isEmptyString(input) {
    if (input == null || input == undefined || input == "") {
      return true;
    } else {
      return false;
    }
  },

  isNullEmpty(input) {
    if (
      input == undefined ||
      input == null ||
      input == "" ||
      (typeof input === "object" && Object.keys(input).length == 0)
    ) {
      return true;
    } else {
      return false;
    }
  },

  isJSON(input) {
    return input instanceof Array || input instanceof Object ? true : false;
  },

  allEqual(arr) {
    return arr.every((val) => val === arr[0]);
  },

  mapUpdateObj(item) {
    return {
      ...item,
      updatedBy: this.loggedUser,
    };
  },

  mapDeleteObj() {
    return {
      updatedBy: this.loggedUser,
      deletedBy: this.loggedUser,
      deletedTimestamp: moment().toISOString(),
    };
  },

  mapFilterElements(request, defFilter, type) {
    const defOptions = {
      limit: this.DEFAULT_LIMIT,
      offset: this.DEFAULT_OFFSET,
      sort: [],
    };
    let options;
    let params = {};
    if (!this.isNullEmpty(request.options)) {
      if (type == "CH") {
        options = this.mapHeaderFilterOptions(
          request.options,
          defOptions,
          defFilter,
          type
        );
      } else if (type == "EMCD") {
        options = this.mapEligibleDetailsFilterOptions(
          request.options,
          defOptions,
          defFilter,
          type
        );
      } else {
        options = this.mapDetailsFilterOptions(
          request.options,
          defOptions,
          defFilter,
          type
        );
      }
    }
    params = request.params;
    return { options, params };
  },

  mapHeaderFilterElements(request: HeaderFilterElements, defFilter, type) {
    try {
      return this.mapFilterElements(request, defFilter, type);
    } catch (e) {
      return null;
    }
  },

  mapDetailsFilterElements(request: DetailsFilterElements, defFilter, type) {
    try {
      return this.mapFilterElements(request, defFilter, type);
    } catch (e) {
      return null;
    }
  },

  mapEligibleDetailsFilterElements(
    request: DetailsEligibleFilterElements,
    defFilter,
    type
  ) {
    try {
      return this.mapFilterElements(request, defFilter, type);
    } catch (e) {
      return null;
    }
  },

  mapFilterOptions(reqOptions, optionsObj, defFilter, type) {
    try {
      const options = optionsObj;
      reqOptions &&
        Object.entries(reqOptions).forEach(([key, value]: any) => {
          let optionsKey = key.toString().toLowerCase();
          switch (optionsKey) {
            case "limit":
              options["limit"] = isNaN(value)
                ? this.DEFAULT_LIMIT
                : parseInt(value);
              break;
            case "offset":
              options["offset"] = isNaN(value)
                ? this.DEFAULT_OFFSET
                : parseInt(value);
              break;
            case "sort":
              if (type == "CH") {
                options["sort"] =
                  value && value.length > 0
                    ? this.mapFilterSorting(value, defFilter)
                    : this.mapFilterSorting(
                        "earningPeriodEndDate.desc",
                        defFilter
                      );
              } else {
                options["sort"] = this.mapFilterSorting(value, defFilter);
              }
              break;
          }
        });
      return options;
    } catch (e) {
      return {};
    }
  },
  mapHeaderFilterOptions(
    reqOptions: HeaderFilterElements["options"],
    optionsObj,
    defFilter,
    type
  ) {
    try {
      return this.mapFilterOptions(reqOptions, optionsObj, defFilter, type);
    } catch (e) {
      return null;
    }
  },
  mapEligibleDetailsFilterOptions(
    reqOptions: DetailsEligibleFilterElements["options"],
    optionsObj,
    defFilter,
    type
  ) {
    try {
      return this.mapFilterOptions(reqOptions, optionsObj, defFilter, type);
    } catch (e) {
      return null;
    }
  },
  mapDetailsFilterOptions(
    reqOptions: DetailsFilterElements["options"],
    optionsObj,
    defFilter,
    type
  ) {
    try {
      return this.mapFilterOptions(reqOptions, optionsObj, defFilter, type);
    } catch (e) {
      return null;
    }
  },
  
  mapFilterSorting(value, defFilter) {
    try {
      let sortArr = [];
      value &&
        value.forEach((ele) => {
          if (ele && ele.includes(".")) {
            const [ipField, ipOrder] = ele.split(".");
            const element = defFilter[ipField] && defFilter[ipField].split(".");
            if (
              element &&
              element.length &&
              (element[0] == "ContributionHeader" ||
                element[0] == "ContributionDetails")
            ) {
              sortArr.push([element[1], ipOrder]);
            } else {
              ipOrder && element.push(ipOrder);
              sortArr.push(element);
            }
          } else {
            const element = defFilter[ele] && defFilter[ele].split(".");
            element && element.length && sortArr.push(element);
          }
        });
      return sortArr;
    } catch (e) {
      return [];
    }
  },

  validateFilterParams(request, filterParams) {
    try {
      let params = {};
      if (!app.isNullEmpty(request) && !this.isNullEmpty(request.params)) {
        Object.entries(request.params).forEach(([key, value]) => {
          if (key && filterParams[key]) {
            const modKey = `$${filterParams[key]}$`;
            params[modKey] =
              value && value.toString().includes("%")
                ? { [Op.like]: value }
                : value;
          }
        });
      }
      return params;
    } catch (e) {
      return {};
    }
  },

  getValue(model: Model, prop: string) {
    const val = model.getDataValue(prop);
    return val ? val.toString().toUpperCase() : "N";
  },

  setValue(model: Model, prop: string, value: any) {
    const val = value ? value.toString().toUpperCase() : "N";
    model.setDataValue(prop, val);
  },

  getDate(model: Model, prop: string, type: string) {
    const val = model.getDataValue(prop);
    if (type == "startDate")
      return val
        ? moment(val).format(app.DEFAULT_DATE_FORMAT)
        : app.DEFAULT_EFFECTIVE_START_DATE;
    else
      return val
        ? moment(val).format(app.DEFAULT_DATE_FORMAT)
        : app.DEFAULT_EFFECTIVE_END_DATE;
  },

  addLeadingZeros(num, totalLength) {
    return String(num).padStart(totalLength, "0");
  },

  getFileName(subject: string) {
    return subject.split("blobs/")[1].replace(/\d$/, "");
  },

  getFileTimeStamp(time: string) {
    let str = time.split("_")[3];
    return str.substring(0, str.length - 4);
  },

  errorHandler(err): Promise<any> {
    let errorData;
    if (err.name) {
      if (
        err.name == "SequelizeConnectionError" ||
        err.name == "SequelizeDatabaseError" ||
        err.name == "SequelizeValidationError"
      ) {
        errorData = err;
        return errorData;
      } else if (err.name == "ValidationError") {
        errorData = err.details.length > 0 ? err.details : Status.FAILURE;
        return errorData;
      } else {
        errorData = Status.FAILURE;
        return errorData;
      }
    }
    return errorData;
  },

  async successResponse(item) {
    return {
      status: 200,
      body: item,
      headers: {
        "Content-Type": "application/json",
      },
    };
  },

  async errorResponse(errorCode, item) {
    return {
      status: errorCode,
      body: item,
      headers: {
        "Content-Type": "application/json",
      },
    };
  },
  async mapErrorResponse(param1, param2, param3, param4, param5) {
    return errorHandler.mapHandleErrorResponse(
      param1,
      param2,
      param3,
      param4,
      param5
    );
  },
  checkEmployerNestId(arr, val) {
    let maxCount = 0;
    let minCount = 0;
    arr.forEach((element) => {
      if ((element._previousDataValues?.groupSchemeID).trim() === val) {
        maxCount++;
        minCount = 0;
      }
    });
    if (minCount == 0 && maxCount == 1) {
      return minCount;
    } else {
      return maxCount;
    }
  },

  getLastThreeChars(id) {
    return id.substr(id.length - 3);
  },

  async getCSVDataFromReadStream(
    readStream: NodeJS.ReadableStream,
    columns: string[],
    formats: Array<Array<any>>
  ): Promise<Array<any>> {
    let results = [];
    let errorMessage = { name: "", message: "" };
    return new Promise(function (resolve, reject) {
      readStream
        .pipe(
          csvf.parse<any, any>({
            headers: columns,
            renameHeaders: true,
            ignoreEmpty: true,
          })
        )
        .validate((row, cb): void => {
          const result = app.validateFields(row, formats);
          if (!result[1]) {
            return cb(result[0], result[1], result[2]);
          } else {
            return cb(result[0], result[1]);
          }
        })
        .on("data", (row) => {
          results.push(row);
        })
        .on("data-invalid", (row, rowNumber, reason) => {
          errorMessage.name = "Invalid Data";
          errorMessage.message = `Invalid [rowNumber=${rowNumber}] [row=${JSON.stringify(
            row
          )}] [reason=${reason}]`;
          reject(errorMessage);
        })
        .on("error", (e) => {
          errorMessage.name = "Column Mismatch";
          errorMessage.message = e.message;
          reject(errorMessage);
        })
        .on("end", (_e) => {
          resolve(results);
        });
    });
  },

  validateFields(rowData: string, formats: any): any {
    let errMsg: string | false;
    let iterator = formats.values();
    for (const format of iterator) {
      let fieldData = rowData[format[0]];
      switch (format[1]) {
        case "VARCHAR":
          errMsg = new fieldVal(fieldData, format)
            .isNotEmpty()
            .isAlphaNumeric(format[3])
            .getError();
          if (errMsg) {
            return [null, false, errMsg];
          }
          break;
        case "NUMBER":
          errMsg = new fieldVal(fieldData, format)
            .isNumeric(format[3])
            .getError();
          if (errMsg) {
            return [null, false, errMsg];
          }
          break;
        case "DECIMAL":
          errMsg = new fieldVal(fieldData, format)
            .isDecimal(format[3])
            .getError();
          if (errMsg) {
            return [null, false, errMsg];
          }
          break;
        case "DATE":
          errMsg = new fieldVal(fieldData, format).isDate().getError();
          if (errMsg) {
            return [null, false, errMsg];
          }
          break;
      }
    }
    return [null, true];
  },
};

class fieldVal {
  val: any;
  errMsg: string;
  errors: boolean;
  fieldName: any[];
  required: boolean;
  limits: number | null | number[];
  datatype: string;

  constructor(arg: any, format: any) {
    this.val = arg;
    this.errMsg = "";
    this.errors = false;
    this.fieldName = format[0];
    this.required = format[2];
    this.limits = format[3];
    this.datatype = format[1];
  }

  isNotEmpty() {
    if (
      !this.errors &&
      this.required &&
      (this.val === "" || this.val == null || this.val == undefined)
    ) {
      this.errMsg = `${this.fieldName} is empty`;
      this.errors = true;
    }
    return this;
  }

  isAlphaNumeric(length) {
    if (!this.errors && this.val != undefined && this.val != "") {
      if (
        !regexPattern.alphaNumPattern.test(this.val) ||
        this.val?.length > length
      ) {
        this.errMsg = `${this.fieldName} is should be alphanumeric & max ${length} chars -- 
        value received ${this.val} `;
        this.errors = true;
      }
    }
    return this;
  }

  isNumeric(digits) {
    if (!this.errors && this.val != undefined && this.val != "") {
      if (
        !regexPattern.numPattern.test(this.val) &&
        this.val.length <= digits
      ) {
        this.errMsg = `${this.fieldName} should be number`;
        this.errors = true;
      }
    }
    return this;
  }

  isDate() {
    if (!this.errors && this.val != undefined) {
      if (!regexPattern.datePattern.test(this.val)) {
        this.errMsg = `${this.fieldName} should be date`;
        this.errors = true;
      }
    }
    return this;
  }

  isDecimal([digits, precision]) {
    if (this.val?.indexOf(".")) {
      let number = this.val?.split(".");
      if (number[0]?.length > digits && number[1]?.length > precision) {
        this.errMsg = `${this.fieldName} is not valid decimal number`;
        this.errors = true;
      }
    }
    return this;
  }

  getError() {
    if (this.errors) {
      return this.errMsg;
    }
    return false;
  }
}

export default app;
