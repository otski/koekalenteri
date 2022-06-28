import { parseISO } from "date-fns";
import { JsonEvent } from "koekalenteri-shared/model";
import { emptyEvent } from "../../api/test-utils/emptyEvent";
import { RootStore } from "../RootStore";
import { CEvent } from "./CEvent";

const event: JsonEvent = {
  ...emptyEvent,
  entryStartDate:'2021-01-02',
  entryEndDate: '2021-01-13',
}

const store = new RootStore();
const testEvent = new CEvent(store.eventStore);
testEvent.updateFromJson(event);

test.each([
  { date: '2021-01-01 23:59', open: false, closing: false, upcoming: true },
  { date: '2021-01-02', open: true, closing: false, upcoming: false },
  { date: '2021-01-02 00:00', open: true, closing: false, upcoming: false },
  { date: '2021-01-05', open: true, closing: false, upcoming: false },
  { date: '2021-01-06', open: true, closing: true, upcoming: false },
  { date: '2021-01-13', open: true, closing: true, upcoming: false },
  { date: '2021-01-13 23:59', open: true, closing: true, upcoming: false },
  { date: '2021-01-14 00:00', open: false, closing: false, upcoming: false },
])(`When entry is 2021-01-02 to 2021-01-13, @$date: isEntryOpen: $open, isEntryClosing: $closing, isEntryUpcoming: $upcoming`, ({ date, open, closing, upcoming }) => {
  jest.useFakeTimers();

  /**
   * Using parseISO here, because new Date() for a date without time defaults to midnight in GMT.
   * new Date() could also be inconsistent between browsers.
   * We want midnight in current timezone.
   */
  jest.setSystemTime(parseISO(date));

  expect(testEvent.isEntryOpen).toEqual(open);
  expect(testEvent.isEntryClosing).toEqual(closing);
  expect(testEvent.isEntryUpcoming).toEqual(upcoming);

  jest.useRealTimers();
});
