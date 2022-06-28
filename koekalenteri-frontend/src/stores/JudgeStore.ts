import i18next from "i18next";
import { Judge } from "koekalenteri-shared/model";
import { makeAutoObservable, runInAction } from "mobx";
import { getJudges, putJudge } from "../api/judge";
import { CJudge } from "./classes/CJudge";
import type { RootStore } from "./RootStore";

export class JudgeStore {
  rootStore
  judges: Array<CJudge> = []
  loading = false
  loaded = false

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this, {
      rootStore: false
    })
  }

  get activeJudges() {
    return this.judges.filter(judge => judge.active);
  }

  async load(refresh?: boolean, signal?: AbortSignal) {
    if (this.loading) {
      const instance = this;
      return new Promise(function(resolve, reject) {
        (function waitForLoad() {
          if (instance.loaded) {
            return resolve(true);
          }
          setTimeout(waitForLoad, 50);
        })();
      });
    }
    runInAction(() => {
      this.loading = true;
    });
    const data = await getJudges(refresh, signal);
    runInAction(() => {
      data.forEach(json => this.updateJudge(json));
      this.judges.sort((a, b) => a.name.localeCompare(b.name, i18next.language));
      this.loading = false;
      this.loaded = true;
    });
  }

  getJudge(id?: number): CJudge | undefined {
    return this.judges.find(item => item.id === id);
  }

  getJudges(judges: Judge[] | number[]): CJudge[] {
    const result: CJudge[] = [];
    if (!judges || judges.length === 0) {
      return result;
    }
    for (const judge of judges) {
      const id = typeof judge === 'number' ? judge : judge.id;
      if (!id) {
        continue;
      }
      const instance = this.judges.find(item => item.id === id);
      if (instance) {
        result.push(instance);
      } else {
        const temp = new CJudge(this, id);
        if (typeof judge !== 'number') {
          temp.updateFromJson(judge);
        }
        result.push(temp);
      }
    }
    return result;
  }

  async save(judge: Judge) {
    try {
      runInAction(() => {
        this.loading = true;
      });
      const saved = await putJudge(judge);
      runInAction(() => {
        this.updateJudge(saved);
        this.loading = false;
      });
    } catch (e) {
      console.error(e);
      this.loading = false;
    }
  }

  updateJudge(json: Judge) {
    let judge = this.judges.find(o => o.id === json.id);
    if (!judge) {
      judge = new CJudge(this, json.id)
      this.judges.push(judge)
    }
    judge.updateFromJson(json)
  }

  toJSON() { return {} }
}


