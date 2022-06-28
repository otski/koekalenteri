import { AdminEvent, JsonAdminEvent } from "koekalenteri-shared/model";
import { makeAutoObservable, runInAction } from "mobx";
import { getAdminEvents, putEvent } from "../api/event";
import { CAdminEvent } from "./classes/CAdminEvent";
import { CRegistration } from "./classes/CRegistration";
import type { RootStore } from "./RootStore";

export class AdminEventStore {
  rootStore
  events: Array<CAdminEvent> = []
  _selectedEvent: CAdminEvent | undefined
  _registrations: Array<CRegistration> = [];
  _newEvent: Partial<AdminEvent> = {}
  loading = false
  loaded = false

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this, {
      rootStore: false
    })
  }

  async load(signal?: AbortSignal) {
    if (this.loading) {
      return;
    }
    runInAction(() => {
      this.loading = true;
    });
    const data = await getAdminEvents(signal);
    runInAction(() => {
      data.forEach(json => this.updateEvent(json))
      this.loading = false;
      this.loaded = true;
    });
  }

  find(id: string) {
    return this.events.find(event => event.id === id);
  }

  get selectedEvent() {
    return this._selectedEvent;
  }
  set selectedEvent(event: CAdminEvent | undefined) {
    this._selectedEvent = event;
  }

  get newEvent() {
    return this._newEvent;
  }
  set newEvent(event: Partial<AdminEvent>) {
    this._newEvent = event;
  }

  get registrations() {
    return [];
  }

  async save(event: CAdminEvent) {
    let result: CAdminEvent | undefined;
    try {
      runInAction(() => {
        this.loading = true;
      });
      const saved = await putEvent(event.toJSON());
      runInAction(() => {
        result = this.updateEvent(saved);
        this.loading = false;
      });
    } catch (e) {
      console.error(e);
      this.loading = false;
    }
    return result;
  }

  async deleteEvent(eventId: string) {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index > -1) {
      const event = this.events[index];
      event.deletedAt = new Date();
      event.deletedBy = 'user';
      const saved = await this.save(event);
      this.events.splice(index, 1);
      return saved;
    }
  }

  updateEvent(json: JsonAdminEvent) {
    let event = this.events.find(o => o.id === json.id);
    if (!event) {
      event = new CAdminEvent(this)
      this.events.push(event)
    }
    event.updateFromJson(json)
    return event;
  }

  get filteredEvents() {
    return this.events;
  }

  toJSON() { return {} }
}
