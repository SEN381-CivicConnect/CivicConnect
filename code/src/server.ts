import { createApp } from './app.js';
import dotenv from 'dotenv';
import { InMemoryServiceRequestRepository } from './infrastructure/repositories/InMemoryServiceRequestRepository.js';
import { CreateServiceRequestUseCase } from './application/use-cases/CreateServiceRequest.js';
import { RequestStatus } from './domain/enums/RequestStatus.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const repository = new InMemoryServiceRequestRepository();

// Pre-seed repository with realistic operational baseline requests
async function initializeDemoData() {
  const createUseCase = new CreateServiceRequestUseCase(repository);

  // 1. Submitted ticket (Pending Triage)
  await createUseCase.execute({
    categoryCode: 'FAC_FAULT',
    title: 'Burst water pipe outside library entrance',
    description: 'Clean water is flowing rapidly across the pedestrian walkway near the main entrance stairs.',
    locationAddress: 'Building A, Room 102 (Walkway)',
    requesterId: 'CIT-2026-101',
    isAnonymizedDisplay: true
  });

  // 2. Assigned ticket (In Queue for Staff)
  const itTicket = await createUseCase.execute({
    categoryCode: 'IT_SUPPORT',
    title: 'Projector bulb burned out during lecture',
    description: 'Hardware asset #PRJ-881 failed to start; lamp indicator flashing red.',
    locationAddress: 'Main Auditorium, Room A1',
    requesterId: 'CIT-2026-102',
    isAnonymizedDisplay: false
  });
  await itTicket.assignTechnician('usr-staff-tech-01', 'sup-manager-01');
  await repository.update(itTicket);

  // 3. In Progress ticket (Technician Dispatched)
  const secTicket = await createUseCase.execute({
    categoryCode: 'SECURITY_HAZARD',
    title: 'Main campus security gate lock failure',
    description: 'North gate access mechanism stuck open, allowing unauthorized vehicle entry.',
    locationAddress: 'North Perimeter, Gate 2',
    requesterId: 'CIT-2026-103',
    isAnonymizedDisplay: true
  });
  await secTicket.assignTechnician('usr-staff-sec-04', 'sup-manager-01');
  await secTicket.transitionToStatus(
    RequestStatus.IN_PROGRESS,
    'usr-staff-sec-04',
    'Security technicians arrived on-site and secured manual barrier.'
  );
  await repository.update(secTicket);
}

initializeDemoData().then(() => {
  const app = createApp(repository);

  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(` CivicConnect Platform Web & API Server (SEN381 NQF 8)`);
    console.log(` Architecture: Clean Layered Monolith`);
    console.log(` Port: ${PORT} | Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Web Portal:   http://localhost:${PORT}/`);
    console.log(` Healthcheck:  http://localhost:${PORT}/health/live`);
    console.log(` REST API:     http://localhost:${PORT}/api/v1/requests`);
    console.log(`=======================================================`);
  });
});

