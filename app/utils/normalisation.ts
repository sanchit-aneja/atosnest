import sequelize from "./database";
import { CustomError } from "../Errors";

const normalisation = {

  moveDataToContributionHeader: async function (transaction, context, fileId): Promise<any> {
    try {
      const schema = process.env.contribution_DBSchema;
      const results = await sequelize.query(`INSERT INTO ${schema}."Contribution_Header"
      (file_id,nest_schedule_ref,external_schedule_ref,schedule_type,schedule_status_cd,schedule_generation_date,employer_nest_id,group_scheme_id,sub_scheme_id,earning_period_start_date,earning_period_end_date,payment_plan_no,payment_ref,payment_source_name,payment_method,payment_method_desc,payment_frequency,payment_frequency_desc,tax_pay_frequency_ind,future_payment_date,payment_due_date,pega_case_ref,no_of_membs,tot_schedule_amt,orig_schedule_ref,record_start_date,record_end_date,created_by,updated_by,last_updated_timestamp)
          Select
          '${fileId}' as fileId,
          ROW_NUMBER() OVER (ORDER BY (SELECT 1)) as nestScheduleRef,
          sch.schedule_reference as externalScheduleRef,
          sch.schedule_type as scheduleType,
          'CS1' as scheduleStatusCd,
          sch.effective_date as scheduleGenerationDate,
          sch.group_scheme_id as employerNestId,
          sch.group_scheme_id as groupSchemeId,
          sch.sub_scheme_id as subSchemeId,
          sch.start_date as earningPeriodStartDate,
          sch.end_date as earningPeriodEndDate,
          sch.payment_plan_no as paymentPlanNo,
          sch.pay_reference as paymentRef,
          'paymentSourceName' as paymentSourceName,
          sch.mop_type as paymentMethod,
          sch.mop_type_desc as paymentMethodDesc,
          sch.prem_frequency as paymentFrequency,
          sch.prem_frequency_desc as paymentFrequencyDesc,
          sch.tax_period_freq_ind as taxPayFrequencyInd, 
          '9999-12-12' as futurePaymentDate,
          sch.payment_due_date as paymentDueDate,
          '' as pegaCaseRef,
          sch.number_of_members as noOfMembs,
          0 as totScheduleAmt,
          '' as origScheduleRef,
          sch.record_start_date as recordStartDate,
          sch.record_end_date as recordEndDate,
          sch.created_by as createdBy,
          '' as updatedBy,
          CURRENT_TIMESTAMP as last_updated_timestamp
      FROM ${schema}."Stg_Contr_Sch" sch;
      `, { transaction })
      context.log("Contribution_Header-> Number Rows going insert : ", results);
      return results[1];
    } catch (error) {
      context.log("normalisation::moveDataToContributionHeader::", error)
      throw new CustomError("BULK_INSERT_CONTRIBUTION_HEADER_FAILED", `${error?.name - error?.message - error?.moreDetails}`);
    }
  },

  moveDataToMemberContributionDetails: async function (transaction, context) {
    try {
      const schema = process.env.contribution_DBSchema;
      const results = await sequelize.query(`INSERT INTO ${schema}."Member_Contribution_Details"
      (nest_schedule_ref, memb_enrolment_ref, memb_contri_due_date, memb_plan_ref, emp_group_id, group_name, schdl_memb_status_cd, memb_party_id, scm_party_id, nino, alternative_id, last_paid_pens_earnings, last_paid_reason_code, last_paid_empl_contri_amt, last_paid_memb_contri_amt, auto_calc_flag, memb_non_pay_reason,channel_type, created_by, updated_by, last_updated_timestamp)
          Select
          ROW_NUMBER() OVER (ORDER BY (SELECT 1)) as nestScheduleRef,
          mem.membership_id as membEnrolmentRef,
          ch.earning_period_end_date as membContriDueDate,
          mem.plan_reference as membPlanRef,
          mem.category as empGroupId,
          ch.group_scheme_id as groupName,
          'MS1' as schdlMembStatusCd,
          mem.crm_party_id as membPartyId,
          mem.cm_party_id as scmPartyId,
          mem.nino as nino,
          mem.scheme_payroll_reference as alternativeID,
          mem.pensionable_salary as lastPaidPensEarnings,
          mem.reason_code as lastPaidReasonCode,
          er_pol.last_paid_amount as lastPaidEmplContriAmt,
          mr_pol.last_paid_amount as lastPaidMembContriAmt,
          'Y' as autoCalcFlag,
          'RN' as membNonPayReason,
          'WEB' as channelType,
          'SYSTEM' as createdBy,
          'SYSTEM' as updatedBy,
          CURRENT_TIMESTAMP as lastUpdatedTimestamp
      FROM ${schema}."Stg_Contr_Mem" mem
      JOIN ${schema}."Contribution_Header" ch on ch.external_schedule_ref = mem.schedule_reference
      LEFT JOIN ${schema}."Stg_Contr_Policy" er_pol on TRIM(er_pol.membership_id) = TRIM(mem.membership_id)
          AND TRIM(er_pol.schedule_reference) = TRIM(mem.schedule_reference)
          AND er_pol.regular_contribution_type = 'ER'
      LEFT JOIN ${schema}."Stg_Contr_Policy" mr_pol on TRIM(mr_pol.membership_id) = TRIM(mem.membership_id)
          AND TRIM(mr_pol.schedule_reference) = TRIM(mem.schedule_reference)
          AND mr_pol.regular_contribution_type = 'MR';
      `, { transaction })
      context.log("Member_Contribution_Details-> Number Rows going insert : ", results)
    } catch (error) {
      context.log("normalisation::moveDataToMemberContributionDetails::", error)
      throw new CustomError("BULK_INSERT_MEMBER_CONTRIBUTION_DETAILS_FAILED", `${error?.name - error?.message - error?.moreDetails}`);
    }
  }
};

export default normalisation;