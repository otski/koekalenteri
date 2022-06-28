import { parseISO } from "date-fns";
import { FilterProps } from "./EventStore";
import { RootStore } from "./RootStore";

jest.mock('../api/dog');
jest.mock('../api/event');
jest.mock('../api/judge');
jest.mock('../api/official');
jest.mock('../api/organizer');
jest.mock('../api/eventType');

test('RootStore', async () => {

  const store = new RootStore();

  expect(store.eventTypeStore.eventTypes.length).toEqual(0);
  expect(store.judgeStore.judges.length).toEqual(0);
  expect(store.officialStore.officials.length).toEqual(0);
  expect(store.organizerStore.organizers.length).toEqual(0);

  await store.load();

  expect(store.eventTypeStore.eventTypes.length).toEqual(1);
  expect(store.judgeStore.judges.length).toEqual(3);
  expect(store.officialStore.officials.length).toEqual(3);
  expect(store.organizerStore.organizers.length).toEqual(2);
});

/*

test('EventStore', async () => {
  const rootStore = new RootStore();
  const store = rootStore.eventStore;

  const emptyFilter: FilterProps = {
    start: null,
    end: null,
    eventType: [],
    eventClass: [],
    judge: [],
    organizer: [],
    withClosingEntry: false,
    withFreePlaces: false,
    withOpenEntry: false,
    withUpcomingEntry: false
  };

  expect(store.filteredEvents).toEqual([])
  expect(store.loading).toEqual(false);
  expect(store.loaded).toEqual(false);

  await rootStore.load();

  // empty + defaults
  expect(store.filter).toEqual({ ...emptyFilter, withOpenEntry: true, withUpcomingEntry: true});

  expect(store.loaded).toEqual(true);
  expect(store.filteredEvents.length).toEqual(3);

  const first = store.filteredEvents[0];
  const evt = await store.get(first.eventType, first.id);
  expect(evt).toEqual(first);

  store.setFilter({ ...emptyFilter });
  expect(store.filteredEvents.length).toEqual(5);

  store.setFilter({
    ...emptyFilter,
    start: parseISO('2021-01-01'),
    end: parseISO('2021-02-11')
  });
  expect(store.filteredEvents.length).toEqual(1);
  expect(store.filteredEvents[0]).toMatchObject({ id: 'test1' });

  store.setFilter({
    ...emptyFilter,
    start: parseISO('2021-02-13'),
    end: new Date() // the events relative to today are excluded
  });
  expect(store.filteredEvents.length).toEqual(1);
  expect(store.filteredEvents[0]).toMatchObject({ id: 'test2' });

  store.setFilter({
    ...emptyFilter,
    start: parseISO('2021-02-11'),
    end: parseISO('2021-02-12')
  });
  expect(store.filteredEvents.length).toEqual(2);

  store.setFilter({
    ...emptyFilter,
    eventType: ['type1']
  });
  expect(store.filteredEvents.length).toEqual(1);
  expect(store.filteredEvents[0]).toMatchObject({ id: 'test1' });

  store.setFilter({
    ...emptyFilter,
    eventClass: ['class1']
  });
  expect(store.filteredEvents.length).toEqual(1);
  expect(store.filteredEvents[0]).toMatchObject({ id: 'test1' });

  store.setFilter({
    ...emptyFilter,
    eventType: ['type2'],
    eventClass: ['class1']
  });
  expect(store.filteredEvents.length).toEqual(0);

  store.setFilter({
    ...emptyFilter,
    judge: [123]
  });
  expect(store.filteredEvents.length).toEqual(1);

  store.setFilter({
    ...emptyFilter,
    organizer: [2]
  });
  expect(store.filteredEvents.length).toEqual(1);

  store.setFilter({
    ...emptyFilter,
    withOpenEntry: true
  });
  expect(store.filteredEvents.length).toEqual(2);
  expect(store.filteredEvents[0]).toMatchObject({ id: 'test3' });
  expect(store.filteredEvents[1]).toMatchObject({ id: 'test5' });

  store.setFilter({
    ...emptyFilter,
    withOpenEntry: true,
    withClosingEntry: true
  });
  expect(store.filteredEvents.length).toEqual(1);
  expect(store.filteredEvents[0]).toMatchObject({ id: 'test5' });

  store.setFilter({
    ...emptyFilter,
    withUpcomingEntry: true
  });
  expect(store.filteredEvents.length).toEqual(1);
  expect(store.filteredEvents[0]).toMatchObject({ id: 'test4' });

  store.setFilter({
    ...emptyFilter,
    withOpenEntry: true,
    withFreePlaces: true
  });
  expect(store.filteredEvents.length).toEqual(1);
  expect(store.filteredEvents[0]).toMatchObject({ id: 'test5' });

  store.setFilter({
    ...emptyFilter,
    withOpenEntry: true,
    withUpcomingEntry: true
  });
  expect(store.filteredEvents.length).toEqual(3);
  expect(store.filteredEvents[0]).toMatchObject({ id: 'test3' });
  expect(store.filteredEvents[1]).toMatchObject({ id: 'test4' });
  expect(store.filteredEvents[2]).toMatchObject({ id: 'test5' });

});

test('AdminEventStore', async () => {
  const rootStore = new RootStore();
  await rootStore.load();
  const store = rootStore.adminEventStore;

  expect(store.loading).toEqual(false);
  expect(store.loaded).toEqual(false);

  const promise = store.load();
  expect(store.loading).toEqual(true);
  await promise;
  expect(store.loaded).toEqual(true);
  expect(store.events.length).toEqual(5);

  const origLength = store.events.length;
  const newEvent = await store.save({ eventType: 'saveTest' });
  expect(newEvent?.id).toBeDefined();
  expect(store.events.length).toBe(origLength + 1);

  const deletedEvent = newEvent && (await store.deleteEvent(newEvent));
  expect(deletedEvent).toBeDefined();
  expect(deletedEvent?.deletedAt).toBeDefined();
  expect(store.events.length).toBe(origLength);
});

/**/
