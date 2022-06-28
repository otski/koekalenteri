import { BreedCode, Dog, DogGender, DogName, JsonDog, RegistrationBreeder, RegistrationPerson, TestResult } from "koekalenteri-shared/model";
import { makeAutoObservable } from "mobx";
import { toDate } from "../../utils";
import { DogCachedInfo } from "../DogStore";

export class CDog implements Dog, DogCachedInfo {
  breedCode?: BreedCode | undefined;
  breeder = {} as RegistrationBreeder;
  callingName?: string | undefined;
  dam?: DogName | undefined;
  dob?: Date;
  gender?: DogGender | undefined;
  handler = {} as RegistrationPerson;
  name?: string | undefined;
  owner = {} as RegistrationPerson;
  ownerHandles = true;
  regNo: string = '';
  refreshDate?: Date;
  results: TestResult[] = [];
  rfid?: string | undefined;
  sire?: DogName | undefined;
  titles?: string | undefined;

  constructor(cached?: DogCachedInfo) {
    if (cached) {
      this.breeder = cached.breeder;
      this.dam = cached.dam;
      this.handler = cached.handler;
      this.owner = cached.owner;
      this.ownerHandles = cached.ownerHandles;
      this.sire = cached.sire;
    }

    makeAutoObservable(this);
  }

  updateFromJson(json: JsonDog) {
    this.breedCode = json.breedCode;
    this.callingName = json.callingName;
    this.dam = { ...this.dam, ...json.dam };
    this.dob = toDate(json.dob);
    this.gender = json.gender;
    this.name = json.name;
    this.regNo = json.regNo;
    this.refreshDate = toDate(json.refreshDate);
    this.results = json.results?.map(r => ({ ...r, date: new Date(r.date) })) || [];
    this.rfid = json.rfid;
    this.sire = { ...this.sire, ...json.sire };
    this.titles = json.titles;
  }

  toJSON(): JsonDog {
    return {
      breedCode: this.breedCode,
      callingName: this.callingName,
      dam: this.dam,
      dob: this.dob?.toISOString(),
      gender: this.gender,
      name: this.name,
      regNo: this.regNo,
      refreshDate: this.refreshDate?.toISOString(),
      results: this.results.map(r => ({...r, date: r.date.toISOString()})),
      rfid: this.rfid,
      sire: this.sire,
      titles: this.titles,
    };
  }

  toCache(): DogCachedInfo {
    return {
      breeder: this.breeder,
      dam: this.dam,
      handler: this.handler,
      owner: this.owner,
      ownerHandles: this.ownerHandles,
      sire: this.sire
    }
  }
}
