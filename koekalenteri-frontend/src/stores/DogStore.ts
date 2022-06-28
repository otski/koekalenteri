import { DogName, RegistrationBreeder, RegistrationPerson } from "koekalenteri-shared/model";
import { makeAutoObservable, runInAction } from "mobx";
import { getDog } from "../api/dog";
import { CDog } from "./classes/CDog";
import { CRegistration } from "./classes/CRegistration";
import type { RootStore } from "./RootStore";

const STORAGE_KEY = 'dog-cache';

export type DogCachedInfo = {
  breeder: RegistrationBreeder
  dam?: DogName
  handler: RegistrationPerson
  owner: RegistrationPerson
  ownerHandles: boolean
  sire?: DogName
}

export class DogStore {
  rootStore
  _data: Record<string, CDog> = {}

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    const stored = localStorage.getItem(STORAGE_KEY);
    this._data = stored ? JSON.parse(stored) : {};
    window.addEventListener('storage', this._change);

    makeAutoObservable(this, {
      rootStore: false
    })
  }

  dispose() {
    window.removeEventListener("storage", this._change)
  }

  private _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data));
  }

  private _change(e: StorageEvent) {
    runInAction(() => {
      if (e.storageArea === localStorage && e.key === STORAGE_KEY) {
        this._data = e.newValue ? JSON.parse(e.newValue) : {};
      }
    });
  }

  get dogs() {
    return Object.values(this._data);
  }

  async load(regNo: string, refresh?: boolean, signal?: AbortSignal): Promise<CDog> {
    const official = await getDog(regNo, refresh, signal);
    const local = this._data[regNo];
    const dog = new CDog(local);
    runInAction(() => {
      dog.updateFromJson(official);
    });
    return dog;
  }

  save(reg: CRegistration) {
    if (!reg.dog || !reg.dog.regNo) {
      return;
    }
    this._data[reg.dog.regNo] = reg.dog;
    this._save();
  }

  toJSON() { return {} }
}


