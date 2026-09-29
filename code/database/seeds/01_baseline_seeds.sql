-- =====================================================================
-- CivicConnect Seed Data: Taxonomy, FSM Rules, and Baseline Accounts
-- Migration / Seed: 01_baseline_seeds.sql
-- Architecture Specification: DOC-ARCH-DATA-001 (Version 1: Strict 3NF)
-- Standards: Master Project Brief §3, §16 | PED v1.0 §5 | DEC-004
-- Author: Chris Fourie (602826)
-- Target Database: PostgreSQL 16+
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. SEED SYSTEM ROLES (NFR-004)
-- ---------------------------------------------------------------------
INSERT INTO roles (role_code, role_name, description) VALUES
    ('REQUESTER', 'Community Requester', 'Students, staff, and residents submitting service requests'),
    ('STAFF', 'Field Technician', 'Operational field staff assigned to resolve service requests'),
    ('SUPERVISOR', 'Department Supervisor', 'Department managers overseeing queue triage and technician dispatch'),
    ('ADMIN', 'System Administrator', 'Compliance, executive auditing, and platform configuration administrators')
ON CONFLICT (role_code) DO NOTHING;

-- ---------------------------------------------------------------------
-- 2. SEED DEPARTMENTS (FR-006, FR-007)
-- ---------------------------------------------------------------------
INSERT INTO departments (department_code, department_name, contact_email) VALUES
    ('FAC', 'Facilities & Campus Infrastructure', 'facilities@civicconnect.local'),
    ('IT', 'Information Technology & Network Services', 'itsupport@civicconnect.local'),
    ('SEC', 'Campus Security & Safety', 'security@civicconnect.local'),
    ('MAINT', 'General Maintenance & Sanitation', 'maintenance@civicconnect.local')
ON CONFLICT (department_code) DO NOTHING;

-- ---------------------------------------------------------------------
-- 3. SEED PRIORITIES & SLA TIMEFRAMES (FR-001, FR-013)
-- ---------------------------------------------------------------------
INSERT INTO priorities (priority_code, priority_name, sla_triage_hours, sla_resolution_hours, badge_color) VALUES
    ('LOW', 'Low Priority', 48, 120, '#10B981'),        -- 48h triage, 5 days resolution
    ('MEDIUM', 'Medium Priority', 24, 72, '#3B82F6'),    -- 24h triage, 3 days resolution
    ('HIGH', 'High Priority', 4, 24, '#F59E0B'),          -- 4h triage, 1 day resolution
    ('CRITICAL', 'Critical Emergency', 1, 8, '#EF4444')   -- 1h triage, 8 hours resolution
ON CONFLICT (priority_code) DO NOTHING;

-- ---------------------------------------------------------------------
-- 4. SEED REQUEST CATEGORIES (FR-002)
-- ---------------------------------------------------------------------
INSERT INTO request_categories (department_id, default_priority_id, category_code, category_name, description)
VALUES
    (
        (SELECT department_id FROM departments WHERE department_code = 'FAC'),
        (SELECT priority_id FROM priorities WHERE priority_code = 'HIGH'),
        'FAC_FAULT', 'Facility Faults', 'Structural faults, burst pipes, lighting issues, and HVAC failures'
    ),
    (
        (SELECT department_id FROM departments WHERE department_code = 'IT'),
        (SELECT priority_id FROM priorities WHERE priority_code = 'MEDIUM'),
        'IT_SUPPORT', 'IT & Computer Lab Support', 'Wi-Fi connectivity, lab workstation hardware, projector/AV failures'
    ),
    (
        (SELECT department_id FROM departments WHERE department_code = 'MAINT'),
        (SELECT priority_id FROM priorities WHERE priority_code = 'MEDIUM'),
        'DAMAGED_EQUIPMENT', 'Damaged Equipment', 'Broken desks, classroom seating, broken windows, damaged doors'
    ),
    (
        (SELECT department_id FROM departments WHERE department_code = 'SEC'),
        (SELECT priority_id FROM priorities WHERE priority_code = 'CRITICAL'),
        'SECURITY_HAZARD', 'Security & Safety Hazards', 'Unauthorized trespass, lighting outages in dark paths, safety hazards'
    ),
    (
        (SELECT department_id FROM departments WHERE department_code = 'MAINT'),
        (SELECT priority_id FROM priorities WHERE priority_code = 'LOW'),
        'GENERAL_MAINT', 'General Maintenance', 'Routine cleaning requests, waste disposal, grounds maintenance'
    ),
    (
        (SELECT department_id FROM departments WHERE department_code = 'SEC'),
        (SELECT priority_id FROM priorities WHERE priority_code = 'LOW'),
        'LOST_PROPERTY', 'Lost Property', 'Report lost personal belongings or hand in discovered items'
    )
ON CONFLICT (category_code) DO NOTHING;

-- ---------------------------------------------------------------------
-- 5. SEED REQUEST STATUSES (FR-010, DEC-004)
-- ---------------------------------------------------------------------
INSERT INTO request_statuses (status_code, status_name, is_terminal, sequence_order) VALUES
    ('SUBMITTED', 'Submitted', FALSE, 1),
    ('TRIAGED', 'Triaged', FALSE, 2),
    ('ASSIGNED', 'Assigned', FALSE, 3),
    ('IN_PROGRESS', 'In Progress', FALSE, 4),
    ('RESOLVED', 'Resolved', TRUE, 5),
    ('CLOSED', 'Closed', TRUE, 6),
    ('REJECTED', 'Rejected', TRUE, 7)
ON CONFLICT (status_code) DO NOTHING;

-- ---------------------------------------------------------------------
-- 6. SEED STATUS TRANSITION RULES (FSM MATRIX - DEC-004)
-- ---------------------------------------------------------------------
-- SUBMITTED -> TRIAGED (Supervisor, Admin)
INSERT INTO status_transition_rules (from_status_id, to_status_id, allowed_role_id)
SELECT f.status_id, t.status_id, r.role_id
FROM request_statuses f, request_statuses t, roles r
WHERE f.status_code = 'SUBMITTED' AND t.status_code = 'TRIAGED' AND r.role_code IN ('SUPERVISOR', 'ADMIN')
ON CONFLICT (from_status_id, to_status_id, allowed_role_id) DO NOTHING;

-- SUBMITTED -> REJECTED (Supervisor, Admin)
INSERT INTO status_transition_rules (from_status_id, to_status_id, allowed_role_id)
SELECT f.status_id, t.status_id, r.role_id
FROM request_statuses f, request_statuses t, roles r
WHERE f.status_code = 'SUBMITTED' AND t.status_code = 'REJECTED' AND r.role_code IN ('SUPERVISOR', 'ADMIN')
ON CONFLICT (from_status_id, to_status_id, allowed_role_id) DO NOTHING;

-- TRIAGED -> ASSIGNED (Supervisor, Staff self-assignment, Admin)
INSERT INTO status_transition_rules (from_status_id, to_status_id, allowed_role_id)
SELECT f.status_id, t.status_id, r.role_id
FROM request_statuses f, request_statuses t, roles r
WHERE f.status_code = 'TRIAGED' AND t.status_code = 'ASSIGNED' AND r.role_code IN ('SUPERVISOR', 'STAFF', 'ADMIN')
ON CONFLICT (from_status_id, to_status_id, allowed_role_id) DO NOTHING;

-- ASSIGNED -> IN_PROGRESS (Staff technician, Supervisor, Admin)
INSERT INTO status_transition_rules (from_status_id, to_status_id, allowed_role_id)
SELECT f.status_id, t.status_id, r.role_id
FROM request_statuses f, request_statuses t, roles r
WHERE f.status_code = 'ASSIGNED' AND t.status_code = 'IN_PROGRESS' AND r.role_code IN ('STAFF', 'SUPERVISOR', 'ADMIN')
ON CONFLICT (from_status_id, to_status_id, allowed_role_id) DO NOTHING;

-- IN_PROGRESS -> RESOLVED (Staff technician, Supervisor, Admin)
INSERT INTO status_transition_rules (from_status_id, to_status_id, allowed_role_id)
SELECT f.status_id, t.status_id, r.role_id
FROM request_statuses f, request_statuses t, roles r
WHERE f.status_code = 'IN_PROGRESS' AND t.status_code = 'RESOLVED' AND r.role_code IN ('STAFF', 'SUPERVISOR', 'ADMIN')
ON CONFLICT (from_status_id, to_status_id, allowed_role_id) DO NOTHING;

-- RESOLVED -> CLOSED (Supervisor, Admin, Requester sign-off)
INSERT INTO status_transition_rules (from_status_id, to_status_id, allowed_role_id)
SELECT f.status_id, t.status_id, r.role_id
FROM request_statuses f, request_statuses t, roles r
WHERE f.status_code = 'RESOLVED' AND t.status_code = 'CLOSED' AND r.role_code IN ('SUPERVISOR', 'ADMIN', 'REQUESTER')
ON CONFLICT (from_status_id, to_status_id, allowed_role_id) DO NOTHING;

-- RESOLVED -> IN_PROGRESS (Reopened on verification failure)
INSERT INTO status_transition_rules (from_status_id, to_status_id, allowed_role_id)
SELECT f.status_id, t.status_id, r.role_id
FROM request_statuses f, request_statuses t, roles r
WHERE f.status_code = 'RESOLVED' AND t.status_code = 'IN_PROGRESS' AND r.role_code IN ('SUPERVISOR', 'ADMIN', 'REQUESTER')
ON CONFLICT (from_status_id, to_status_id, allowed_role_id) DO NOTHING;

-- ---------------------------------------------------------------------
-- 7. SEED BASELINE DEMO ACCOUNTS (Passwords: 'Password123!')
-- ---------------------------------------------------------------------
-- System Administrator
INSERT INTO users (user_id, role_id, email, password_hash, first_name, last_name, phone_number, is_active)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    (SELECT role_id FROM roles WHERE role_code = 'ADMIN'),
    'admin@civicconnect.local',
    crypt('Password123!', gen_salt('bf', 10)),
    'Chris', 'Admin', '+27821112233', TRUE
) ON CONFLICT (email) DO NOTHING;

-- Facilities Supervisor
INSERT INTO users (user_id, role_id, email, password_hash, first_name, last_name, phone_number, is_active)
VALUES (
    'a0000000-0000-0000-0000-000000000002',
    (SELECT role_id FROM roles WHERE role_code = 'SUPERVISOR'),
    'supervisor.fac@civicconnect.local',
    crypt('Password123!', gen_salt('bf', 10)),
    'Sarah', 'Supervisor', '+27822223344', TRUE
) ON CONFLICT (email) DO NOTHING;

-- Field Technician (Facilities)
INSERT INTO users (user_id, role_id, email, password_hash, first_name, last_name, phone_number, is_active)
VALUES (
    'a0000000-0000-0000-0000-000000000003',
    (SELECT role_id FROM roles WHERE role_code = 'STAFF'),
    'tech.john@civicconnect.local',
    crypt('Password123!', gen_salt('bf', 10)),
    'John', 'Technician', '+27823334455', TRUE
) ON CONFLICT (email) DO NOTHING;

-- Technician Profile
INSERT INTO staff_profiles (staff_id, user_id, department_id, employee_number, job_title, is_available)
VALUES (
    'b0000000-0000-0000-0000-000000000003',
    'a0000000-0000-0000-0000-000000000003',
    (SELECT department_id FROM departments WHERE department_code = 'FAC'),
    'EMP-FAC-0104',
    'Senior Facilities Plumber & Pipefitter',
    TRUE
) ON CONFLICT (user_id) DO NOTHING;

-- Community Requester (Citizen / Student)
INSERT INTO users (user_id, role_id, email, password_hash, first_name, last_name, phone_number, is_active)
VALUES (
    'a0000000-0000-0000-0000-000000000004',
    (SELECT role_id FROM roles WHERE role_code = 'REQUESTER'),
    'citizen.jane@civicconnect.local',
    crypt('Password123!', gen_salt('bf', 10)),
    'Jane', 'Requester', '+27824445566', TRUE
) ON CONFLICT (email) DO NOTHING;

-- ---------------------------------------------------------------------
-- 8. SEED VERIFICATION SERVICE REQUEST (REQ-2026-0001)
-- ---------------------------------------------------------------------
INSERT INTO service_requests (
    request_id,
    tracking_reference,
    requester_id,
    category_id,
    priority_id,
    current_status_id,
    assigned_department_id,
    title,
    description,
    location_building,
    location_floor_room,
    is_anonymized_display,
    version,
    submitted_at,
    sla_due_at
) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'REQ-2026-0001',
    'a0000000-0000-0000-0000-000000000004',
    (SELECT category_id FROM request_categories WHERE category_code = 'FAC_FAULT'),
    (SELECT priority_id FROM priorities WHERE priority_code = 'HIGH'),
    (SELECT status_id FROM request_statuses WHERE status_code = 'SUBMITTED'),
    (SELECT department_id FROM departments WHERE department_code = 'FAC'),
    'High-pressure water pipe leak in Science Lab Basement',
    'Clean water spraying rapidly from overhead ceiling pipe onto main electrical distribution conduit.',
    'Science Complex (Building B)',
    'Basement Floor, Room B-12',
    FALSE,
    1,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP + INTERVAL '24 hours'
) ON CONFLICT (tracking_reference) DO NOTHING;

-- Initial Creation Audit Log Entry
INSERT INTO service_request_audit_logs (
    request_id,
    performed_by_user_id,
    action_type,
    old_status_id,
    new_status_id,
    action_comment,
    ip_address
) VALUES (
    'c0000000-0000-0000-0000-000000000001',
    'a0000000-0000-0000-0000-000000000004',
    'CREATE',
    NULL,
    (SELECT status_id FROM request_statuses WHERE status_code = 'SUBMITTED'),
    'Initial service request logged via web portal.',
    '127.0.0.1'
);
