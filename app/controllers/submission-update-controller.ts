import {
    Body,
    Get,
    Post,
    Put,
    Response,
    Route,
    Security,
    SuccessResponse,
} from "tsoa";
import Status from "../utils/config";
import app from "../utils/app";
import { ContributionDetails, ContributionHeaderSubmission } from '../models';
import { MemberContributionDetailsController } from './member-contribution-details-controller';


enum NonPayReason {
    MemberOptOut = "CON16",
    NoContributionsPayable = "CON10",
    InsufficientEarnings = "CON12",
    TransferPaymentSource = "CON13",
    ChangeMemberGroupAndPay = "CON14",
    PayForPreviousAndNewGroup = "CON15",
    ChangePaymentSourceAndGroup = "CON18",
    PayMoreThanOneEnrollmentType = "CON17",
    MemberFamilyLeave = "CON02"
};

enum ScheduleMemberStatusCode {
    NoContributionsDue = "MCS9"
};

@Route("/contribution")
export class ContributionSubmissionUpdatesController {


    async getContributionHeaderSubmission(submissionHeaderId: any): Promise<any> {
        try {
            const doc = await ContributionHeaderSubmission.findAll({
                where: {
                    submissionHeaderId: submissionHeaderId,
                },
            });

            if (doc !== null && doc.length > 0)
                return doc[0];
            else
                return null;

        } catch (err) {
            if (err) {
                return app.errorHandler(err);
            }
        }
    }

    async getContributionDetails(contribHeaderId: any): Promise<any> {
        try {
            const doc = await ContributionDetails.findAll({
                where: {
                    contribHeaderId: contribHeaderId,
                },
            });

            if (doc !== null && doc.length > 0)
                return doc;
            else
                return null;

        } catch (err) {
            if (err) {
                return app.errorHandler(err);
            }
        }
    }

    async getContributionDetail(contribDetailId: any): Promise<any> {
        try {
            const doc = await ContributionDetails.findOne({
                where: {
                    membContribDetlId: contribDetailId,
                },
            });

            if (doc !== null)
                return doc;
            else
                return null;

        } catch (err) {
            if (err) {
                return app.errorHandler(err);
            }
        }
    }

    async updateSubmissionMember(detail: any) {
        try {
            let record: any = {};
            switch (detail.membNonPayReason) {
                case NonPayReason.MemberOptOut:
                    record.schdlMembStatusCd = ScheduleMemberStatusCode.NoContributionsDue;
                    await ContributionDetails.update(record, { where: { membContribDetlId: detail.membContribDetlId } });
                    break;
                case NonPayReason.NoContributionsPayable:
                    if (detail.membContriAmt === '0.00') {
                        record.schdlMembStatusCd = ScheduleMemberStatusCode.NoContributionsDue;
                        await ContributionDetails.update(record, { where: { membContribDetlId: detail.membContribDetlId } });
                    }
                    break;
                case NonPayReason.InsufficientEarnings:
                    record.schdlMembStatusCd = ScheduleMemberStatusCode.NoContributionsDue;
                    await ContributionDetails.update(record, { where: { membContribDetlId: detail.membContribDetlId } });
                    break;
                case NonPayReason.TransferPaymentSource:
                    if (detail.membContriAmt === '0.00') {
                        record.schdlMembStatusCd = ScheduleMemberStatusCode.NoContributionsDue;
                        await ContributionDetails.update(record, { where: { membContribDetlId: detail.membContribDetlId } });
                    }
                    break;
                case NonPayReason.ChangeMemberGroupAndPay:
                    if (detail.membContriAmt === '0.00') {
                        record.schdlMembStatusCd = ScheduleMemberStatusCode.NoContributionsDue;
                        await ContributionDetails.update(record, { where: { membContribDetlId: detail.membContribDetlId } });
                    }
                    break;
                case NonPayReason.PayForPreviousAndNewGroup:
                    break;
                case NonPayReason.ChangePaymentSourceAndGroup:
                    if (detail.membContriAmt === '0.00') {
                        record.schdlMembStatusCd = ScheduleMemberStatusCode.NoContributionsDue;
                        await ContributionDetails.update(record, { where: { membContribDetlId: detail.membContribDetlId } });
                    }
                    break;
                case NonPayReason.MemberFamilyLeave:
                    if (detail.membContriAmt === '0.00') {
                        record.schdlMembStatusCd = ScheduleMemberStatusCode.NoContributionsDue;
                        await ContributionDetails.update(record, { where: { membContribDetlId: detail.membContribDetlId } });
                    }
                    break;
            }
        } catch (err) {
            console.log(err);
        }

    }

    /**
    * 5405 API Catalogue Number
    * Update submission members
    * @param submissionHeaderId is the Contribution Submission Header id
    * @return Returns count of submitted, members in schedule and unsubmitted.
    */
    @Security("api_key")
    @Put("submission/update-submission/{submissionHeaderId}")
    @SuccessResponse("200", Status.SUCCESS_MSG)
    @Response("400", Status.BAD_REQUEST_MSG)
    @Response("404", Status.NOT_FOUND_MSG)
    @Response("500", Status.FAILURE_MSG)
    async updateSubmissionMembers(submissionHeaderId: any): Promise<any> {
        try {
            // get the submission
            const submission = await this.getContributionHeaderSubmission(submissionHeaderId);
            const contribHeaderId = submission.contribHeaderId;

            // get the submitted details
            const memberContributionSubmissionsController = new MemberContributionDetailsController();
            const memberContributionSubmissions = await memberContributionSubmissionsController.getMemberContributionSubmission(submission.submissionHeaderId);

            for (const membercontributionsubmission of memberContributionSubmissions.results) {
                // get the member details
                const detail = await this.getContributionDetail(membercontributionsubmission.membContribDetlId);
                this.updateSubmissionMember(detail);
            }

            // get total members
            const contributionDetails = await this.getContributionDetails(contribHeaderId);

            const result = {
                CountSumbitted: memberContributionSubmissions.results.length,
                // CountRowsSubmitted: details.length,
                CountMembersInSchedule: contributionDetails.length,
                CountUnsubmitted: contributionDetails.length - memberContributionSubmissions.results.length
            };

            return result;
        } catch (err) {
            if (err) {
                return app.errorHandler(err);
            }
        }
    }

}
