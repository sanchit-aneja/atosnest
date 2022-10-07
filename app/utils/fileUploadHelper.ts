import sequelize from "sequelize";
import { Op } from "sequelize";
import { Sequelize } from "sequelize/types";
import { ContributionDetails } from "../models";
// import {} from Sequelize;

const FileUploadHelper = {

    
    getAllRecordsFromNinoAlt: async function(obj: any){
        try {
            const rows = await ContributionDetails.findAll({
                where:{
                    [Op.or]:[{
                        nino:{
                            [sequelize.Op.in]: obj.ninos.join() 
                        }
                    },
                    {
                        alternativeId:{
                            [sequelize.Op.in]: obj.alts.join()
                        }
                    }] 
                    }
                })

            return rows;
        } catch (error) {
            console.log('Failed to retrieve records ', error);
            throw new Error('Failed to retrieve records');
        }

    },

    checkRecordValid: async function(member:any){
        try {
            let whereClause ={}; 
            if(member.nino){
                whereClause['nino'] = member.nino; 
            }
            if(member.alt){
                whereClause['alternative_id'] = member.alt;
            }

            if(member.nino && member.alt){
                whereClause =  {
                    [Op.or]:[
                        {nino: member.nino}, 
                        {alternative_id: member.alt}
                    ]
                }
            }

            const rows = await ContributionDetails.findAll({
                where:whereClause
            })
            return rows;            
        } catch (error) {
            console.log("Error while checking", error);
            throw new Error('Failed to check record');
        }

    }

}

export default FileUploadHelper;