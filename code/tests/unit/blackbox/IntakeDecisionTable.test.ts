import { describe, it, expect, beforeEach } from 'vitest';
import { ServiceRequestFactoryRegistry } from '../../../src/domain/factories/CategoryFactories.js';
import { PriorityLevel, SLA_TARGETS } from '../../../src/domain/enums/RoleAndPriority.js';
import { DomainEventDispatcher } from '../../../src/domain/events/DomainEventDispatcher.js';

/**
 * Black-Box Decision Table Testing: Category Polymorphic Intake & Routing
 * Governing Standards: ADR-005, FR-001, FR-002, NFR-005, RSK-004
 *
 * Decision Table Structure:
 * | Rule | Category Code   | Description Valid | Location Valid | Anonymize Input | Dept ID | Priority | Title Prefix     | Anonymize Out |
 * |------|-----------------|-------------------|----------------|-----------------|---------|----------|------------------|---------------|
 * | R1   | FAC_FAULT       | Yes (>= 1 char)   | Yes (Bldg/Rm)  | false           | 1 (FAC) | HIGH     | None             | false         |
 * | R2   | FAC_FAULT       | Yes               | No             | false           | Error   | Error    | Throws Error     | Error         |
 * | R3   | IT_SUPPORT      | Yes (>= 10 chars) | Any            | false           | 2 (IT)  | MEDIUM   | None             | false         |
 * | R4   | IT_SUPPORT      | No (< 10 chars)   | Any            | false           | Error   | Error    | Throws Error     | Error         |
 * | R5   | SECURITY_HAZARD | Yes               | Any            | undefined       | 3 (SEC) | CRITICAL | [EMERGENCY]      | true (Default)|
 * | R6   | SECURITY_HAZARD | Yes               | Any            | false           | 3 (SEC) | CRITICAL | [EMERGENCY]      | false         |
 * | R7   | GENERAL_MAINT   | Yes               | Any            | false           | 4 (MNT) | LOW      | None             | false         |
 * | R8   | LOST_PROPERTY   | Yes               | Any            | false           | 3 (SEC) | LOW      | [LOST PROPERTY]  | false         |
 * | R9   | UNKNOWN_CAT     | Any               | Any            | Any             | Error   | Error    | Throws Error     | Error         |
 */
describe('Black-Box Decision Table Testing: Polymorphic Category Intake (ADR-005, FR-001, FR-002)', () => {
  const registry = ServiceRequestFactoryRegistry.getInstance();

  beforeEach(() => {
    DomainEventDispatcher.getInstance().clearObservers();
  });

  it('Rule R1: FAC_FAULT with valid location routes to Dept 1 (Facilities) with HIGH priority', () => {
    const factory = registry.getFactory('FAC_FAULT');
    const req = factory.create({
      requesterId: 'citizen-201',
      categoryCode: 'FAC_FAULT',
      title: 'Restroom pipe overflow',
      description: 'Water leaking into common area',
      locationAddress: 'Main Building, Room 102',
      isAnonymizedDisplay: false
    });

    expect(req.departmentId).toBe(1);
    expect(req.priorityCode).toBe(PriorityLevel.HIGH);
    expect(req.title).toBe('Restroom pipe overflow');
    expect(req.isAnonymizedDisplay).toBe(false);
    expect(SLA_TARGETS[req.priorityCode].resolutionHours).toBe(24);
  });

  it('Rule R2: FAC_FAULT lacking building/room/campus fails validation', () => {
    const factory = registry.getFactory('FAC_FAULT');
    expect(() => {
      factory.create({
        requesterId: 'citizen-201',
        categoryCode: 'FAC_FAULT',
        title: 'Broken bench',
        description: 'Wood slats broken',
        locationAddress: 'Near east gate parking lot'
      });
    }).toThrow(/Validation Failure \(FAC_FAULT\)/);
  });

  it('Rule R3: IT_SUPPORT with >= 10 chars description routes to Dept 2 (IT) with MEDIUM priority', () => {
    const factory = registry.getFactory('IT_SUPPORT');
    const req = factory.create({
      requesterId: 'citizen-202',
      categoryCode: 'IT_SUPPORT',
      title: 'Lab workstation offline',
      description: 'Workstation 14 does not power on after reboot',
      locationAddress: 'Computer Lab 3',
      isAnonymizedDisplay: false
    });

    expect(req.departmentId).toBe(2);
    expect(req.priorityCode).toBe(PriorityLevel.MEDIUM);
    expect(req.title).toBe('Lab workstation offline');
    expect(SLA_TARGETS[req.priorityCode].resolutionHours).toBe(72);
  });

  it('Rule R4: IT_SUPPORT with < 10 chars description fails validation', () => {
    const factory = registry.getFactory('IT_SUPPORT');
    expect(() => {
      factory.create({
        requesterId: 'citizen-202',
        categoryCode: 'IT_SUPPORT',
        title: 'Lab workstation offline',
        description: 'Broken PC',
        locationAddress: 'Computer Lab 3'
      });
    }).toThrow(/Validation Failure \(IT_SUPPORT\)/);
  });

  it('Rule R5: SECURITY_HAZARD with undefined anonymization defaults to true and adds [EMERGENCY] prefix', () => {
    const factory = registry.getFactory('SECURITY_HAZARD');
    const req = factory.create({
      requesterId: 'citizen-203',
      categoryCode: 'SECURITY_HAZARD',
      title: 'Suspicious individual tampering with lock',
      description: 'Individual observed attempting to force open server room door',
      locationAddress: 'Admin Block, Ground Floor'
      // isAnonymizedDisplay omitted to test default behavior
    });

    expect(req.departmentId).toBe(3);
    expect(req.priorityCode).toBe(PriorityLevel.CRITICAL);
    expect(req.title).toBe('[EMERGENCY] Suspicious individual tampering with lock');
    expect(req.isAnonymizedDisplay).toBe(true);
    expect(SLA_TARGETS[req.priorityCode].triageHours).toBe(1);
    expect(SLA_TARGETS[req.priorityCode].resolutionHours).toBe(8);
  });

  it('Rule R6: SECURITY_HAZARD preserves explicit isAnonymizedDisplay=false when citizen opts out', () => {
    const factory = registry.getFactory('SECURITY_HAZARD');
    const req = factory.create({
      requesterId: 'citizen-203',
      categoryCode: 'SECURITY_HAZARD',
      title: 'Fire exit door jammed',
      description: 'Emergency exit bar stuck in locked position',
      locationAddress: 'Lecture Hall 1 Exit B',
      isAnonymizedDisplay: false
    });

    expect(req.departmentId).toBe(3);
    expect(req.priorityCode).toBe(PriorityLevel.CRITICAL);
    expect(req.isAnonymizedDisplay).toBe(false);
  });

  it('Rule R7: GENERAL_MAINT routes to Dept 4 (Maintenance) with LOW priority and preserves title', () => {
    const factory = registry.getFactory('GENERAL_MAINT');
    const req = factory.create({
      requesterId: 'citizen-204',
      categoryCode: 'GENERAL_MAINT',
      title: 'Graffiti on courtyard wall',
      description: 'Spray paint on south courtyard brick wall',
      locationAddress: 'Central Courtyard',
      isAnonymizedDisplay: false
    });

    expect(req.departmentId).toBe(4);
    expect(req.priorityCode).toBe(PriorityLevel.LOW);
    expect(req.title).toBe('Graffiti on courtyard wall');
    expect(SLA_TARGETS[req.priorityCode].resolutionHours).toBe(120);
  });

  it('Rule R8: LOST_PROPERTY routes to Dept 3 (Security Custodial) with LOW priority and [LOST PROPERTY] prefix', () => {
    const factory = registry.getFactory('LOST_PROPERTY');
    const req = factory.create({
      requesterId: 'citizen-205',
      categoryCode: 'LOST_PROPERTY',
      title: 'Blue student backpack',
      description: 'Left behind on bench containing notebook and water bottle',
      locationAddress: 'Campus Cafeteria Outside Patio',
      isAnonymizedDisplay: false
    });

    expect(req.departmentId).toBe(3);
    expect(req.priorityCode).toBe(PriorityLevel.LOW);
    expect(req.title).toBe('[LOST PROPERTY] Blue student backpack');
  });

  it('Rule R9: Unknown category throws descriptive unsupported error', () => {
    expect(() => {
      registry.getFactory('HAZMAT_DISPOSAL');
    }).toThrow(/Unsupported service request category code: 'HAZMAT_DISPOSAL'/);
  });

  it('Alias resolution: accepts GEN_MAINT and LOST_PROP shorthand codes', () => {
    const genMaintFactory = registry.getFactory('GEN_MAINT');
    const lostPropFactory = registry.getFactory('LOST_PROP');

    expect(genMaintFactory).toBeDefined();
    expect(lostPropFactory).toBeDefined();
  });
});
