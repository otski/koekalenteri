import { JsonRegistration, Registration } from "koekalenteri-shared/model";
import { makeAutoObservable } from "mobx";
import { getRegistration, getRegistrations, putRegistration } from "../api/event";
import { CRegistration } from "./classes";
import type { RootStore } from "./RootStore";

export class RegistrationStore {
  rootStore
  registration

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    this.registration = new CRegistration(this);

    makeAutoObservable(this, {
      rootStore: false
    })
  }

  async load(eventId: string, id: string, signal?: AbortSignal) {
    const json = await getRegistration(eventId, id, signal);
    if (json) {
      this.registration.updateFromJson(json);
    }
  }

  async loadAll(eventId: string, signal?: AbortSignal) {
    const arr = await getRegistrations(eventId, signal);
    return arr.map(json => {
      const reg = new CRegistration(this);
      reg.updateFromJson(json);
      return reg;
    })
  }

  async save(registration: Registration) {
    const json = await putRegistration(registration);
    this.registration.updateFromJson(json.registration);
    this.rootStore.eventStore.updateEntries(json);
    return json.registration;
  }

  toJSON() { return {} }
}
