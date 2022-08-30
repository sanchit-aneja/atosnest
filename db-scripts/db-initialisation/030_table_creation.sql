CREATE TABLE contribution_index_schema."Stg_Contr_Mem" 
    (
     Contr_Member_Id BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
     Record_Id VARCHAR (2),
     Schedule_Reference VARCHAR (32),
     Cm_Party_Id NUMERIC (8),
     Crm_Party_Id VARCHAR (10),
     Plan_Reference VARCHAR (16),
     Membership_Id VARCHAR (16),
     Scheme_Payroll_Reference VARCHAR (16),
     Nino VARCHAR (12),
     Forename VARCHAR (30),
     Surname VARCHAR (40),
     Membership_Effective_Date DATE,
     Membership_Status VARCHAR (1),
     Membership_Status_Desc VARCHAR (20),
     Category NUMERIC (6),
     Category_Name VARCHAR (75),
     Pensionable_Salary DECIMAL (10,2),
     Reason_Code VARCHAR (5),
     Current_Employer_Contribution DECIMAL (10,2),
     Current_Member_Contribution DECIMAL (10,2),
     New_Employer_Contribution DECIMAL (10,2),
     New_Member_Contribution DECIMAL (10,2),
     New_Salary DECIMAL (10,2),
     Record_Start_Date DATE,
     Record_End_Date DATE,
     Created_By VARCHAR (50),
     CONSTRAINT Stg_Contr_Mem_PK PRIMARY KEY (Contr_Member_Id)
    );

    CREATE TABLE contribution_index_schema."Stg_Contr_Policy"
    (
     Contr_Policy_Id BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
     Record_Id VARCHAR (2),
     Schedule_Reference VARCHAR (32),
     Membership_Id VARCHAR (16), 
     Plan_Reference VARCHAR (16), 
     Policy_Id VARCHAR (16), 
     Tax_Relief_Status VARCHAR (3), 
     Tax_Relief_Status_Desc VARCHAR (40), 
     Salary_Basis VARCHAR (1), 
     Salary_Basis_Desc VARCHAR (30), 
     Regular_Contribution_Type VARCHAR (3), 
     Regular_Contribution_Type_Desc VARCHAR (30), 
     Contribution_Percentage DECIMAL (5,2), 
     Last_Paid_Amount DECIMAL (10,2), 
     Record_Start_Date DATE,
     Record_End_Date DATE,
     Created_By VARCHAR (50),
     CONSTRAINT Stg_Contr_Policy_PK PRIMARY KEY (Contr_Policy_Id)
    );

    CREATE TABLE contribution_index_schema."Stg_Contr_Sch" 
    (
     Schedule_Id BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL, 
     Schedule_Reference VARCHAR (32) NOT NULL, 
     Group_Scheme_Id VARCHAR (16), 
     Sub_Scheme_Id VARCHAR (16), 
     Sub_Scheme_Name VARCHAR (75), 
     Effective_Date DATE, 
     Schedule_Type VARCHAR (1), 
     Payment_Plan_No VARCHAR (11), 
     Pay_Reference VARCHAR (35), 
     Payment_Source_Name VARCHAR (40), 
     Payment_Due_Date DATE, 
     Start_Date DATE, 
     End_Date DATE, 
     Mop_Type VARCHAR (2), 
     Mop_Type_Desc VARCHAR (20), 
     Prem_Frequency VARCHAR (2), 
     Prem_Frequency_Desc VARCHAR (15), 
     Tax_Period_Freq_Ind VARCHAR (1), 
     Number_Of_Members NUMERIC (10), 
     Record_Start_Date DATE, 
     Record_End_Date DATE, 
     Created_By VARCHAR (50),
     CONSTRAINT Stg_Contr_Sch_PK PRIMARY KEY (Schedule_Id)
    );

    CREATE TABLE contribution_index_schema."RD_Schedule_Status"
    (
        Schedule_Status_Code VARCHAR2 (5) NOT NULL,
        Schedule_Status_Desc VARCHAR2 (100),
        Record_Start_Date DATE,
        Record_End_Date DATE,
        Created_By VARCHAR2 (50),
        Updated_By VARCHAR2 (50),
        Last_Updated_Timestamp TIMESTAMP,
        CONSTRAINT RD_Memb_Sch_Sts_PKv2 PRIMARY KEY (Schedule_Status_Code)
    );

    CREATE TABLE contribution_index_schema."Contribution_Header"
    (
     Contrib_Header_Id BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
     File_id UUID,
     NEST_Schedule_Ref VARCHAR (14) NOT NULL,
     External_Schedule_Ref VARCHAR (32) NOT NULL,
     Schedule_Type VARCHAR (50) NOT NULL,
     Schedule_Status_Cd VARCHAR (5) NOT NULL,
     Schedule_Generation_Date DATE NOT NULL,
     Employer_NEST_Id VARCHAR (30) NOT NULL,
     Group_Scheme_Id VARCHAR (16) NOT NULL,
     Sub_Scheme_Id VARCHAR (16),
     Earning_Period_Start_Date DATE NOT NULL,
     Earning_Period_End_Date DATE NOT NULL,
     Payment_Plan_No VARCHAR (11),
     Payment_Ref VARCHAR (35),
     Payment_Source_Name VARCHAR (40) NOT NULL,
     Payment_Method VARCHAR (2) NOT NULL,
     Payment_Method_Desc VARCHAR (30) NOT NULL,
     Payment_Frequency VARCHAR (2) NOT NULL,
     Payment_Frequency_Desc VARCHAR (30) NOT NULL,
     Tax_Pay_Frequency_Ind VARCHAR (1),
     Future_Payment_Date DATE,
     Payment_Due_Date DATE NOT NULL,
     Pega_Case_Ref VARCHAR (30),
     No_Of_Membs NUMERIC(8),
     Tot_Schedule_Amt DECIMAL (15,2),
     Orig_Schedule_Ref VARCHAR (14),
     Record_Start_Date DATE,
     Record_End_Date DATE,
     Created_By VARCHAR (50),
     Updated_By VARCHAR (50),
     Last_Updated_Timestamp TIMESTAMP,
     CONSTRAINT Contrib_Header_UK UNIQUE (NEST_Schedule_Ref),
     CONSTRAINT Contrib_Header_PK PRIMARY KEY (Contrib_Header_Id),
     CONSTRAINT Relation_2 FOREIGN KEY (Schedule_Status_Cd) REFERENCES contribution_index_schema."RD_Schedule_Status"(Schedule_Status_Code) ON DELETE CASCADE ON UPDATE CASCADE,
     CONSTRAINT Relation_45 FOREIGN KEY (File_Id) REFERENCES contribution_index_schema."File"(File_Id) ON UPDATE CASCADE ON DELETE CASCADE
    );

    CREATE TABLE contribution_index_schema."RD_Part_Contrib_Reason"
    (
        Reason_Code VARCHAR (5) NOT NULL,
        Reason_Description VARCHAR (100),
        Record_Start_Date DATE,
        Record_End_Date DATE,
        Created_By VARCHAR (50),
        Updated_By VARCHAR (50),
        Last_Updated_Timestamp TIMESTAMP,
        CONSTRAINT RD_Memb_Sch_Sts_PK PRIMARY KEY (Reason_Code)
    );

    CREATE TABLE contribution_index_schema."RD_Schedule_Memb_Status"
    (
        Schdl_Memb_Status_Code VARCHAR2 (5) NOT NULL,
        Schdl_Memb_Status_Desc VARCHAR2 (100),
        Record_Start_Date DATE,
        Record_End_Date DATE,
        Created_By VARCHAR2 (50),
        Updated_By VARCHAR2 (50),
        Last_Updated_Timestamp TIMESTAMP,
        CONSTRAINT RD_Memb_Sch_Sts_PKv1 PRIMARY KEY (Schdl_Memb_Status_Code)
    );

    CREATE TABLE contribution_index_schema."Member_Contribution_Details"
    (
     Memb_Contrib_Detl_Id BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
     NEST_Schedule_Ref VARCHAR (14) NOT NULL,
     Memb_Enrolment_Ref VARCHAR (30) NOT NULL,
     Memb_Contri_Due_Date DATE NOT NULL,
     Memb_Plan_Ref VARCHAR (16),
     Emp_Group_Id BIGINT NOT NULL,
     Group_Name VARCHAR (40) NOT NULL,
     Schdl_Memb_Status_Cd VARCHAR (5) NOT NULL,
     Memb_Party_ID VARCHAR (36) NOT NULL,
     SCM_Party_ID VARCHAR (16),
     NINO VARCHAR (9),
     Alternative_ID VARCHAR (16),
     Last_Paid_Pens_Earnings DECIMAL (15,2),
     Last_Paid_Reason_Code VARCHAR (5),
     Last_Paid_Empl_Contri_Amt DECIMAL (15,2),
     Last_Paid_Memb_Contri_Amt DECIMAL (15,2),
     Auto_Calc_Flag VARCHAR (1),
     Pens_Earnings DECIMAL (15,2),
     Empl_Contri_Amt DECIMAL (15,2),
     Memb_Contri_Amt DECIMAL (15,2),
     Memb_Non_Pay_Reason VARCHAR (5),
     Memb_Leave_Earnings DECIMAL (15,2),
     New_Emp_Group_Id BIGINT,
     New_Group_Name VARCHAR (40),
     New_Group_Pens_Earnings DECIMAL (15,2),
     New_Group_Empl_Contri_Amt DECIMAL (15,2),
     New_Group_Memb_Contri_Amt DECIMAL (15,2),
     Optout_Ref_Num VARCHAR (20),
     Optout_Declaration_Flag VARCHAR (1),
     New_Payment_Plan_No VARCHAR (11),
     New_Payment_Source_Name VARCHAR (40),
     Memb_Non_Pay_Eff_Date DATE,
     Sec_Enrol_Pens_Earnings DECIMAL (15,2),
     Sec_Enrol_Empl_Contri_Amt DECIMAL (15,2),
     Sec_Enrol_Memb_Contri_Amt DECIMAL (15,2),
     Channel_Type VARCHAR (3),
     Member_Excluded_Flag VARCHAR (1),
     Memb_Payment_Due_Date DATE,
     Record_Start_Date DATE,
     Record_End_Date DATE,
     Created_By VARCHAR (50),
     Updated_By VARCHAR (50),
     Last_Updated_Timestamp TIMESTAMP,
     CONSTRAINT Contrib_Detls_PK PRIMARY KEY (Memb_Contrib_Detl_Id),
     CONSTRAINT Contrib_Detls_UK UNIQUE (NEST_Schedule_Ref,Memb_Contri_Due_Date,Memb_Enrolment_Ref),
     CONSTRAINT Relation_10 FOREIGN KEY (Memb_Non_Pay_Reason) REFERENCES contribution_index_schema."RD_Part_Contrib_Reason"(Reason_Code) ON UPDATE CASCADE ON DELETE CASCADE,
     CONSTRAINT Relation_11 FOREIGN KEY (Schdl_Memb_Status_Cd) REFERENCES contribution_index_schema."RD_Schedule_Memb_Status"(Schdl_Memb_Status_Code) ON UPDATE CASCADE ON DELETE CASCADE
    );


CREATE TABLE contribution_index_schema."File"
( 
    File_Id              UUID  NOT NULL,
    File_Name            VARCHAR2(150)  NOT NULL,
    File_Type            VARCHAR2(3)  NOT NULL,
    File_Size            NUMERIC(10,0)  NOT NULL,
    File_Size_Type       VARCHAR2(2)  NOT NULL,
    File_Status          VARCHAR2(5)  NULL,
    File_Format          VARCHAR2(3)  NOT NULL,
    File_Received_Date   DATE  NULL,
    File_Processed_Date  DATE  NULL,
    File_Uploaded_On     timestamp  NULL,
    File_Sent_Date       DATE  NULL,
    No_Of_Recs           NUMERIC(8,0)  NULL,
    No_Of_Errors         NUMERIC(5,0)  NULL,
    Record_Start_Date    DATE  NULL,
    Record_End_Date      DATE  NULL,
    Created_By           VARCHAR2(50)  NULL,
    Updated_By           VARCHAR2(50)  NULL,
    Last_Updated_Timestamp TIMESTAMP  NULL,
    File_Pega_Case_Ref   VARCHAR2(30)  NULL,
    CONSTRAINT File_PK PRIMARY KEY (File_Id)
);

CREATE TABLE IF NOT EXISTS contribution_index_schema."Contribution_Header_Submission"
(
    Contrib_Submission_Ref BIGINT GENERATED BY DEFAULT AS IDENTITY NOT NULL,
    Contrib_File_Id BIGINT NOT NULL,
    NEST_Schedule_Ref VARCHAR(14)  NOT NULL,
    Schedule_Submission_Seq DECIMAL(4,0)
    Submission_Type VARCHAR (1) NOT NULL,
    Submission_Date DATE NOT NULL,
    Future_Payment_Date DATE NULL,
    No_Of_Membs_Submitted DECIMAL (8,0) NULL,
    Tot_Contr_Submission_Amt DECIMAL(15,2) NULL,
    Created_Date DATE,
    Created_By VARCHAR (50) NULL,
    CONSTRAINT Contrib_File_Id_uk UNIQUE (Contrib_File_Id),
    CONSTRAINT Contrib_Submission_Ref_pk PRIMARY KEY (Contrib_Submission_Ref)
)
