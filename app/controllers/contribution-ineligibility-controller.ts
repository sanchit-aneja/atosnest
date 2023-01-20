import { Put, Response, Route, Security, SuccessResponse } from "tsoa";
import ContributionHeader from "../models/contributionheader";
import ContributionDetails from "../models/contributionDetails";
import Status from "../utils/config";
import app from "../utils/app";
import sequelize from "../utils/database";
import { Op } from "sequelize";
import { ContributionUpdateIneligibilityResponse } from "../schemas/response-schema";
import * as moment from "moment";

@Route("/contribution")
export class ContributionIneligibilityController {
  /**
   * 5803 API Catalogue Number
   * Update Ineligibility
   * @param membEnrolmentRef membEnrolmentRef of the Member Contribution Details record to be fetched
   * @param ineligibilityReason ineligibilityReason “opt out”,“leaver”, “member exited”, “de enroled” and “member changed”
   * @param effectiveDate effective date parameter is less than the corresponding contribution_header.earning_period_start_date
   * @return Success
   */
  @Security("api_key")
  @Put(
    "updateIneligibility/membEnrolRef={membEnrolmentRef}&IneligibilityReason={ineligibilityReason}&EffectiveDate={effectiveDate}"
  )
  @SuccessResponse("200", Status.SUCCESS_MSG)
  @Response("400", Status.BAD_REQUEST_MSG)
  @Response("404", Status.NOT_FOUND_MSG)
  @Response("500", Status.FAILURE_MSG)
  async updateIneligibility(
    membEnrolmentRef: string,
    ineligibilityReason: string,
    effectiveDate: string
  ): Promise<ContributionUpdateIneligibilityResponse | any> {
    try {
      return await sequelize.transaction(async (t) => {
        const whereCdn = {
          [Op.and]: [
            {
              memb_enrolment_ref: membEnrolmentRef,
            },
            {
              [Op.or]: {
                schdl_memb_status_cd: ["MCS1", "MCS2", "MCS3"],
              },
            },
          ],
        };
        const contribDetailsData = await ContributionDetails.findAll({
          where: whereCdn,
          transaction: t,
        });

        if (
          ineligibilityReason.toLowerCase() === "opt out" &&
          contribDetailsData.length > 0
        ) {
          await ContributionDetails.update(
            {
              schdlMembStatusCd: "MCS4",
            },
            {
              where: whereCdn,
            }
          );
        } else {
          for (let i of contribDetailsData) {
            const contribHeaderData = await ContributionHeader.findOne({
              where: {
                [Op.and]: [
                  {
                    earningPeriodStartDate: {
                      [Op.gt]: moment(effectiveDate).toISOString(),
                    },
                  },
                  {
                    contribHeaderId: i["dataValues"].contribHeaderId,
                  },
                ],
              },
            });
            if (
              ineligibilityReason.toLowerCase() === "de enrolled" &&
              contribHeaderData &&
              contribDetailsData.length > 0
            ) {
              await ContributionDetails.update(
                {
                  schdlMembStatusCd: "MCS5",
                },
                {
                  where: {
                    [Op.and]: [
                      {
                        memb_enrolment_ref: membEnrolmentRef,
                      },
                      {
                        contribHeaderId: i["dataValues"].contribHeaderId,
                      },
                      {
                        [Op.or]: {
                          schdl_memb_status_cd: ["MCS1", "MCS2", "MCS3"],
                        },
                      },
                    ],
                  },
                }
              );
            } else if (
              ineligibilityReason.toLowerCase() === "leaver" &&
              contribHeaderData &&
              contribDetailsData.length > 0
            ) {
              await ContributionDetails.update(
                {
                  schdlMembStatusCd: "MCS6",
                },
                {
                  where: {
                    [Op.and]: [
                      {
                        memb_enrolment_ref: membEnrolmentRef,
                      },
                      {
                        contribHeaderId: i["dataValues"].contribHeaderId,
                      },
                      {
                        [Op.or]: {
                          schdl_memb_status_cd: ["MCS1", "MCS2", "MCS3"],
                        },
                      },
                    ],
                  },
                }
              );
            } else if (
              ineligibilityReason.toLowerCase() === "member changed" &&
              contribHeaderData &&
              contribDetailsData.length > 0
            ) {
              await ContributionDetails.update(
                {
                  schdlMembStatusCd: "MCS7",
                },
                {
                  where: {
                    [Op.and]: [
                      {
                        memb_enrolment_ref: membEnrolmentRef,
                      },
                      {
                        contribHeaderId: i["dataValues"].contribHeaderId,
                      },
                      {
                        [Op.or]: {
                          schdl_memb_status_cd: ["MCS1", "MCS2", "MCS3"],
                        },
                      },
                    ],
                  },
                }
              );
            } else if (
              ineligibilityReason.toLowerCase() === "member exited" &&
              contribHeaderData &&
              contribDetailsData.length > 0
            ) {
              await ContributionDetails.update(
                {
                  schdlMembStatusCd: "MCS8",
                },
                {
                  where: {
                    [Op.and]: [
                      {
                        memb_enrolment_ref: membEnrolmentRef,
                      },
                      {
                        contribHeaderId: i["dataValues"].contribHeaderId,
                      },
                      {
                        [Op.or]: {
                          schdl_memb_status_cd: ["MCS1", "MCS2", "MCS3"],
                        },
                      },
                    ],
                  },
                }
              );
            }
          }
        }
        if (contribDetailsData?.length) {
          return contribDetailsData;
        } else {
          return Status.BAD_REQUEST;
        }
      });
    } catch (err) {
      if (err) {
        return app.errorHandler(err);
      }
    }
  }

  async getUpdatedMemberData(membEnrolmentRef) {
    const resultData = await ContributionDetails.findAll({
      where: {
        memb_enrolment_ref: membEnrolmentRef,
      },
      attributes: [
        ["contrib_header_id", "contribScheduleId"],
        "schdlMembStatusCd",
      ],
    });
    return { IneligibleSchedules: resultData };
  }
}
