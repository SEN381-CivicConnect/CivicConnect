import pg from 'pg';
import { IServiceRequestRepository, RequestFilterCriteria } from '../../domain/repositories/IServiceRequestRepository.js';
import { ServiceRequest, ConcurrencyConflictError, ServiceRequestProps } from '../../domain/entities/ServiceRequest.js';
import { RequestStatus } from '../../domain/enums/RequestStatus.js';
import { PriorityLevel } from '../../domain/enums/RoleAndPriority.js';

const { Pool } = pg;

/**
 * PostgreSQL Implementation of IServiceRequestRepository
 * Standards: ADR-006 (OCC Relational Model), ADR-010 (Dual Persistence Architecture)
 * Target Database: PostgreSQL 16+
 * Author: Chris Fourie (602826)
 */
export class PostgresServiceRequestRepository implements IServiceRequestRepository {
  private pool: pg.Pool;

  constructor(pool?: pg.Pool) {
    this.pool = pool || new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 5432,
      database: process.env.DB_NAME || 'civicconnect_db',
      user: process.env.DB_USER || 'civic_admin',
      password: process.env.DB_PASSWORD || 'civic_dev_secret_2026',
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000
    });
  }

  public async ping(): Promise<boolean> {
    try {
      const res = await this.pool.query('SELECT 1 AS alive;');
      return res.rowCount !== null && res.rowCount > 0;
    } catch {
      return false;
    }
  }

  public async save(request: ServiceRequest): Promise<void> {
    const query = `
      INSERT INTO service_requests (
        request_id, reference_number, requester_id, department_id,
        category_id, priority_id, title, description, location_address,
        is_anonymized_display, assigned_staff_id, status_id, version,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);
    `;

    const statusId = this.mapStatusToId(request.status);

    await this.pool.query(query, [
      request.requestId,
      request.referenceNumber,
      request.requesterId,
      request.departmentId,
      request.categoryId,
      request.priorityId,
      request.title,
      request.description,
      request.locationAddress,
      request.isAnonymizedDisplay,
      request.assignedStaffId,
      statusId,
      request.version,
      request.createdAt,
      request.updatedAt
    ]);
  }

  public async update(request: ServiceRequest, expectedVersion?: number): Promise<void> {
    const statusId = this.mapStatusToId(request.status);

    if (expectedVersion !== undefined) {
      // Optimistic Concurrency Control (ADR-006): Ensure database version matches expectedVersion
      const query = `
        UPDATE service_requests
        SET status_id = $1,
            assigned_staff_id = $2,
            version = version + 1,
            updated_at = NOW()
        WHERE request_id = $3 AND version = $4
        RETURNING version;
      `;

      const result = await this.pool.query(query, [
        statusId,
        request.assignedStaffId,
        request.requestId,
        expectedVersion
      ]);

      if (result.rowCount === 0) {
        // Concurrency conflict: query current version for diagnostic error
        const currentRes = await this.pool.query(
          'SELECT version FROM service_requests WHERE request_id = $1;',
          [request.requestId]
        );
        const actualVersion = currentRes.rows[0]?.version || 0;
        throw new ConcurrencyConflictError(request.requestId, expectedVersion, actualVersion);
      }
    } else {
      const query = `
        UPDATE service_requests
        SET status_id = $1,
            assigned_staff_id = $2,
            version = $3,
            updated_at = $4
        WHERE request_id = $5;
      `;

      await this.pool.query(query, [
        statusId,
        request.assignedStaffId,
        request.version,
        request.updatedAt,
        request.requestId
      ]);
    }
  }

  public async findById(requestId: string): Promise<ServiceRequest | null> {
    const query = `
      SELECT r.*, c.category_code, p.priority_code, s.status_code
      FROM service_requests r
      JOIN request_categories c ON r.category_id = c.category_id
      JOIN priorities p ON r.priority_id = p.priority_id
      JOIN request_statuses s ON r.status_id = s.status_id
      WHERE r.request_id = $1;
    `;

    const result = await this.pool.query(query, [requestId]);
    if (result.rows.length === 0) return null;

    return this.mapRowToEntity(result.rows[0]);
  }

  public async findByReferenceNumber(referenceNumber: string): Promise<ServiceRequest | null> {
    const query = `
      SELECT r.*, c.category_code, p.priority_code, s.status_code
      FROM service_requests r
      JOIN request_categories c ON r.category_id = c.category_id
      JOIN priorities p ON r.priority_id = p.priority_id
      JOIN request_statuses s ON r.status_id = s.status_id
      WHERE r.reference_number = $1;
    `;

    const result = await this.pool.query(query, [referenceNumber]);
    if (result.rows.length === 0) return null;

    return this.mapRowToEntity(result.rows[0]);
  }

  public async findMany(criteria: RequestFilterCriteria): Promise<{ requests: ServiceRequest[]; totalCount: number }> {
    const conditions: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (criteria.status) {
      conditions.push(`s.status_code = $${idx++}`);
      values.push(criteria.status);
    }
    if (criteria.departmentId) {
      conditions.push(`r.department_id = $${idx++}`);
      values.push(criteria.departmentId);
    }
    if (criteria.requesterId) {
      conditions.push(`r.requester_id = $${idx++}`);
      values.push(criteria.requesterId);
    }
    if (criteria.assignedStaffId) {
      conditions.push(`r.assigned_staff_id = $${idx++}`);
      values.push(criteria.assignedStaffId);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(*)::int AS count
      FROM service_requests r
      JOIN request_statuses s ON r.status_id = s.status_id
      ${whereClause};
    `;
    const countRes = await this.pool.query(countQuery, values);
    const totalCount = countRes.rows[0]?.count || 0;

    const page = criteria.page || 1;
    const limit = criteria.limit || 20;
    const offset = (page - 1) * limit;

    const selectQuery = `
      SELECT r.*, c.category_code, p.priority_code, s.status_code
      FROM service_requests r
      JOIN request_categories c ON r.category_id = c.category_id
      JOIN priorities p ON r.priority_id = p.priority_id
      JOIN request_statuses s ON r.status_id = s.status_id
      ${whereClause}
      ORDER BY r.created_at DESC
      LIMIT $${idx++} OFFSET $${idx++};
    `;
    values.push(limit, offset);

    const selectRes = await this.pool.query(selectQuery, values);
    const requests = selectRes.rows.map((row) => this.mapRowToEntity(row));

    return { requests, totalCount };
  }

  public async close(): Promise<void> {
    await this.pool.end();
  }

  private mapRowToEntity(row: any): ServiceRequest {
    const props: ServiceRequestProps = {
      requestId: row.request_id,
      referenceNumber: row.reference_number,
      requesterId: row.requester_id,
      departmentId: row.department_id,
      categoryId: row.category_id,
      categoryCode: row.category_code,
      priorityId: row.priority_id,
      priorityCode: row.priority_code as PriorityLevel,
      title: row.title,
      description: row.description,
      locationAddress: row.location_address,
      isAnonymizedDisplay: row.is_anonymized_display,
      assignedStaffId: row.assigned_staff_id,
      status: row.status_code as RequestStatus,
      version: row.version,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    };

    return new ServiceRequest(props);
  }

  private mapStatusToId(status: RequestStatus): number {
    switch (status) {
      case RequestStatus.SUBMITTED: return 1;
      case RequestStatus.TRIAGED: return 2;
      case RequestStatus.ASSIGNED: return 3;
      case RequestStatus.IN_PROGRESS: return 4;
      case RequestStatus.RESOLVED: return 5;
      case RequestStatus.CLOSED: return 6;
      case RequestStatus.REJECTED: return 7;
      default: return 1;
    }
  }
}
