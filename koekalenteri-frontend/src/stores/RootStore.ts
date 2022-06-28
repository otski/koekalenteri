import { makeAutoObservable, runInAction } from "mobx";
import { AdminEventStore } from "./AdminEventStore";
import { DogStore } from "./DogStore";
import { EventStore } from "./EventStore";
import { EventTypeStore } from "./EventTypeStore";
import { JudgeStore } from "./JudgeStore";
import { OfficialStore } from "./OfficialStore";
import { OrganizerStore } from "./OrganizerStore";
import { RegistrationStore } from "./RegistrationStore";

export class RootStore {
  loading = false
  loaded = false
  adminEventStore
  dogStore
  eventStore
  eventTypeStore
  judgeStore
  officialStore
  organizerStore
  registrationStore

  eventTypeClasses: Record<string, string[]> = {
    'NOME-B': ['ALO', 'AVO', 'VOI'],
    'NOWT': ['ALO', 'AVO', 'VOI']
  };

  constructor() {
    this.adminEventStore = new AdminEventStore(this);
    this.dogStore = new DogStore(this);
    this.eventTypeStore = new EventTypeStore(this);
    this.judgeStore = new JudgeStore(this);
    this.officialStore = new OfficialStore(this);
    this.organizerStore = new OrganizerStore(this);
    this.registrationStore = new RegistrationStore(this);
    this.eventStore = new EventStore(this);

    makeAutoObservable(this, {
      adminEventStore: false,
      dogStore: false,
      eventStore: false,
      eventTypeStore: false,
      judgeStore: false,
      officialStore: false,
      organizerStore: false,
      registrationStore: false,
      eventTypeClasses: false,
      toJSON: false
    });
  }

  async load() {
    if (this.loading) {
      const instance = this;
      return new Promise(function(resolve, reject) {
        (function waitForLoad() {
          if (!instance.loading) {
            return resolve(true);
          }
          setTimeout(waitForLoad, 50);
        })();
      });
    }

    runInAction(() => {
      this.loading = true;
    });

    await Promise.allSettled([
      this.eventTypeStore.load(),
      this.judgeStore.load(),
      this.officialStore.load(),
      this.organizerStore.load(),
    ]);
    // eventStore is loaded last, so other stores are alredy usable
    await this.eventStore.load();

    runInAction(() => {
      this.loaded = true;
      this.loading = false;
    });
    console.log('rootStore loaded');
  }

  toJSON() { return {} }
}
