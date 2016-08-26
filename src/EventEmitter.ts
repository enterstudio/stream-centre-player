
export abstract class EventEmitter {
    private eventsRegistrations: IRegisteredListeners[];

    constructor() {
        this.eventsRegistrations = [];
    }

    addEventListener(type: string, listener: IEventListener): void {
        let registration = this.eventsRegistrations.filter(r => r.eventName === type)[0];
        if (!registration) {
            registration = { eventName: type, listeners: [] };
            this.eventsRegistrations.push(registration);
        }
        registration.listeners.push(listener);
    }

    removeEventListener(type: string, listener: IEventListener): void {
        let registration = this.eventsRegistrations.filter(r => r.eventName === type)[0];
        if (registration) {
            let i = registration.listeners.indexOf(listener);
            if (i !== -1) {
                registration.listeners.splice(i, 1);
            }
        }
    }

    protected dispatchEvent<T extends IEvent>(type: string, eventObj: T): void {
        let registration = this.eventsRegistrations.filter(r => r.eventName === type)[0],
            errors: Error[] = [];
        registration.listeners.forEach(listener => {
            try {
                listener(eventObj);
            } catch (e) {
                errors.push(e);
            }
        });
        errors.forEach(e => window.setTimeout(() => { throw e }, 0));
    }
}

interface IRegisteredListeners {
    eventName: string;
    listeners: IEventListener[];
}

interface IEventListener {
    (e: IEvent): any;
}

interface IEvent {
    type: string;
}