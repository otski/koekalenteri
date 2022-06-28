import { Organizer } from "koekalenteri-shared/model";
import { makeAutoObservable, runInAction } from "mobx";
import { getOrganizers } from "../api/organizer";
import { COrganizer } from "./classes/COrganizer";
import type { RootStore } from "./RootStore";

export class OrganizerStore {
  rootStore
  organizers: Array<COrganizer> = []
  loading = false

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this, {
      rootStore: false
    })
  }

  async load(refresh?: boolean, signal?: AbortSignal) {
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
    const data = await getOrganizers(refresh, signal);
    runInAction(() => {
      data.forEach(json => this.updateOrganizer(json))
      this.loading = false;
    });
  }

  getOrganizer(id?: number): COrganizer | undefined {
    return this.organizers.find(item => item.id === id);
  }

  updateOrganizer(json: Organizer) {
    let organizer = this.organizers.find(o => o.id === json.id);
    if (!organizer) {
      organizer = new COrganizer(this, json.id)
      this.organizers.push(organizer)
    }
    organizer.updateFromJson(json)
  }

  toJSON() { return {} }
}


