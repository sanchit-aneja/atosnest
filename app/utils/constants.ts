export const errorDetails = {
  CIA0500: ["CIA-0500", "Data item missing"],
  CIA0501: ["CIA-0501", "Unique reference already exists"],
  CIA0502: ["CIA-0502", "Invalid data format"],
  CIA0503: ["CIA-0503", "Unique reference does not exists"],
  CIA0600: ["CIA-0600", "Validation failed on request data"],
  CIA0601: ["CIA-0601", "One or more membContribDetlId not found"],
  CIA0602: ["CIA-0602", "Something went wrong, update fails"],
  CIA0603: ["CIA-0603", "One or more contribHeaderId not found"],
  CIA0604: ["CIA-0604", "Member Schedule Status Error"],
};
export const joiOption = {
  abortEarly: false, // include all errors
  allowUnknown: true, // ignore unknown props
  stripUnknown: true, // remove unknown props
};

export const headerColumns = [
  "scheduleReference",
  "groupSchemeID",
  "subSchemeId",
  "subSchemeName",
  "effectiveDate",
  "scheduleType",
  "paymentPlanNo",
  "payReference",
  "paymentSourceName",
  "paymentDueDate",
  "startDate",
  "endDate",
  "mopType",
  "mopTypeDesc",
  "premFrequency",
  "premFrequencyDesc",
  "taxPeriodFreqInd",
  "numberOfMembers",
];

export const headerColumnFormats = [
  //  Schedule_Id BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL ,
  ["scheduleReference", "VARCHAR", true, 32],
  ["groupSchemeId", "VARCHAR", false, 16],
  ["subSchemeId", "VARCHAR", false, 16],
  ["subSchemeName", "VARCHAR", false, 75],
  ["effectiveDate", "DATE", false, null],
  ["scheduleType", "VARCHAR", false, 1],
  ["paymentPlanNo", "VARCHAR", false, 11],
  ["payReference", "VARCHAR", false, 35],
  ["paymentSourceName", "VARCHAR", false, 40],
  ["paymentDueDate", "DATE", false, null],
  ["startDate", "DATE", false, null],
  ["endDate", "DATE", false, null],
  ["mopType", "VARCHAR", false, 2],
  ["mopTypeDesc", "VARCHAR", false, 20],
  ["premFrequency", "VARCHAR", false, 2],
  ["premFrequencyDesc", "VARCHAR", false, 15],
  ["taxPeriodFreqInd", "VARCHAR", false, 1],
  ["numberOfMembers", "NUMBER", false, 10],
  ["recordStartDate", "DATE", false, null],
  ["recordEndDate", "DATE", false, null],
  ["createdBy", "VARCHAR", false, 50],
];

export const memberColumns = [
  "recordId",
  "scheduleReference",
  "cmPartyId",
  "crmPartyId",
  "planReference",
  "membershipId",
  "schemePayrollReference",
  "nino",
  "forename",
  "surname",
  "membershipEffectiveDate",
  "membershipStatus",
  "membershipStatusDesc",
  "category",
  "categoryName",
  "newCategory",
  "newCategoryName",
  "pensionableSalary",
  "reasonCode",
  "currentEmployerContribution",
  "currentMemberContribution",
  "newEmployerContribution",
  "newMemberContribution",
  "newSalary",
];

export const memberColumnFormats = [
  ["recordId", "VARCHAR", false, 2],
  ["scheduleReference", "VARCHAR", false, 32],
  ["cmPartyId", "NUMBER", false, 8],
  ["crmPartyId", "VARCHAR", false, 36],
  ["planReference", "VARCHAR", false, 16],
  ["membershipId", "VARCHAR", false, 16],
  ["schemePayrollReference", "VARCHAR", false, 16],
  ["nino", "VARCHAR", false, 12],
  ["forename", "VARCHAR", false, 30],
  ["surname", "VARCHAR", false, 40],
  ["membershipEffectiveDate", "DATE", false, null],
  ["membershipStatus", "VARCHAR", false, 1],
  ["membershipStatusDesc", "VARCHAR", false, 20],
  ["category", "NUMBER", false, 6],
  ["categoryName", "VARCHAR", false, 75],
  ["newCategory", "NUMBER", false, 6],
  ["newCategoryName", "VARCHAR", false, 75],
  ["pensionableSalary", "DECIMAL", false, [10, 2]],
  ["reasonCode", "VARCHAR", false, 5],
  ["currentEmployerContribution", "DECIMAL", false, [10, 2]],
  ["currentMemberContribution", "DECIMAL", false, [10, 2]],
  ["newEmployerContribution", "DECIMAL", false, [10, 2]],
  ["newMemberContribution", "DECIMAL", false, [10, 2]],
  ["newSalary", "DECIMAL", false, [10, 2]],
  ["recordStartDate", "DATE", false, null],
  ["recordEndDate", "DATE", false, null],
  ["createdBy", "VARCHAR", false, 50],
];

export const policyColumns = [
  "recordId",
  "scheduleReference",
  "membershipId",
  "planReference",
  "policyId",
  "taxReliefStatus",
  "taxReliefStatusDesc",
  "salaryBasis",
  "salaryBasisDesc",
  "regularContributionType",
  "regularContributionTypeDesc",
  "contributionPercentage",
  "lastPaidAmount",
];

export const policyFormats = [
  ["recordId", "VARCHAR", false, 2],
  ["scheduleReference", "VARCHAR", false, 32],
  ["membershipId", "VARCHAR", false, 16],
  ["planReference", "VARCHAR", false, 16],
  ["policyId", "VARCHAR", false, 16],
  ["taxReliefStatus", "VARCHAR", false, 3],
  ["taxReliefStatusDesc", "VARCHAR", false, 40],
  ["salaryBasis", "VARCHAR", false, 1],
  ["salaryBasisDesc", "VARCHAR", false, 30],
  ["regularContributionType", "VARCHAR", false, 3],
  ["regularContributionTypeDesc", "VARCHAR", false, 30],
  ["contributionPercentage", "DECIMAL", false, [5, 2]],
  ["lastPaidAmount", "DECIMAL", false, [10, 2]],
  ["recordStartDate", "DATE", false, null],
  ["recordEndDate", "DATE", false, null],
  ["createdBy", "VARCHAR", false, 50],
];

export type headerColumnsType = {
  scheduleReference: string;
  groupSchemeID: string;
  subSchemeId: string;
  subSchemeName: string;
  effectiveDate: Date;
  scheduleType: string;
  paymentPlanNo: string;
  payReference: string;
  paymentSourceName: string;
  paymentDueDate: Date;
  startDate: Date;
  endDate: Date;
  mopType: string;
  mopTypeDesc: string;
  premFrequency: string;
  premFrequencyDesc: string;
  taxPeriodFreqInd: string;
  numberOfMembers: number;
};

export const regexPattern = {
  alphaNumPattern: /^([a-zA-Z0-9 .-]+)$/,
  numPattern: /^([0-9 ]+)$/,
  datePattern: /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/,
};

export const CSV_FILES: {
  namePrefix: string;
  columns: string[];
  tableName: string;
}[] = [
  {
    namePrefix: "Contribution_Header_File_", // schedule
    columns: [
      "schedule_reference",
      "group_scheme_id",
      "sub_scheme_id",
      "sub_scheme_name",
      "effective_date",
      "schedule_type",
      "payment_plan_no",
      "pay_reference",
      "payment_source_name",
      "payment_due_date",
      "start_date",
      "end_date",
      "mop_type",
      "mop_type_desc",
      "prem_frequency",
      "prem_frequency_desc",
      "tax_period_freq_ind",
      "number_of_members",
    ],
    tableName: "Stg_Contr_Sch",
  },
  {
    namePrefix: "Contribution_Member_File_",
    columns: [
      "record_id",
      "schedule_reference",
      "cm_party_id",
      "crm_party_id",
      "plan_reference",
      "membership_id",
      "scheme_payroll_reference",
      "nino",
      "forename",
      "surname",
      "membership_effective_date",
      "membership_status",
      "membership_status_desc",
      "category",
      "category_name",
      "new_category",
      "new_category_name",
      "pensionable_salary",
      "reason_code",
      "current_employer_contribution",
      "current_member_contribution",
      "new_employer_contribution",
      "new_member_contribution",
      "new_salary",
    ],
    tableName: "Stg_Contr_Mem",
  },
  {
    namePrefix: "Contribution_Policy_File_",
    columns: [
      "record_id",
      "schedule_reference",
      "membership_id",
      "plan_reference",
      "policy_id",
      "tax_relief_status",
      "tax_relief_status_desc",
      "salary_basis",
      "salary_basis_desc",
      "regular_contribution_type",
      "regular_contribution_type_desc",
      "contribution_percentage",
      "last_paid_amount",
    ],
    tableName: "Stg_Contr_Policy",
  },
];

export const LOADING_DATA_ERROR_CODES = {
  LOADING_TO_STAGING_TABLES: {
    Error_Code: "STAGING_TABLES_FAILED",
    Error_Name: "Azure function Load CSV files to staging tables failed",
  },
  LOADING_NORMALISATION_TABLES: {
    Error_Code: "NORMALISATION_FAILED",
    Error_Name: "Azure function normalisation step failed",
  },
  HEADER_VALIDATION: {
    Error_Code: "HEADER_VALIDATION_FAILED",
    Error_Name: "Header file has invalid data",
  },
  MEMBER_VALIDATION: {
    Error_Code: "MEMBER_VALIDATION_FAILED",
    Error_Name: "Member file has invalid data",
  },
  POLICY_VALIDATION: {
    Error_Code: "POLICY_VALIDATION_FAILED",
    Error_Name: "Policy file has invalid data",
  },
  FILE_HEADER_VALIDATION: {
    Error_Code: "FILE_HEADER_VALIDATION_FAILED",
    Error_Name: "file header has invalid data",
  },
};

export const headerFilterParams = {
  contribHeaderId: "ContributionHeader.contrib_header_id",
  nestScheduleRef: "ContributionHeader.nest_schedule_ref",
  employerNestId: "ContributionHeader.employer_nest_id",
  earningPeriodEndDate: "ContributionHeader.earning_period_end_date",
  scheduleType: "ContributionHeader.schedule_type" , 
  subSchemeId: "ContributionHeader.sub_scheme_id", 
  paymentPlanNo: "ContributionHeader.payment_plan_no",
  paymentRef: "ContributionHeader.payment_ref", 
  nestPaymentRef: "ContributionHeader.nest_payment_ref",
  paymentSourceName: "ContributionHeader.payment_source_name", 
  paymentMethod: "ContributionHeader.payment_method", 
  paymentMethodDesc: "ContributionHeader.payment_method_desc", 
  paymentFrequency: "ContributionHeader.payment_frequency", 
  paymentFrequencyDesc: "ContributionHeader.payment_frequency_desc", 
  taxPayFrequencyInd: "ContributionHeader.tax_pay_frequency_ind", 
  pegaCaseRef: "ContributionHeader.pega_case_ref", 
  scheduleStatusCd: "ContributionHeader.schedule_status_cd",
};

export const memberFilterParams = {
  nestScheduleRef: "ContributionDetails.nest_schedule_ref",
  employerNestId: "ContributionDetails.employer_nest_id",
  contribHeaderId: "ContributionDetails.contrib_header_id",
  firstName: "ContributionDetails.first_name",
  lastName: "ContributionDetails.last_name",
};

export const READONLY_CONTRIBUTION_DETAILS_COLUMNS_FOR_UPDATE = [
  "membContribDetlId",
  "nestScheduleRef",
  "membEnrolmentRef",
  "membContriDueDate",
  "groupName",
  "createdBy",
  "updatedBy",
  "lastUpdatedTimestamp",
  "membPlanRef",
  "schdlMembStatusCd",
];

export const READONLY_CONTRIBUTION_HEADER_COLUMNS_FOR_UPDATE = [
  "createdBy",
  "updatedBy",
  "lastUpdatedTimestamp",
  "nestScheduleRef",
  "externalScheduleRef",
  "scheduleType",
  "employerNestId",
  "subSchemeId",
  "earningPeriodStartDate",
  "earningPeriodEndDate",
  "paymentDueDate",
  "noOfMembs",
  "totScheduleAmt",
];

export const CONTR_MEMBER_DETAILS = [
  "schdlMembStatusCd",
  "employerNestId",
  "membEnrolmentRef",
  "membContriDueDate",
  "membPlanRef",
  "membPartyId",
  "scmPartyId",
  "nino",
  "alternativeId",
  "autoCalcFlag",
  "empGroupId",
  "pensEarnings",
  "emplContriAmt",
  "membContriAmt",
  "membNonPayReason",
  "membLeaveEarnings",
  "empGroupId",
  "newGroupName",
  "newGroupPensEarnings",
  "newGroupEmplContriAmt",
  "newGroupMembContriAmt",
  "optoutRefNum",
  "optoutDeclarationFlag",
  "newPaymentPlanNo",
  "newPaymentSourceName",
  "membNonPayEffDate",
  "secEnrolPensEarnings",
  "secEnrolEmplContriAmt",
  "secEnrolMembContriAmt",
  "channelType",
  "memberExcludedFlag",
  "membPaymentDueDate",
  "recordStartDate",
  "recordEndDate",
  "firstName",
  "lastName",
  "enrolmentType",
  "secEnrolmentType",
  "emplContriPct",
  "membContriPct",
  "newGroupEmplContriPct",
  "newGroupMembContriPct",
  "recordChangedFlag",
  "memTaxReliefEligibility",
  "origMembNonPayReason",
];
