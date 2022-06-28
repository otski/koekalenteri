import { JsonRegistration, Language, Registration, RegistrationBreeder, RegistrationDate, RegistrationPerson, ReserveChoise } from "koekalenteri-shared/model";
import { makeAutoObservable } from "mobx";
import { toDate } from "../../utils";
import { RegistrationStore } from "../RegistrationStore";
import { CDog } from "./CDog";
import { CTestResult } from "./CTestResult";

export class CRegistration implements Omit<Registration, 'dog' | 'qualifyingResults' | 'results'> {
  agreeToPublish: boolean = false;
  agreeToTerms: boolean = false;
  breeder: RegistrationBreeder = {} as RegistrationBreeder;
  class: string = '';
  createdAt: Date = new Date();
  createdBy: string = '';
  dates: RegistrationDate[] = [];
  deletedAt?: Date;
  deletedBy?: string | undefined;
  dog = new CDog();
  eventId: string = '';
  eventType: string = '';
  handler: RegistrationPerson = {} as RegistrationPerson;
  id: string = '';
  language: Language = 'fi';
  modifiedAt: Date = new Date();
  modifiedBy: string = '';
  notes: string = '';
  owner: RegistrationPerson = {} as RegistrationPerson;
  private _handlerCached?: RegistrationPerson;
  private _ownerHandles?: boolean | undefined;
  qualifyingResults: CTestResult[] = [];
  reserve: ReserveChoise = 'ANY';
  results: CTestResult[] = [];
  store: RegistrationStore;

  constructor(store: RegistrationStore) {
    this.store = store;

    makeAutoObservable(this, {
      store: false,
    });
  }

  get ownerHandles() { return this._ownerHandles }
  set ownerHandles(v) {
    this._ownerHandles = v;
    if (v) {
      this._handlerCached = this.handler;
      this.handler = this.owner;
    } else {
      this.handler = this._handlerCached || {} as RegistrationPerson;
    }
  }

  updateFromJson(json: JsonRegistration) {
    this.agreeToPublish = json.agreeToPublish;
    this.agreeToTerms = json.agreeToTerms;
    this.breeder = json.breeder;
    this.class = json.class || '';
    this.createdAt = new Date(json.createdAt);
    this.createdBy = json.createdBy;
    this.dates = json.dates.map(d => ({ date: new Date(d.date), time: d.time }));
    this.deletedAt = toDate(json.deletedAt);
    this.deletedBy = json.deletedBy;
    this.dog = new CDog();
    if (json.dog) {
      this.dog.updateFromJson(json.dog);
    }
    this.eventId = json.eventId;
    this.eventType = json.eventType;
    this.handler = json.handler;
    this.id = json.id;
    this.language = json.language;
    this.modifiedAt = new Date(json.modifiedAt);
    this.modifiedBy = json.modifiedBy;
    this.notes = json.notes;
    this.owner = json.owner;
    this._ownerHandles = json.ownerHandles;
    this.reserve = json.reserve || 'ANY';
    this.results = json.results?.map(jr => {
      const r = new CTestResult(this.dog);
      r.updateFromJson(jr);
      return r;
    }) || [];
  }

  toJSON(): JsonRegistration {
    return {
      agreeToPublish: this.agreeToPublish,
      agreeToTerms: this.agreeToTerms,
      breeder: this.breeder,
      class: this.class,
      createdAt: this.createdAt.toISOString(),
      createdBy: this.createdBy,
      dates: this.dates.map(d => ({ date: d.date.toISOString(), time: d.time })),
      deletedAt: this.deletedAt?.toISOString(),
      deletedBy: this.deletedBy,
      dog: this.dog?.toJSON(),
      eventId: this.eventId,
      eventType: this.eventType,
      handler: this.handler,
      id: this.id,
      language: this.language,
      modifiedAt: this.modifiedAt.toISOString(),
      modifiedBy: this.modifiedBy,
      notes: this.notes,
      owner: this.owner,
      ownerHandles: this.ownerHandles,
      qualifyingResults: this.qualifyingResults.map(qr => qr.toJSON()),
      reserve: this.reserve,
      results: this.results.map(r => r.toJSON()),
    };
  }
}
