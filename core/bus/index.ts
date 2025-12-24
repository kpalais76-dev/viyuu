
import { AppEvent } from '../types';

type EventHandler = (data: any) => void;

class EventBus {
  private static instance: EventBus;
  private events: Map<AppEvent, Set<EventHandler>> = new Map();

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public on(event: AppEvent, handler: EventHandler): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event)?.add(handler);
    
    return () => {
      this.events.get(event)?.delete(handler);
    };
  }

  public emit(event: AppEvent, data?: any) {
    this.events.get(event)?.forEach(handler => handler(data));
  }
}

export default EventBus.getInstance();
