import { Organizer } from "koekalenteri-shared/model";
import { makeAutoObservable } from "mobx";
import { OrganizerStore } from "../OrganizerStore";


export class COrganizer {
  id: number = 0;
  name: string = "";
  search: string = "";
  store: OrganizerStore;

  constructor(store: OrganizerStore, id: number) {
    this.id = id;
    this.store = store;

    makeAutoObservable(this, {
      id: false,
      store: false,
    });
  }

  updateFromJson(json: Organizer) {
    this.name = json.name;
    this.search = json.name.toLocaleLowerCase();
  }

  toJSON(): Organizer {
    return {
      id: this.id,
      name: this.name
    }
  }
}
