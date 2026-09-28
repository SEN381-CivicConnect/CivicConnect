-- =====================================================================
-- CivicConnect Relational Database Persistence Architecture
-- Migration: V1__initial_schema.sql
-- Architecture Specification: DOC-ARCH-DATA-001 (Version 1: Strict 3NF)
-- Standards: Master Project Brief §3, §16, §18.1 | PED v1.0 §5 | DEC-004 | FEC-003
-- Author: Chris Fourie (602826)
-- Target Database: PostgreSQL 16+
-- =====================================================================

-- 0. Extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. ROLES & AUTHORIZATION DOMAIN (NFR-004, FEC-001)
-- ---------------------------------------------------------------------
CREATE TABLE roles (
    role_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    role_code VARCHAR(30) UNIQUE NOT NULL,
    role_name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    CONSTRAINT chk_role_code CHECK (role_code IN ('REQUESTER', 'STAFF', 'SUPERVISOR', 'ADMIN'))
);

COMMENT ON TABLE roles IS 'System authorization tiers enforcing strict Role-Based Access Control (RBAC).';

-- ---------------------------------------------------------------------
-- 2. USERS & IDENTITY PRINCIPALS (FR-001, NFR-004, NFR-005)
-- ---------------------------------------------------------------------
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role_id INT NOT NULL REFERENCES roles(role_id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

COMMENT ON TABLE users IS 'Authenticated user identities. Sensitive fields subject to POPIA protection rules.';

-- ---------------------------------------------------------------------
-- 3. DEPARTMENTS & ORGANIZATIONAL BOUNDARIES (FR-006, FR-007)
-- ---------------------------------------------------------------------
CREATE TABLE departments (
    department_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    department_code VARCHAR(20) UNIQUE NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE departments IS 'Operational dispatch divisions responsible for specific service domains.';

-- ---------------------------------------------------------------------
-- 4. STAFF & TECHNICIAN PROFILES (FR-006, FR-009)
-- ---------------------------------------------------------------------
CREATE TABLE staff_profiles (
    staff_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    department_id INT NOT NULL REFERENCES departments(department_id),
    employee_number VARCHAR(50) UNIQUE NOT NULL,
    job_title VARCHAR(100) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE staff_profiles IS 'Workforce dispatch attributes extending user records for field technicians.';

-- ---------------------------------------------------------------------
-- 5. PRIORITIES & SERVICE LEVEL AGREEMENTS (FR-001, FR-013)
-- ---------------------------------------------------------------------
CREATE TABLE priorities (
    priority_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    priority_code VARCHAR(20) UNIQUE NOT NULL,
    priority_name VARCHAR(50) NOT NULL,
    sla_triage_hours INT NOT NULL CHECK (sla_triage_hours > 0),
    sla_resolution_hours INT NOT NULL CHECK (sla_resolution_hours > 0),
    badge_color VARCHAR(10) NOT NULL DEFAULT '#808080',
    CONSTRAINT chk_priority_code CHECK (priority_code IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL'))
);

COMMENT ON TABLE priorities IS 'Configured SLA turnaround targets based on request severity.';

-- ---------------------------------------------------------------------
-- 6. REQUEST CATEGORIES & TAXONOMY (FR-002)
-- ---------------------------------------------------------------------
CREATE TABLE request_categories (
    category_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    department_id INT NOT NULL REFERENCES departments(department_id),
    default_priority_id INT NOT NULL REFERENCES priorities(priority_id),
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(100) NOT NULL,
    description VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE request_categories IS 'Controlled service taxonomy routing requests to assigned departments.';

-- ---------------------------------------------------------------------
-- 7. REQUEST STATUSES & FSM STATES (FR-010, DEC-004)
-- ---------------------------------------------------------------------
CREATE TABLE request_statuses (
    status_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    status_code VARCHAR(30) UNIQUE NOT NULL,
    status_name VARCHAR(50) NOT NULL,
    is_terminal BOOLEAN NOT NULL DEFAULT FALSE,
    sequence_order INT NOT NULL,
    CONSTRAINT chk_status_code CHECK (status_code IN (
        'SUBMITTED', 'TRIAGED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'REJECTED'
    ))
);

COMMENT ON TABLE request_statuses IS 'Deterministic lifecycle stages of the Finite State Machine.';

-- ---------------------------------------------------------------------
-- 8. STATUS TRANSITION RULES ENGINE (FR-010, DEC-004)
-- ---------------------------------------------------------------------
CREATE TABLE status_transition_rules (
    rule_id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    from_status_id INT NOT NULL REFERENCES request_statuses(status_id),
    to_status_id INT NOT NULL REFERENCES request_statuses(status_id),
    allowed_role_id INT NOT NULL REFERENCES roles(role_id),
    CONSTRAINT uq_status_transition UNIQUE (from_status_id, to_status_id, allowed_role_id)
);

COMMENT ON TABLE status_transition_rules IS 'Matrix of legally valid state transitions enforced at the database level.';

-- ---------------------------------------------------------------------
-- 9. SERVICE REQUESTS - CORE TRANSACTIONAL ENTITY (FR-001 - FR-010)
-- ---------------------------------------------------------------------
CREATE TABLE service_requests (
    request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tracking_reference VARCHAR(30) UNIQUE NOT NULL,
    requester_id UUID NOT NULL REFERENCES users(user_id),
    category_id INT NOT NULL REFERENCES request_categories(category_id),
    priority_id INT NOT NULL REFERENCES priorities(priority_id),
    current_status_id INT NOT NULL REFERENCES request_statuses(status_id),
    assigned_department_id INT NOT NULL REFERENCES departments(department_id),
    assigned_technician_id UUID REFERENCES users(user_id),
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location_building VARCHAR(100) NOT NULL,
    location_floor_room VARCHAR(100) NOT NULL,
    is_anonymized_display BOOLEAN NOT NULL DEFAULT FALSE,
    version INT NOT NULL DEFAULT 1,
    submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    triaged_at TIMESTAMP WITH TIME ZONE,
    sla_due_at TIMESTAMP WITH TIME ZONE NOT NULL,
    resolved_at TIMESTAMP WITH TIME ZONE,
    closed_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_tracking_format CHECK (tracking_reference ~* '^REQ-[0-9]{4}-[0-9]{4}$')
);

COMMENT ON TABLE service_requests IS 'Central transactional entity tracking community service requests.';

-- ---------------------------------------------------------------------
-- 10. REQUEST ATTACHMENTS (FR-001, FR-008)
-- ---------------------------------------------------------------------
CREATE TABLE request_attachments (
    attachment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID NOT NULL REFERENCES service_requests(request_id) ON DELETE CASCADE,
    uploader_id UUID NOT NULL REFERENCES users(user_id),
    file_name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size_bytes INT NOT NULL CHECK (file_size_bytes > 0 AND file_size_bytes <= 10485760),
    storage_url VARCHAR(500) NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE request_attachments IS 'Metadata and cryptographic checksums for polyglot binary storage.';

-- ---------------------------------------------------------------------
-- 11. RESOLUTION RECORDS (FR-011)
-- ---------------------------------------------------------------------
CREATE TABLE resolution_records (
    resolution_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID UNIQUE NOT NULL REFERENCES service_requests(request_id) ON DELETE RESTRICT,
    resolver_user_id UUID NOT NULL REFERENCES users(user_id),
    resolution_summary TEXT NOT NULL,
    corrective_action TEXT,
    parts_cost DECIMAL(10,2) CHECK (parts_cost >= 0.00),
    resolved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE resolution_records IS 'Mandatory resolution evidence required before transitioning to RESOLVED or CLOSED.';

-- ---------------------------------------------------------------------
-- 12. IMMUTABLE AUDIT LOGS (FR-004, NFR-006, FEC-003)
-- ---------------------------------------------------------------------
CREATE TABLE service_request_audit_logs (
    audit_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    request_id UUID NOT NULL REFERENCES service_requests(request_id) ON DELETE CASCADE,
    performed_by_user_id UUID NOT NULL REFERENCES users(user_id),
    action_type VARCHAR(50) NOT NULL,
    old_status_id INT REFERENCES request_statuses(status_id),
    new_status_id INT REFERENCES request_statuses(status_id),
    old_technician_id UUID REFERENCES users(user_id),
    new_technician_id UUID REFERENCES users(user_id),
    action_comment TEXT,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE service_request_audit_logs IS 'Append-only immutable audit trail ensuring non-repudiation.';

-- ---------------------------------------------------------------------
-- 13. FEEDBACK NOTIFICATIONS (FR-005)
-- ---------------------------------------------------------------------
CREATE TABLE notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    request_id UUID REFERENCES service_requests(request_id) ON DELETE SET NULL,
    notification_type VARCHAR(50) NOT NULL,
    channel VARCHAR(20) NOT NULL CHECK (channel IN ('EMAIL', 'IN_APP')),
    subject VARCHAR(200) NOT NULL,
    message_content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE notifications IS 'Automated alerts and feedback records sent upon ticket transitions.';

-- =====================================================================
-- PERFORMANCE B-TREE INDEXES (Targeting NFR-001 & NFR-007)
-- =====================================================================

-- Departmental queue sorting & status filtering (FR-006, FR-007)
CREATE INDEX idx_sr_dept_status ON service_requests (assigned_department_id, current_status_id, submitted_at DESC);

-- Citizen tracking query & history (FR-003, FR-004)
CREATE INDEX idx_sr_requester ON service_requests (requester_id, submitted_at DESC);

-- Technician active assignment queue (FR-008, FR-009)
CREATE INDEX idx_sr_technician ON service_requests (assigned_technician_id, current_status_id);

-- Executive SLA breach & overdue alert index (FR-012, FR-013)
CREATE INDEX idx_sr_sla_breach ON service_requests (current_status_id, sla_due_at);

-- Public tracking reference instant lookup (FR-001, FR-003)
CREATE UNIQUE INDEX idx_sr_tracking_ref ON service_requests (tracking_reference);

-- Audit timeline chronological lookup (NFR-006)
CREATE INDEX idx_audit_request_timeline ON service_request_audit_logs (request_id, timestamp ASC);

-- Unread notification badge lookup (FR-005)
CREATE INDEX idx_notifications_user_unread ON notifications (user_id, is_read) WHERE is_read = FALSE;
