import { Context } from "@azure/functions"
import * as csvf from 'fast-csv';
import { FileUploadHelper } from "../utils";
import commonContributionDetails from "./commonContributionDetails";

 const Type2CValidations = {
     /**
     * Check value is null, undefined or empty
     * @param value
     * @returns bool if value is null or empty return true
     */
      isNullOrEmpty: function (value: any) {
        if (
            value == undefined ||
            value == null ||
            value == ""
        ) {
            return true;
        } else {
            return false;
        }
    },
    ninos:[],
    alts:[],
    isNinoFormatted: function(value: string){
       if(!(/[^DFIQUV]/.test(value.charAt(0)))){
            return false; 
       }
       if(!(/[^DFIOQUV]/.test(value.charAt(1)))){
        return false;
       }
       if(!(/[ABCD]/.test(value.charAt(value.length-1)))){
        return false;
       }
       if(!(/[^(GB)(BG)(NK)(KN)(TN)(NT)(ZZ)]+/.test(value.slice(0,2)))){
        return false;
       }
       return true;
    },

    rules:{

        "isNinoAltValid": async (row: any, context: Context) => {
            const validationError = {
                code: "ID17",
                message: "Please ensure your record has valid nino."
            }
            try {
                let nino= row.nino;
                let alt = row.alternativeId;
                const ninoRegex = /[(A-Za-z0-9)]\w+/;
                const altRegex = /[A-Za-z0-9"‘#$%&\(\)\[\]{}\-\*\+.:\\/=?@!_\s]+/; 
                let isNinoEmpty = Type2CValidations.isNullOrEmpty(nino);
                let isAltEmpty = Type2CValidations.isNullOrEmpty(alt)
                let ninoValid = false;
                let altValid = false;
                
                if(isNinoEmpty && isAltEmpty){
                    return {
                        code: "ID17",
                        message: "The NINO and ALT ID have not been entered"
                    }
                }

                if(!isNinoEmpty){
                    ninoValid = ninoRegex.test(nino);
                }
                if(!isAltEmpty){
                    altValid = altRegex.test(alt);
                }
                if((!ninoValid && !altValid) ){ 

                    return {
                        code: "ID18",
                        message: "The NINO or ALT ID or both have invalid characters"
                    }
                    
                }

                if(ninoValid && !Type2CValidations.isNinoFormatted(nino)){
                    return {
                        code: "ID19",
                        message: "Nino has incorrect format"
                    }
                }

                if(nino === alt){
                    return {
                        code: "ID20.0",
                        message: "the members NINO and/or ALT ID is identical"
                    }
                }
                
                let isNinoExist = (!isNinoEmpty && Type2CValidations.ninos.indexOf(nino)>-1);
                let isAltExist = (!isAltEmpty && Type2CValidations.alts.indexOf(alt)>-1)
                if( isNinoExist || isAltExist  ) {
                    return {
                        code:"ID20.1",
                        message: "the members NINO and/or ALT ID matches to > 1 member in the CS the file is being uploaded for"
                    }
                }

                const members = await FileUploadHelper.checkRecordValid({
                    nino: nino, 
                    alt: alt
                })


                if(members.length > 1){
                    return {
                        code: "ID20.1",
                        message: "the members NINO and/or ALT ID matches to > 1 member in the CS the file is being uploaded for"
                    }
                }
                if(ninoValid && altValid ){
                    if(members[0]["nino"] != nino || members[0]["alternativeId"] != alt){
                        return {
                            code: "ID20.1",
                            message: "the nino and alt does not match the record"
                        }
                    }
                }
                               
                if(!isNinoEmpty){
                    Type2CValidations.ninos.push(nino);
                }
                if(!isAltEmpty){
                    Type2CValidations.alts.push(alt);
                }
                return null;

            } catch (error) {
                context.log(`Nino and Alt id failed :  error message ${error.message}`);
                return validationError;
            }
            
        },

        "isFirstNameValid": async (row: any, context:Context )=>{
            const firstName = row.firstName;
            const regex = /([A-Za-z])\w+/;

            if(!Type2CValidations.isNullOrEmpty(firstName) && !regex.test(firstName)){
                 return {
                    code:"ID18.1",
                    message: "the first name contains invalid characters"
                };
            }

        },

        "isLastNameValid": async (row: any)=>{
            const lastName = row.lastName;
            const regex = /([A-Za-z])\w+/;
            
            if(!Type2CValidations.isNullOrEmpty(lastName) && !regex.test(lastName)){
                 return {
                    code:"ID18.2",
                    message: "the last name contains invalid characters"
                };
            }

        },
    },

    executeRulesOneByOne: async (row:any, context:Context, errors:Array<Object>, rowIndex: Number)=>{
        for (const key in Type2CValidations.rules) {
            const validationFunc = Type2CValidations.rules[key];
            const validationErrors = await validationFunc(row, context);
            if (validationErrors) {
                validationErrors.row = row;
                validationErrors.rowIndex = rowIndex;
                errors.push(validationErrors)
            }
        }
        return errors;
    },
    

    start: async function (readStream: NodeJS.ReadableStream, context: Context): Promise<any> {

        let results = [];
        let currentRowIndex = -1; 
        let errorMessages = [];
        return new Promise(async function (resolve, reject) {
            try {   
            readStream
                .pipe(csvf.parse<any, any>({
                    ignoreEmpty: true,
                }))
                .validate(async (row: any, cb) => {
                
                    currentRowIndex++; 
                    if(currentRowIndex==0){
                        Type2CValidations.alts=[];
                        Type2CValidations.ninos=[];
                    }
                    if(currentRowIndex>0 && row[0].trim()==='D'){
                        const memberDetails= commonContributionDetails.convertToContributionDetails(row, {}, false);
                        await Type2CValidations.executeRulesOneByOne(memberDetails, context, errorMessages, currentRowIndex);
                        
                        return cb(null, true, null);

                    }           
                    return cb(null, true, null);
                }).on('headers', (row) => {

                })
                .on('data', (row) => {
                    context.log(row);
                    results.push(row);
    
                })
                .on('data-invalid', (row, rowNumber) => {
                    context.log(row);

                })
                .on('error', (e) => {
                    context.log(`Error Type 2C : ${e.message}`);
                    const error = {
                        code: "ID9999",
                        message: "Someting went wrong"
                    }
                    errorMessages.push(error);
                    reject(errorMessages);
                })
                .on('end', async (_e,) => {
                    if (errorMessages.length > 0){
                        reject(errorMessages);
                        return;
                    }
                    try {
                        const rows =  await FileUploadHelper.getAllRecordsFromNinoAlt({alts: Type2CValidations.alts, ninos: Type2CValidations.ninos})
                    
                        if(rows.length>0){
                            return {
                                code:"ID20.1",
                                message: "the members NINO and/or ALT ID matches to > 1 member in the CS the file is being uploaded for"
                            }
                       }
                    } catch (error) {
                        return {
                            code:"9999",
                            message: "Something went wrong"
                        }
                    }

                    let data = {
                        results: results,
                    }
                    resolve(data);
                })
            }catch(e){
              reject(e);  
            } 
        })
    }
}

export default Type2CValidations;