-- Creates contribution_index_schema schema, and provisions the coi_functionapp_user user to connect and execute DML statements

CREATE SCHEMA contribution_index_schema;
GRANT CONNECT ON DATABASE contribution TO coi_functionapp_user;
GRANT USAGE ON SCHEMA contribution_index_schema TO coi_functionapp_user;
GRANT SELECT, INSERT, UPDATE, DELETE, TRUNCATE ON ALL TABLES IN SCHEMA contribution_index_schema TO coi_functionapp_user;
