import { describe, it, expect, beforeEach } from 'vitest';
import { ServiceRequestFactoryRegistry } from '../../../src/domain/factories/CategoryFactories.js';
import { ServiceRequest } from '../../../src/domain/entities/ServiceRequest.js';
import { RequestStatus } from '../../../src/domain/enums/RequestStatus.js';
import { PriorityLevel } from '../../../src/domain/enums/RoleAndPriority.js';
import { DomainEventDispatcher } from '../../../src/domain/events/DomainEventDispatcher.js';

describe('Black-Box Input Validation: Equivalence Partitioning & Boundary Value Analysis', () => {
  const registry = ServiceRequestFactoryRegistry.getInstance();

  beforeEach(() => {
    DomainEventDispatcher.getInstance().clearObservers();
  });

  describe('IT Support Description Length (BVA & EP - FR-001, AC-001.2, RSK-004)', () => {
    // Equivalence Partitions:
    // Partition 1 (Invalid): description length < 10 characters (rejection expected)
    // Partition 2 (Valid):   description length >= 10 characters (creation expected)
    // Boundary values evaluated around threshold (N = 10): 9 (N-1), 10 (N), 11 (N+1)

    it('rejects description at boundary length 9 (N-1 below valid partition)', () => {
      const itFactory = registry.getFactory('IT_SUPPORT');
      const input9Chars = '123456789'; // 9 chars

      expect(() => {
        itFactory.create({
          requesterId: 'user-001',
          categoryCode: 'IT_SUPPORT',
          title: 'Laptop display flicker',
          description: input9Chars,
          locationAddress: 'Library Floor 1'
        });
      }).toThrow(/Validation Failure \(IT_SUPPORT\): Description must specify device or connectivity details/);
    });

    it('accepts description at exact boundary length 10 (N minimum valid threshold)', () => {
      const itFactory = registry.getFactory('IT_SUPPORT');
      const input10Chars = '1234567890'; // 10 chars

      const request = itFactory.create({
        requesterId: 'user-001',
        categoryCode: 'IT_SUPPORT',
        title: 'Laptop display flicker',
        description: input10Chars,
        locationAddress: 'Library Floor 1'
      });

      expect(request).toBeDefined();
      expect(request.description).toBe(input10Chars);
      expect(request.categoryCode).toBe('IT_SUPPORT');
    });

    it('accepts description at boundary length 11 (N+1 within valid partition)', () => {
      const itFactory = registry.getFactory('IT_SUPPORT');
      const input11Chars = '12345678901'; // 11 chars

      const request = itFactory.create({
        requesterId: 'user-001',
        categoryCode: 'IT_SUPPORT',
        title: 'Laptop display flicker',
        description: input11Chars,
        locationAddress: 'Library Floor 1'
      });

      expect(request).toBeDefined();
      expect(request.description).toBe(input11Chars);
    });
  });

  describe('Facilities Location Identifier Partitions (EP - FR-001, AC-001.1)', () => {
    // Equivalence Partitions for Facilities Location:
    // Valid Partition A: address contains "building" (case-insensitive)
    // Valid Partition B: address contains "room" (case-insensitive)
    // Valid Partition C: address contains "campus" (case-insensitive)
    // Invalid Partition D: address lacks any recognized structure identifier

    const facFactory = registry.getFactory('FAC_FAULT');

    it('accepts location belonging to Valid Partition A (contains "building")', () => {
      const req = facFactory.create({
        requesterId: 'user-002',
        categoryCode: 'FAC_FAULT',
        title: 'Broken air conditioner',
        description: 'Unit leaking coolant onto hallway',
        locationAddress: 'Engineering Building, Wing B'
      });
      expect(req.departmentId).toBe(1);
    });

    it('accepts location belonging to Valid Partition B (contains "room")', () => {
      const req = facFactory.create({
        requesterId: 'user-002',
        categoryCode: 'FAC_FAULT',
        title: 'Projector ceiling bracket loose',
        description: 'Bracket vibrating during lecture',
        locationAddress: 'Seminar Room 302'
      });
      expect(req.departmentId).toBe(1);
    });

    it('accepts location belonging to Valid Partition C (contains "campus")', () => {
      const req = facFactory.create({
        requesterId: 'user-002',
        categoryCode: 'FAC_FAULT',
        title: 'Irrigation valve leak',
        description: 'Sprinkler head cracked near cafeteria pathway',
        locationAddress: 'Main Campus East Walkway'
      });
      expect(req.departmentId).toBe(1);
    });

    it('rejects location belonging to Invalid Partition D (missing building/room/campus)', () => {
      expect(() => {
        facFactory.create({
          requesterId: 'user-002',
          categoryCode: 'FAC_FAULT',
          title: 'Damaged bench',
          description: 'Wooden slats splintered',
          locationAddress: 'Near the oak tree by south parking'
        });
      }).toThrow(/Validation Failure \(FAC_FAULT\): Location address must specify a Building or Room identifier/);
    });
  });

  describe('Resolution Notes Mandatory Boundary on RESOLVED (BVA & EP - FR-011, AC-011.1)', () => {
    // Equivalence Partitions for actionNotes when transitioning to RESOLVED:
    // Partition 1 (Invalid): empty string or whitespace-only
    // Partition 2 (Valid):   contains at least 1 non-whitespace character

    const createInProgressRequest = async () => {
      const req = new ServiceRequest({
        requesterId: 'user-003',
        departmentId: 1,
        categoryId: 1,
        categoryCode: 'FAC_FAULT',
        priorityId: 2,
        priorityCode: PriorityLevel.MEDIUM,
        title: 'Light ballast humming loudly',
        description: 'Flickering fluorescent tube in laboratory',
        locationAddress: 'Science Building, Room 104'
      });
      await req.transitionToStatus(RequestStatus.TRIAGED, 'supervisor-001');
      await req.assignTechnician('tech-001', 'supervisor-001');
      await req.transitionToStatus(RequestStatus.IN_PROGRESS, 'tech-001');
      return req;
    };

    it('rejects transition to RESOLVED when actionNotes is empty string (length 0 boundary)', async () => {
      const req = await createInProgressRequest();
      await expect(
        req.transitionToStatus(RequestStatus.RESOLVED, 'tech-001', '')
      ).rejects.toThrow(/FR-011 Mandate: Action notes and resolution details must be provided/);
    });

    it('rejects transition to RESOLVED when actionNotes contains whitespace only', async () => {
      const req = await createInProgressRequest();
      await expect(
        req.transitionToStatus(RequestStatus.RESOLVED, 'tech-001', '   \t  \n ')
      ).rejects.toThrow(/FR-011 Mandate: Action notes and resolution details must be provided/);
    });

    it('accepts transition to RESOLVED at boundary of 1 non-whitespace character', async () => {
      const req = await createInProgressRequest();
      await req.transitionToStatus(RequestStatus.RESOLVED, 'tech-001', 'Fixed');
      expect(req.status).toBe(RequestStatus.RESOLVED);
      expect(req.version).toBe(5);
    });
  });
});
