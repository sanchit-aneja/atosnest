import { ContributionDetails } from '../models';
import ContributionHeader from '../models/contributionheader';

export class ContributionSubmissionsXmlController {

  async getContributionHeader(id: any): Promise<any> {
    const doc = await ContributionHeader.findAll({
      where: {
        contribHeaderId: id,
      },
    });

    return doc;
  }

  async generateXml(id: any): Promise<any> {
    let doc = {};

    const contributionHeader = await ContributionHeader.findAll({
      where: {
        contribHeaderId: id,
      },
    });

    const contributionDetails = await ContributionDetails.findAll({
      where: {
        contribHeaderId: id
      }
    });

    const isStreaming = contributionDetails.length < parseInt(process.env.contribution_MaxXmlLength);

    let data = {
        'header': {
            contrIfaceSeq: 0,
            groupSchemeId: '',
            subSchemeId: 1,
            payReference: 'BPG29247100',
            bpFrequency: 'M',
            contribDueDate: '2022-03-19',
            contrSubmType: 'N',
            noOfMemberUpd: 10,
            noOfContrUpd: 1,
            totContrAmt: 0.0,
            contrFileType: 'COM',
            submissionCode: 'A',
            mopType: 'DD',
            delayDdCollect: 'N',
            specialDealReference: '',
            pegaCasereference: 'pegaCase',
            scheduleReference: ''
        },
        'details': [
            {
                contrDetSeq: '',
                schemePayrlRef: '',
                superPolicyId: '',
                titleCode: '',
                partyForename: '',
                partyMiddleNm: '',
                partySurname: '',
                genderCode: 'F',
                partyDob: '1990-02-15',
                addrLine1: '',
                addrLine2: '',
                addrLine3: '',
                addrLine4: '',
                addrLine5: '',
                addrPostCode: '',
                countryCode: 'UK',
                emailAddress: '',
                Salary: 0,
                groupSchemeId: '',
                groupSchemeName: '',
                subSchemeId: '',
                subSchemeName: '',
                empCatId: '',
                membUpdType: 'N',
                schemeEnrlType: '1',
                enrlTypeEffectvDate: '',
                splitEnrolType: '',
                startDate: '',
                dateJoinedComp: '',
                schemeLeaveTyp: '',
                dateLeftScheme: '',
                reasonCode: '',
                laprStatus: '',
                contribDueDate: '',
                pensSalary: '',
                salarySacrifice: '',
                ptyInitials: '',
                niNo: '',
                defltInvestInd: '',
                EarningsTier: '',
                premiumHolidayAction: 'C',
                premiumHolidayStartDate: '',
                premiumHolidayEndDate: '',
                memberContrSalaryPercentage: '',
                employerContrSalaryPercentage: '',
                retirementAge: '',
                memberExcluded: '',
                temporaryAbsence: '',
                optOutReference: '',
                isWithinOptOutPeriod: '',
                optOutDateReceived: '',
                optOutManuallyReceived: '',
                schemeMembershipRef: '',
                jurisdictionId: '',
                frameworkId: '',
                memberEffectiveDate: '',
                splitCategoryType: '',
                contrTypeCode: 'CR',
                contribAmtMemb: '',
                contribAmtEmpr: '',
                fundContrType: '',
                ulFundCd: '',
                ulPremSplit: ''
            }
        ]
    }    

    doc = {
      header: contributionHeader,
      details: contributionDetails,
    }
    
    const result = {
      isStreaming: isStreaming,
      doc: doc,
      totalRecordCount: contributionDetails.length
    }

    return result;
  }


}
