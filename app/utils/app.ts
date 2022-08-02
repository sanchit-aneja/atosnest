import * as moment from "moment";
import { Model, Op } from "sequelize";
import * as csvf from 'fast-csv';
import { regexPattern } from './constants';
import Status from "../utils/config";
import { CustomError } from "../Errors";

const app = {
  DEFAULT_DATE_FORMAT: "YYYY-MM-DD",
  DEFAULT_TIME_FORMAT: "HH:mm:ss",
  loggedUser: "Admin",
  DEFAULT_LIMIT: 20,
  DEFAULT_OFFSET: 0,
  DEFAULT_EFFECTIVE_START_DATE: "1970-01-01",
  DEFAULT_EFFECTIVE_END_DATE: "9999-12-31",

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
    return String(num).padStart(totalLength, '0');
  },

  getFileName(subject: string) {
    return subject.split('blobs/')[1].replace(/\d$/, '');
  },

  getFileTimeStamp(time: string) {
    let str = time;
    return time.split("_")[3].substring(0, str.length - 4);
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
      }
    };
  },

  mappingContributionHeader(request): any {
    try {
      let results = [];
      Object.entries(request).forEach(([key, value]: any) => {
        let params = {};
        params = {
          nestScheduleReference: 'CS' + (value._previousDataValues.premFrequency).trim() + moment(value._previousDataValues.endDate).format("DDMMYYYY") + this.addLeadingZeros(parseInt(key) + 1, 3),
          externalScheduleReference: value._previousDataValues.scheduleReference,
          scheduleType: value._previousDataValues.scheduleType,
          scheduleStatusCd: 'CS1',
          scheduleGenerationDate: value._previousDataValues.effectiveDate,
          employerNestId: value._previousDataValues.groupSchemeID,
          groupSchemeID: value._previousDataValues.groupSchemeID,
          subSchemeId: value._previousDataValues.subSchemeId,
          earningsPeriodStartDate: value._previousDataValues.startDate,
          earningsPeriodEndDate: value._previousDataValues.endDate,
          paymentPlanNo: value._previousDataValues.paymentPlanNo,
          paymentReference: value._previousDataValues.payReference,
          paymentSourceName: value._previousDataValues.paymentSourceName || 'paymentSourceName',
          paymentMethod: value._previousDataValues.mopType,
          paymentMethodDesc: value._previousDataValues.mopTypeDesc,
          paymentFrequency: value._previousDataValues.premFrequency,
          paymentFrequencyDesc: value._previousDataValues.premFrequencyDesc,
          taxPayFrequencyInd: value._previousDataValues.taxPeriodFreqInd,
          futurePaymentDate: '9999-12-12',
          paymentDueDate: value._previousDataValues.paymentDueDate,
          pegaCaseReference: 'pegaCase',
          totContrAmt: 0,
          recordStartDate: value._previousDataValues.recordStartDate,
          recordEndDate: value._previousDataValues.recordEndDate,
          createdBy: value._previousDataValues.createdBy,
          updatedBy: ''
        }
        results.push(params);
      });
      return results;
    } catch (e) {
      throw new CustomError("MAPPING_CONTRIBUTION_HEADER_FAILED", e)
    }
  },

  async getCSVDataFromReadStream(readStream: NodeJS.ReadableStream, columns: string[], formats: Array<Array<any>>): Promise<Array<any>> {
    let results = [];
    let errorMessage = { name: '', message: '' };
    return new Promise(function (resolve, reject) {
      readStream
        .pipe(csvf.parse<any, any>({
          headers: columns, renameHeaders: true, ignoreEmpty: true
        }))
        .validate((row, cb): void => {
          const result = app.validateFields(row, formats);
          if (!result[1]) {
            return cb(result[0], result[1], result[2]);
          } else {
            return cb(result[0], result[1]);
          }
        })
        .on('data', (row) => {
          results.push(row);
        })
        .on('data-invalid', (row, rowNumber, reason) => {
          errorMessage.name = "Invalid Data";
          errorMessage.message = `Invalid [rowNumber=${rowNumber}] [row=${JSON.stringify(row)}] [reason=${reason}]`;
          reject(errorMessage);
        })
        .on('error', (e) => {
          errorMessage.name = "Column Mismatch";
          errorMessage.message = e.message;
          reject(errorMessage);
        })
        .on('end', (_e) => {
          resolve(results);
        })
    })
  },

  validateFields(rowData: string, formats: any): any {
    let errMsg: string | false;
    let iterator = formats.values();
    for (const format of iterator) {
      let fieldData = rowData[format[0]];
      switch (format[1]) {
        case 'VARCHAR':
          errMsg = new fieldVal(fieldData, format).isNotEmpty().isAlphaNumeric(format[3]).getError();
          if (errMsg) {
            return [null, false, errMsg];
          }
          break;
        case 'NUMBER':
          errMsg = new fieldVal(fieldData, format).isNumeric(format[3]).getError();
          if (errMsg) {
            return [null, false, errMsg];
          }
          break;
        case 'DECIMAL':
          errMsg = new fieldVal(fieldData, format).isDecimal(format[3]).getError()
          if (errMsg) {
            return [null, false, errMsg];
          }
          break;
        case 'DATE':
          errMsg = new fieldVal(fieldData, format).isDate().getError();
          if (errMsg) {
            return [null, false, errMsg];
          }
          break;
      }
    }
    return [null, true];
  }

}

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
    this.errMsg = '';
    this.errors = false;
    this.fieldName = format[0];
    this.required = format[2];
    this.limits = format[3];
    this.datatype = format[1];
  }

  isNotEmpty() {
    if (!this.errors && this.required && (this.val === '' || this.val == null || this.val == undefined)) {
      this.errMsg = `${this.fieldName} is empty`
      this.errors = true;
    }
    return this;
  }

  isAlphaNumeric(length) {
    if (!this.errors && this.val != undefined) {
      if (!regexPattern.alphaNumPattern.test(this.val) || this.val?.length > length) {
        this.errMsg = `${this.fieldName} is should be alphanumeric & max ${length} chars`;
        this.errors = true;
      }
    }
    return this;
  }

  isNumeric(digits) {
    if (!this.errors && this.val != undefined) {
      if (!regexPattern.numPattern.test(this.val) && this.val.length <= digits) {
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
    if (this.val?.indexOf('.')) {
      let number = this.val?.split('.');
      if ((number[0]?.length <= digits) && (number[1]?.length <= digits) && (number[1]?.length <= precision)) {
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
