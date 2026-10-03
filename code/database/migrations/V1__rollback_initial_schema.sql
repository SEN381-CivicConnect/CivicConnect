-- =====================================================================
-- CivicConnect Relational Database Persistence Architecture
-- Migration: V1__rollback_initial_schema.sql (Rollback Script)
-- Standard: SEN381 Milestone 3 Brief §14 (Staging & Rollback Strategy), ADR-011
-- Author: Chris Fourie (602826)
-- Target Database: PostgreSQL 16+
-- =====================================================================

-- Drop tables in reverse topological dependency order
DROP TABLE IF EXISTS service_request_audit_logs CASCADE;
DROP TABLE IF EXISTS resolution_records CASCADE;
DROP TABLE IF EXISTS request_attachments CASCADE;
DROP TABLE IF EXISTS outbox_messages CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS service_requests CASCADE;
DROP TABLE IF EXISTS status_transition_rules CASCADE;
DROP TABLE IF EXISTS request_statuses CASCADE;
DROP TABLE IF EXISTS request_categories CASCADE;
DROP TABLE IF EXISTS priorities CASCADE;
DROP TABLE IF EXISTS staff_profiles CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- Drop custom trigger functions
DROP FUNCTION IF EXISTS update_timestamp CASCADE;
