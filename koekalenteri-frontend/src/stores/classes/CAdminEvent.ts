import { add, differenceInDays, eachDayOfInterval, isSameDay } from "date-fns";
import { Secretary, Headquarters, AdminEvent, JsonAdminEvent, VisibleContactInfo, EventClass } from "koekalenteri-shared/model";
import { action, computed, makeObservable, observable, override, runInAction } from "mobx";
import { getRegistrations } from "../../api/event";
import { toDate, toDateOrNow } from "../../utils";
import { AdminEventStore } from "../AdminEventStore";
import { CEvent } from "./CEvent";
import { CRegistration } from "./CRegistration";

export class CAdminEvent extends CEvent implements Omit<AdminEvent, 'judges' | 'official' | 'organizer' | 'secretary'> {
  _registrations?: CRegistration[]
  createdAt: Date = new Date()
  createdBy: string = ''
  deletedAt?: Date
  deletedBy?: string
  headquerters?: Partial<Headquarters>
  kcId?: number
  modifiedAt: Date = new Date()
  modifiedBy: string = ''
  secretary?: Secretary
  store: AdminEventStore
  visibleContactInfo = {} as VisibleContactInfo

  constructor(store: AdminEventStore) {
    super(store)
    makeObservable(this, {
      _registrations: observable,
      avalableClasses: computed,
      createdAt: observable,
      createdBy: observable,
      deletedAt: observable,
      deletedBy: observable,
      endDate: override,
      headquerters: observable,
      kcId: observable,
      modifiedAt: observable,
      modifiedBy: observable,
      registrations: computed,
      secretary: observable,
      setDates: action,
      setJudge: action,
      setType: action,
      startDate: override,
      store: false,
      toJSON: false,
      updateFromJson: override,
      visibleContactInfo: observable,
    });
    this.store = store;
  }

  updateFromJson(json: JsonAdminEvent) {
    super.updateFromJson(json);
    this.createdAt = toDateOrNow(json.createdAt);
    this.createdBy = json.createdBy;
    this.deletedAt = toDate(json.deletedAt);
    this.deletedBy = json.deletedBy;
    this.headquerters = json.headquerters;
    this.kcId = json.kcId;
    this.modifiedAt = toDateOrNow(json.modifiedAt);
    this.modifiedBy = json.modifiedBy;
    this.secretary = json.secretary;
  }

  setType(newType: string) {
    console.log('setType', newType);
    this.eventType = newType;
    if (!this.store.rootStore.eventTypeClasses[newType]) {
      this.classes = [];
    }
  }

  setDates(start: Date = this.startDate, end: Date = this.endDate) {
    console.log('setDates', start, end);
    if (!isSameDay(start, this.startDate) && isSameDay(end, this.endDate)) {
      // startDate changed and endDate remained the same => change endDate based on the previous distance between days
      end = add(start, { days: differenceInDays(this.endDate, this.startDate) });
    }

    const offset = differenceInDays(start, this.startDate);
    if (offset) {
      for (const c of this.classes) {
        c.date = add(c.date || this.startDate, { days: offset });
      }
    }

    this.startDate = start;
    this.endDate = end;
    const filtered = this.classes.filter(c => !c.date || (c.date >= start && c.date <= end));
    if (filtered.length !== this.classes.length) {
      this.classes = filtered;
    }

    this.entryStartDate = this.entryStartDate && add(this.entryStartDate, { days: offset });
    this.entryEndDate = this.entryEndDate && add(this.entryEndDate, { days: offset });
  }

  setJudge(index: number, id?: number) {
    const judge = this.store.rootStore.judgeStore.getJudge(id);
    const removeCount = this.judges.length >= index - 1 ? 1 : 0;
    let oldId;
    if (judge) {
      oldId = this.judges.splice(index, removeCount, judge)[0]?.id;
    } else if (removeCount) {
      oldId = this.judges.splice(index, removeCount)[0]?.id;
    }
    if (oldId) {
      for (const c of this.classes) {
        if (c.judge?.id === oldId) {
          c.judge = judge;
        }
      }
    }
  }

  get avalableClasses() {
    const result: EventClass[] = [];
    const typeClasses = this.store.rootStore.eventTypeClasses[this.eventType] || [];
    if (typeClasses.length === 0) {
      return result;
    }
    const days = this.startDate <= this.endDate ? eachDayOfInterval({
      start: this.startDate,
      end: this.endDate
    }) : [];
    for (const day of days) {
      result.push(...typeClasses.map(c => ({ class: c, date: day })));
    }
    return result;

  }
  get registrations(): CRegistration[] {
    if (!this._registrations) {
      this._registrations = [];
      runInAction(async () => {
        this._registrations = await this.store.rootStore.registrationStore.loadAll(this.id)
        console.log(this._registrations);
      });
    }
    return this._registrations;
  }

  toJSON(): JsonAdminEvent {
    const base = super.toJSON();
    return {
      ...base,
      createdAt: this.createdAt?.toISOString(),
      createdBy: this.createdBy,
      deletedAt: this.deletedAt?.toISOString(),
      deletedBy: this.deletedBy,
      headquerters: this.headquerters,
      kcId: this.kcId,
      modifiedAt: this.modifiedAt?.toISOString(),
      modifiedBy: this.modifiedBy,
      secretary: this.secretary,
    };
  }
}
