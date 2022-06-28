
import { JsonEvent } from "koekalenteri-shared/model";
import { makeAutoObservable, runInAction } from "mobx";
import { getEvent, getEvents, putEvent, RegistrationResult } from "../api/event";
import { CEvent } from "./classes";
import type { RootStore } from "./RootStore";

export type FilterProps = {
  start: Date | null
  end: Date | null
  withOpenEntry?: boolean
  withClosingEntry?: boolean
  withUpcomingEntry?: boolean
  withFreePlaces?: boolean
  eventType: string[]
  eventClass: string[]
  judge: number[]
  organizer: number[]
}

export class EventStore {
  rootStore
  events: Array<CEvent> = []
  _selectedEvent: CEvent | undefined
  loading = false
  loaded = false
  filter: FilterProps = {
    start: null,
    end: null,
    withOpenEntry: true,
    withUpcomingEntry: true,
    withClosingEntry: false,
    withFreePlaces: false,
    eventType: [],
    eventClass: [],
    judge: [],
    organizer: []
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this, {
      rootStore: false
    })
  }

  get selectedEvent(): CEvent|undefined {
    return this._selectedEvent;
  }

  set selectedEvent(value: CEvent|undefined) {
    this._selectedEvent = value;
  }

  async load(signal?: AbortSignal) {
    if (this.loading) {
      return;
    }
    runInAction(() => {
      this.loading = true;
    });
    const data = await getEvents(signal);
    runInAction(() => {
      data.forEach(json => this.updateEvent(json))
      this.loading = false;
      this.loaded = true;
    });
  }

  async get(eventType: string, id: string, signal?: AbortSignal) {
    const cached = this.events.find(event => event.eventType === eventType && event.id === id);
    if (cached) {
      return cached;
    }
    runInAction(() => {
      this.loading = true;
    });
    const json = await getEvent(eventType, id, signal);
    let event;
    runInAction(() => {
      event = this.updateEvent(json);
      this.loading = false;
    });
    return event;
  }

  async save(event: JsonEvent) {
    try {
      runInAction(() => {
        this.loading = true;
      });
      const saved = await putEvent(event);
      runInAction(() => {
        this.updateEvent(saved);
        this.loading = false;
      });
    } catch (e) {
      console.error(e);
      this.loading = false;
    }
  }

  updateEvent(json: JsonEvent) {
    let event = this.events.find(o => o.id === json.id);
    if (!event) {
      event = new CEvent(this)
      this.events.push(event)
    }
    event.updateFromJson(json)
    return event;
  }

  updateEntries(json: RegistrationResult) {
    let event = this.events.find(o => o.id === json.registration.eventId);
    if (event) {
      event.entries = json.entries;
      if (json.classes.length === event.classes.length) {
        for (let i = 0; i < event.classes.length; i++) {
          event.classes[i].updateFromJson(json.classes[i], this.rootStore.judgeStore);
        }
      }
    }
  }

  setFilter(filter: FilterProps) {
    this.filter = filter;
  }

  get filteredEvents() {
    return this.events.filter(event => {
      return event.state !== 'draft'
        && withinDateFilters(event, this.filter)
        && withinSwitchFilters(event, this.filter)
        && withinArrayFilters(event, this.filter);
    });
  }

  toJSON() { return {} }
}

function withinDateFilters(event: CEvent, { start, end }: FilterProps) {
  if (start && (event.endDate < start)) {
    return false;
  }
  if (end && (event.startDate > end)) {
    return false;
  }
  return true;
}

function withinSwitchFilters(event: CEvent, { withOpenEntry, withClosingEntry, withUpcomingEntry, withFreePlaces }: FilterProps) {
  let result;

  if (withOpenEntry) {
    result =  event.isEntryOpen;
    if (withClosingEntry) {
      result = result && event.isEntryClosing;
    }
    if (withFreePlaces) {
      result = result && event.places > event.entries;
    }
  }

  if (withUpcomingEntry) {
    result = result || event.isEntryUpcoming;
  }

  return result !== false;
}

function withinArrayFilters(event: CEvent, { eventType, eventClass, judge, organizer }: FilterProps) {
  if (eventType.length && !eventType.includes(event.eventType)) {
    return false;
  }
  if (eventClass.length && !eventClass.some(c => event.classes.map(cl => cl.class).includes(c))) {
    return false;
  }
  if (judge.length && !judge.some(id => event.judges?.find(j => j.id === id))) {
    return false;
  }
  if (organizer.length && (!event.organizer || !organizer.includes(event.organizer.id))) {
    return false;
  }
  return true;
}
