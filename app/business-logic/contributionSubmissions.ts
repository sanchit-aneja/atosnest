import ContributionHeader from '../models/contributionheader';

export class ContributionSubmissionsController {
  
    // associations in controller
    async getContributionHeader(id: any): Promise<any> {
      const doc = await ContributionHeader.findAll({
        where: {
          contribHeaderId: id,
        },
      });
  
      return doc;
    }
  

  }
  