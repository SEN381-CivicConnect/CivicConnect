import { IDomainEvent, IDomainEventObserver, IDomainEventDispatcher } from './IDomainEvent.js';

/**
 * CivicConnect: In-Memory Domain Event Dispatcher (Subject / Event Broker)
 * Standard: ADR-004 & PED v2.0 Section 10
 *
 * Implements the Subject role in the GoF Observer Pattern.
 * Protects domain aggregates from direct dependencies on external notification,
 * audit logging, or messaging infrastructure.
 */
export class DomainEventDispatcher implements IDomainEventDispatcher {
  private static instance: DomainEventDispatcher;
  private observers: Map<string, IDomainEventObserver[]> = new Map();

  private constructor() {}

  public static getInstance(): DomainEventDispatcher {
    if (!DomainEventDispatcher.instance) {
      DomainEventDispatcher.instance = new DomainEventDispatcher();
    }
    return DomainEventDispatcher.instance;
  }

  public register<T extends IDomainEvent>(eventName: string, observer: IDomainEventObserver<T>): void {
    if (!this.observers.has(eventName)) {
      this.observers.set(eventName, []);
    }
    this.observers.get(eventName)!.push(observer as IDomainEventObserver);
  }

  public async dispatch<T extends IDomainEvent>(event: T): Promise<void> {
    const registeredObservers = this.observers.get(event.eventName) || [];
    
    // Execute observers concurrently while isolating failures so one observer
    // does not block others from receiving the event.
    const promises = registeredObservers.map(async (observer) => {
      try {
        await observer.handle(event);
      } catch (error) {
        console.error(`[DomainEventDispatcher] Error in observer for ${event.eventName}:`, error);
        // Error is logged and contained to prevent bubbling into the domain aggregate
      }
    });

    await Promise.all(promises);
  }

  public clearObservers(): void {
    this.observers.clear();
  }
}
