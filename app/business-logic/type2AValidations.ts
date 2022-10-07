import { Context } from "@azure/functions"
import * as csvf from 'fast-csv';

const Type2AValidations = {
    /**
 * This is validate H row (first row of the file)
 * @param row
 * @param callback
 * @returns
 */
    rowHValidation: function (row, callback, index) {
        if(index !== 0){
            return null
        }
        if (row[0] !== 'H') {
            return  {
                code: "ID5",
                message : "Please ensure that the first record in your file is marked 'H', to show that it's the header."
            }
        }

        if(row[row.length - 1].toUpperCase() === 'Y'){
            return  {
                code: "ID8",
                message : "There are no detail records in your file. Please ensure there is at least one detail record identified with a 'D', between the header and trailer"
            }
        }

       return null;
    },

    /**
     * This will check current row is D row and return count of D rows back
     * @param row
     * @param countDRows
     * @returns return D rows count
     */
    isRowDValidation: function (row, countDRows:number){
        if(row[0] === "D"){
            countDRows = countDRows + 1;
        }
        return countDRows;
    },

    /**
     * This will return true or false based on if row is T row
     * @param row 
     * @returns true or false
     */
    isRowTValidation: function (row){
            return (row[0] === "T");
        },

    start: async function (readStream: NodeJS.ReadableStream, context: Context): Promise<any> {
        let trailerFound = false;
        let headers;
        let invalidResults = [];
        let results = []
        let countDRows = 0;
        let currentRowIndex = -1; // when process start it will increament
        let errorMessage = { code: '', message: '' };
        return new Promise(async function (resolve, reject) {
            try {   
            readStream
                .pipe(csvf.parse<any, any>({
                    ignoreEmpty: true,
                }))
                .validate((row: any, cb) => {
                    let errMsg;
                    currentRowIndex++;
                    if (trailerFound) {
                        errMsg = `Please ensure that the last record in your file is marked 'T', to show that it's the trailer.`;
                        errorMessage = {
                            code: "ID6",
                            message : errMsg
                        }
                        return cb(new Error(errMsg), false, errMsg);
                    }
                    
                    const headerRowError = Type2AValidations.rowHValidation(row, cb, currentRowIndex)
                    if (headerRowError !== null) {
                        errorMessage = headerRowError;
                        return cb(new Error(headerRowError.message), false, headerRowError.message);
                    } 
                    if(currentRowIndex === 0){
                        return cb(null, true, null);
                    }
                    trailerFound = Type2AValidations.isRowTValidation(row)
                    if(!trailerFound) { // Checking from T Row
                        const previousCount = countDRows;
                        countDRows = Type2AValidations.isRowDValidation(row, countDRows)
                        if(previousCount === countDRows){
                            errMsg = "Unknown record types found. Please ensure that all records, between the header and trailer, are marked with the letter 'D'. This tells us they contain member details."
                            errorMessage = {
                                code: "ID7",
                                message : errMsg
                            }
                            return cb(new Error(errMsg), false, errMsg);
                        }
                    }
    
                    if (trailerFound && countDRows === 0) {
                        errMsg = "There are no detail records in your file. Please ensure there is at least one detail record identified with a 'D', between the header and trailer, if you're unsure. "
                        errorMessage = {
                            code: "ID8",
                            message : errMsg
                        }
                        return cb(new Error(errMsg), false, errMsg);
                    }
    
                    return cb(null, true, null);
                }).on('headers', (row) => {
                    headers = row;
                })
                .on('data', (row) => {
                    results.push(row);
    
                })
                .on('data-invalid', (row, rowNumber) => {
                    invalidResults.push(row);
                    context.log(`Invalid [rowNumber=${rowNumber}] [row=${JSON.stringify(row)}]`);
                })
                .on('error', (e) => {
                    console.log('error');
                    reject([errorMessage]);
                })
                .on('end', (_e,) => {
                    if (!trailerFound) {
                        reject([{
                            code: "ID6",
                            message: "Please ensure that the last record in your file is marked 'T', to show that it's the trailer."
                        }]);
                        return;
                    }
                    let data = {
                        invalidResults: invalidResults,
                        results: results,
                        headers: headers
                    }
                    resolve(data);
                })
            }catch(e){
              reject(e);  
            } 
        })
    }
}


export default Type2AValidations;
