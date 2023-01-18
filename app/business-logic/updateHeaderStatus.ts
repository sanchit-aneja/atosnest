import { ContributionDetails, ContributionHeader } from "../models";

import { Op } from "sequelize";

export const updateHeaderStatus = {
  /**
   * Validate Header Id
   * @param contribHeaderId
   */
  ValidateAndGetHeaderId: async function (contribHeaderId) {
    const dataHeaderRow: ContributionHeader = await ContributionHeader.findOne({
      where: { contrib_header_id: contribHeaderId },
    });

    if (dataHeaderRow) {
      return dataHeaderRow;
    }

    return null;
  },
  /**
   * Validate Header Id
   * @param contribHeaderId
   */
  GetStatusCD: async function (contribHeaderId) {
    const dataDetailRows = await ContributionDetails.findAll({
      where: {
        contrib_header_id: contribHeaderId,
        schdlMembStatusCd: {
          [Op.notIn]: ["MCS0", "MCS17", "MCS8", "MCS7", "MCS6", "MCS5", "MCS4"],
        },
      },
      attributes: ["contribHeaderId", "schdlMembStatusCd"],
    });

    const scheduleStatusMCS1 = dataDetailRows.every((elem: any) => {
      if (elem.schdlMembStatusCd === "MCS1") return true;
    });
    if (scheduleStatusMCS1) return "CS2";

    const scheduleStatusMCS3 = dataDetailRows.every((elem: any) => {
      if (elem.schdlMembStatusCd === "MCS3") return true;
    });
    if (scheduleStatusMCS3) return "CS3";

    const scheduleStatusMCS2 = dataDetailRows.every((elem: any) => {
      if (elem.schdlMembStatusCd === "MCS2") return true;
    });
    if (scheduleStatusMCS2) return "CS4";

    const scheduleStatusMCS10 = dataDetailRows.every((elem: any) => {
      if (elem.schdlMembStatusCd === "MCS10") return true;
    });
    if (scheduleStatusMCS10) return "CS5";

    const scheduleStatusMCS9 = dataDetailRows.every((elem: any) => {
      if (elem.schdlMembStatusCd === "MCS9") return true;
    });
    if (scheduleStatusMCS9) return "CS10";

    const scheduleStatusMCS16 = dataDetailRows.every((elem: any) => {
      if (elem.schdlMembStatusCd === "MCS16") return true;
    });
    if (scheduleStatusMCS16) return "CS7";

    const scheduleStatusMCS12 = dataDetailRows.every((elem: any) => {
      if (elem.schdlMembStatusCd === "MCS12") return true;
    });
    if (scheduleStatusMCS12) return "CS8";

    const scheduleStatusMCS13 = dataDetailRows.every((elem: any) => {
      if (elem.schdlMembStatusCd === "MCS13") return true;
    });
    if (scheduleStatusMCS13) return "CS10";

    const scheduleStatusMCS3Some = dataDetailRows.some((elem: any) => {
      if (elem.schdlMembStatusCd === "MCS3") return true;
    });
    if (scheduleStatusMCS3Some) return "CS3";

    const scheduleStatusMCS2Some = dataDetailRows.some((elem: any) => {
      if (elem.schdlMembStatusCd === "MCS2") return true;
    });
    if (scheduleStatusMCS2Some) return "CS4";

    const scheduleStatusMCS16Some = dataDetailRows.some((elem: any) => {
      if (elem.schdlMembStatusCd === "MCS16") return true;
    });
    if (scheduleStatusMCS16Some) return "CS7";
    const scheduleStatusMCS10Some = dataDetailRows.some((elem: any) => {
      if (elem.schdlMembStatusCd === "MCS10") return true;
    });
    const scheduleStatusMCS9Some = dataDetailRows.some((elem: any) => {
      if (elem.schdlMembStatusCd === "MCS9") return true;
    });
    const scheduleStatusMCS12Some = dataDetailRows.some((elem: any) => {
      if (elem.schdlMembStatusCd === "MCS12") return true;
    });
    //if mcd rows in “submitted” status AND (rows exist in “no contributions due” OR “processing payment”) then set header status to “Submitted
    if (
      scheduleStatusMCS10Some &&
      (scheduleStatusMCS9Some || scheduleStatusMCS12Some)
    )
      return "CS5";

    const scheduleStatusMCS13Some = dataDetailRows.some((elem: any) => {
      if (elem.schdlMembStatusCd === "MCS13") return true;
    });
    //if mcd rows in “no contribs due” OR “paid” then set header status to “Paid”
    if (scheduleStatusMCS9Some || scheduleStatusMCS13Some) return "CS10";

    const scheduleStatusMCS1Some = dataDetailRows.some((elem: any) => {
      if (elem.schdlMembStatusCd === "MCS1") return true;
    });

    //if mcd rows in “to be reviewed” status AND (rows exist in “submitted” OR “processing payment”) then set header status to “partially submitted”

    if (
      scheduleStatusMCS1Some &&
      (scheduleStatusMCS10Some || scheduleStatusMCS12Some)
    )
      if (scheduleStatusMCS12Some && scheduleStatusMCS13Some)
        //if mcd rows in “processing payment” and “paid” (ie all rows in one of those two) then set header status to “processing payment”
        return "CS8";

    //if mcd rows in “to be reviewed” and “paid” (ie all rows in one of those two) then set header status to “partially paid”
    if (scheduleStatusMCS1Some && scheduleStatusMCS13Some) return "CS9";

    //if mcd rows in “submitted”and “paid” then set header status to “partially paid”
    if (scheduleStatusMCS10Some && scheduleStatusMCS13Some) return "CS9";

    return "CS6";
    return null;
  },
  /**
   * UpdateandGetResult
   * @param contribHeaderId
   * @param contribHeaderId
   */
  UpdateandGetResult: async function (contribHeaderId: any, status) {
    return new Promise(async (resolve, reject) => {
      await ContributionHeader.update(
        {
          scheduleStatusCd: status,
        },
        {
          where: { contrib_header_id: contribHeaderId },
          returning: true,
        }
      )
        .then(function (result) {
          resolve(result[1]);
        })
        .catch(function (error) {
          console.log(error);
          reject(error);
        });
    });
  },
};
