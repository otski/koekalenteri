import { endOfDay, startOfDay, subDays } from "date-fns";
import { JsonEvent, EventState, ContactInfo, Event } from "koekalenteri-shared/model";
import { action, computed, makeObservable, observable } from "mobx";
import { CJudge, COfficial, COrganizer } from ".";
import { toDate, toDateOrNow } from "../../utils";
import type { AdminEventStore } from "../AdminEventStore";
import type { EventStore } from "../EventStore";
import { CEventClass } from "./CEventClass";

export class CEvent implements Omit<Event, 'judges'> {
  accountNumber: string = ""
  allowHandlerMembershipPriority: boolean = false
  allowOwnerMembershipPriority: boolean = false
  classes: Array<CEventClass> = []
  contactInfo?: ContactInfo = {}
  cost: number = 0
  costMember: number = 0
  description: string = ""
  endDate: Date = new Date()
  entries: number = 0
  entryEndDate?: Date
  entryOrigEndDate?: Date
  entryStartDate?: Date
  eventType: string = ""
  id: string = ""
  judges: Array<CJudge> = []
  location: string = ""
  name: string = ""
  official?: COfficial;
  organizer?: COrganizer
  paymentDetails: string = ""
  places: number = 0
  referenceNumber: string = ""
  startDate: Date = new Date()
  state: EventState = "draft"
  store: EventStore | AdminEventStore

  constructor(store: EventStore | AdminEventStore) {
    makeObservable(this, {
      id: false,
      store: false,

      accountNumber: observable,
      allowHandlerMembershipPriority: observable,
      allowOwnerMembershipPriority: observable,
      classes: observable,
      contactInfo: observable,
      cost: observable,
      costMember: observable,
      description: observable,
      endDate: observable,
      entries: observable,
      entryEndDate: observable,
      entryOrigEndDate: observable,
      entryStartDate: observable,
      eventType: observable,
      judges: observable,
      location: observable,
      name: observable,
      official: observable,
      organizer: observable,
      paymentDetails: observable,
      places: observable,
      referenceNumber: observable,
      startDate: observable,
      state: observable,

      allJudgesInClasses: computed,
      isEntryClosing: computed,
      isEntryOpen: computed,
      isEntryUpcoming: computed,
      statusText: computed,

      updateFromJson: action,
      toJSON: false
    });
    this.store = store;
  }

  updateFromJson(json: JsonEvent) {
    this.accountNumber = json.accountNumber;
    this.allowHandlerMembershipPriority = json.allowHandlerMembershipPriority;
    this.allowOwnerMembershipPriority = json.allowOwnerMembershipPriority;
    this.classes = json.classes?.map(jsonClass => new CEventClass(jsonClass, this.store.rootStore.judgeStore)) || [];
    this.contactInfo = json.contactInfo;
    this.cost = json.cost;
    this.costMember = json.costMember;
    this.description = json.description;
    this.endDate = toDateOrNow(json.endDate);
    this.entries = json.entries;
    this.entryEndDate = toDate(json.entryEndDate);
    this.entryOrigEndDate = toDate(json.entryOrigEndDate);
    this.entryStartDate = toDate(json.entryStartDate);
    this.eventType = json.eventType;
    this.id = json.id;
    this.judges = this.store.rootStore.judgeStore.getJudges(json.judges);
    this.location = json.location;
    this.name = json.name;
    this.official = json.official && this.store.rootStore.officialStore.getOfficial(json.official.id)
    this.organizer = json.organizer && this.store.rootStore.organizerStore.getOrganizer(json.organizer.id);
    this.paymentDetails = json.paymentDetails;
    this.places = json.places;
    this.referenceNumber = json.referenceNumber;
    this.startDate = toDateOrNow(json.startDate);
    this.state = json.state;
  }

  get allJudgesInClasses() {
    return this.judges.filter(j => !this.classes.find(c => c.judge?.id === j.id)).length === 0
  }

  get isEntryOpen() {
    const now = new Date();
    return this.state === 'confirmed'
      && !!this.entryStartDate && startOfDay(this.entryStartDate) <= now
      && !!this.entryEndDate && endOfDay(this.entryEndDate) >= now;
  }

  get isEntryClosing() {
    return this.isEntryOpen
      && !!this.entryEndDate && subDays(this.entryEndDate, 7) <= endOfDay(new Date());
  }

  get isEntryUpcoming() {
    return !!this.entryStartDate && this.entryStartDate > new Date();
  }

  get statusText() {
    if (['tentative', 'cancelled'].includes(this.state)) {
      return this.state;
    }

    if (this.entryOrigEndDate) {
      return 'extended'
    }
    return '';
  }

  toJSON(): JsonEvent {
    return {
      accountNumber: this.accountNumber,
      allowHandlerMembershipPriority: this.allowHandlerMembershipPriority,
      allowOwnerMembershipPriority: this.allowOwnerMembershipPriority,
      classes: this.classes?.map(c => c.toJSON()) || [],
      contactInfo: this.contactInfo,
      cost: this.cost,
      costMember: this.costMember,
      description: this.description,
      endDate: this.endDate?.toISOString(),
      entries: this.entries,
      entryEndDate: this.entryEndDate?.toISOString(),
      entryOrigEndDate: this.entryOrigEndDate?.toISOString(),
      entryStartDate: this.entryStartDate?.toISOString(),
      eventType: this.eventType,
      id: this.id,
      judges: this.judges,
      location: this.location,
      name: this.name,
      official: this.official?.toJSON(),
      organizer: this.organizer?.toJSON(),
      paymentDetails: this.paymentDetails,
      places: this.places,
      referenceNumber: this.referenceNumber,
      startDate: this.startDate?.toISOString(),
      state: this.state
    };
  }
}
