import { addDays, parseISO, startOfDay } from 'date-fns';
import { JsonAdminEvent, JsonEvent, JsonRegistration, JsonJudge } from 'koekalenteri-shared/model';
import { emptyEvent } from '../test-utils/emptyEvent';

const today = startOfDay(new Date());

const judge2: JsonJudge = {
  id: 223,
  name: 'test judge',
  phone: 'phone',
  email: 'email',
  location: 'location',
  district: 'district',
  eventTypes: ['NOME-B'],
  languages: ['fi']
};

const mockEvents: JsonAdminEvent[] = [
  {
    ...emptyEvent,
    id: 'test1',
    eventType: 'type1',
    classes: [{ class: 'class1' }],
    startDate: parseISO('2021-02-10').toISOString(),
    endDate: parseISO('2021-02-11').toISOString(),
    entryStartDate: parseISO('2021-02-01').toISOString(),
    entryEndDate: parseISO('2021-02-07').toISOString(),
    judges: [{ id: 123, name: 'judge test' } as JsonJudge],
    location: 'test location'
  },
  {
    ...emptyEvent,
    id: 'test2',
    organizer: {
      id: 2,
      name: 'Test org'
    },
    eventType: 'NOME-B',
    classes: [
      { class: 'ALO', date: parseISO('2021-02-12').toISOString(), judge: judge2 },
      { class: 'AVO', date: parseISO('2021-02-13').toISOString(), judge: judge2 }
    ],
    startDate: parseISO('2021-02-12').toISOString(),
    endDate: parseISO('2021-02-13').toISOString(),
    entryStartDate: parseISO('2021-02-01').toISOString(),
    entryEndDate: parseISO('2021-02-10').toISOString(),
    judges: [judge2],
  },
  {
    ...emptyEvent,
    id: 'test3',
    eventType: 'type3',
    classes: [{ class: 'class3' }],
    startDate: addDays(today, 14).toISOString(),
    endDate: addDays(today, 15).toISOString(),
    entryStartDate: today.toISOString(), // entry starts today
    entryEndDate: addDays(today, 8).toISOString(), // over week from today
    judges: [{ id: 223, name: 'test judge' } as JsonJudge],
    places: 10,
    entries: 10,
  },
  {
    ...emptyEvent,
    id: 'test4',
    eventType: 'type4',
    classes: [{ class: 'class4' }],
    startDate: addDays(today, 14).toISOString(),
    endDate: addDays(today, 15).toISOString(),
    entryStartDate: addDays(today, 1).toISOString(), // entry not open yet
    entryEndDate: addDays(today, 8).toISOString(),
    judges: [{ id: 223, name: 'test judge' } as JsonJudge],
    places: 10,
    entries: 0,
  },
  {
    ...emptyEvent,
    id: 'test5',
    eventType: 'type5',
    classes: [{ class: 'class5' }],
    startDate: addDays(today, 24).toISOString(),
    endDate: addDays(today, 25).toISOString(),
    entryStartDate: addDays(today, -1).toISOString(),
    entryEndDate: addDays(today, 6).toISOString(),
    judges: [{ id: 223, name: 'test judge' } as JsonJudge],
    places: 10,
    entries: 9,
  },
];

export async function getEvents(): Promise<JsonEvent[]> {
  return new Promise((resolve) => {
    process.nextTick(() => resolve(mockEvents));
  });
}

export async function getAdminEvents(): Promise<JsonAdminEvent[]> {
  return new Promise((resolve) => {
    process.nextTick(() => resolve(mockEvents));
  });
}

export async function getEvent(eventType: string, id: string): Promise<JsonEvent> {
  return new Promise((resolve, reject) => {
    const event = mockEvents.find(item => item.eventType === eventType && item.id === id);
    process.nextTick(() => event
      ? resolve(event)
      : reject('Event not found by eventType: ' + eventType + ' and id: ' + id)
    );
  });
}

export async function putEvent(event: JsonAdminEvent): Promise<JsonAdminEvent> {
  console.log(event);
  return new Promise((resolve, reject) => {
    let fullEvent: JsonAdminEvent | undefined;
    if (event) {
      if (!event.id) {
        event.id = 'test' + (mockEvents.length + 1);
        mockEvents.push(event);
        fullEvent = event;
      } else {
        fullEvent = mockEvents.find(e => e.id === event.id);
        if (fullEvent) {
          Object.assign(fullEvent, event);
          fullEvent.modifiedAt = new Date().toISOString();
          fullEvent.modifiedBy = 'mock put';
        }
      }
    }
    process.nextTick(() => fullEvent ? resolve(fullEvent) : reject('putEvent: Can not save undefined as event.'));
  });
}

export async function getRegistrations(eventId: string, signal?: AbortSignal): Promise<JsonRegistration[]> {
  return new Promise((resolve, reject) => {
    const event = mockEvents.find(item => item.id === eventId);
    if (!event) {
      reject();
    } else {
      process.nextTick(() => resolve([]));
    }
  });
}
