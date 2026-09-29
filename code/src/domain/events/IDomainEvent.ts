/**
 * CivicConnect: Domain Event Interfaces (Observer Pattern)
 * Governing Standard: ADR-004 & PED v2.0 Section 10
 */
export interface IDomainEvent {
  readonly eventId: string;
  readonly occurredOn: Date;
  readonly eventName: string;
}

export interface IDomainEventObserver<T extends IDomainEvent = IDomainEvent> {
  handle(event: T): Promise<void> | void;
}

export interface IDomainEventDispatcher {
  register<T extends IDomainEvent>(eventName: string, observer: IDomainEventObserver<T>): void;
  dispatch<T extends IDomainEvent>(event: T): Promise<void>;
  clearObservers(): void;
}
