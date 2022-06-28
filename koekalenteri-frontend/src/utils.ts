import { parseISO, startOfDay } from "date-fns";

export function entryDateColor(isEntryOpen: boolean, isEntryClosing: boolean, extended?: boolean) {
  if (!isEntryOpen) {
    return 'text.primary';
  }
  if (extended) {
    return 'error.main';
  }
  return isEntryClosing ? 'warning.main' : 'success.main';
}

export function unique(arr: string[]): string[] {
  return arr.filter((c, i, a) => a.indexOf(c) === i);
}

export function uniqueDate(arr: Date[]): Date[] {
  return arr.filter((c, i, a) => a.findIndex(f => f.valueOf() === c.valueOf()) === i);
}

export function toDate(value: string | undefined): Date | undefined {
  return value ? parseISO(value) : undefined;
}

export function toDateOrNow(value: string | undefined): Date {
  return startOfDay(value ? parseISO(value) : new Date());
}
