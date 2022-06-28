import { Official } from "koekalenteri-shared/model";
import { makeAutoObservable, runInAction } from "mobx";
import { getOfficials } from "../api/official";
import { COfficial } from "./classes/COfficial";
import type { RootStore } from "./RootStore";

export class OfficialStore {
  rootStore
  officials: Array<COfficial> = []
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
    const data = await getOfficials(refresh, signal);
    runInAction(() => {
      data.forEach(json => this.updateOfficial(json));
      this.officials.sort((a, b) => a.name.localeCompare(b.name))
      this.loading = false;
    });
  }

  getOfficial(id?: number): COfficial | undefined {
    return this.officials.find(item => item.id === id);
  }

  getOfficials(ids?: number[]): COfficial[] {
    const result: COfficial[] = [];
    if (!ids || ids.length === 0) {
      return result;
    }
    for (const id of ids) {
      const judge = this.officials.find(item => item.id === id);
      if (judge) {
        result.push(judge);
      }
    }
    return result;
  }

  filterByEventType(eventType?: string) {
    return this.officials.filter(o => !eventType || o.eventTypes?.includes(eventType));
  }

  updateOfficial(json: Official) {
    let official = this.officials.find(o => o.id === json.id);
    if (!official) {
      official = new COfficial(this, json.id)
      this.officials.push(official)
    }
    official.updateFromJson(json)
  }

  toJSON() { return {} }
}


