import { runInAction } from "mobx";
import { EventTypeStore } from "./EventTypeStore";
import { JudgeStore } from "./JudgeStore";
import { OrganizerStore } from "./OrganizerStore";

export class RootStore {
  loaded = false
  eventTypeStore
  judgeStore
  organizerStore

  constructor() {
    this.eventTypeStore = new EventTypeStore(this);
    this.judgeStore = new JudgeStore(this);
    this.organizerStore = new OrganizerStore(this);
  }

  async load() {
    await Promise.allSettled([
      this.eventTypeStore.load(),
      this.judgeStore.load(),
      this.organizerStore.load(),
    ]);
    runInAction(() => {
      this.loaded = true;
    });
  }
}
