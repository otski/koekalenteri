import { JsonEventClass } from "koekalenteri-shared/model"
import { makeAutoObservable } from "mobx"
import { toDate } from "../../utils"
import { JudgeStore } from "../JudgeStore"
import { CJudge } from "./CJudge"


export class CEventClass {
  class: string = ''
  date?: Date
  judge?: CJudge
  places?: number
  entries?: number
  members?: number

  constructor(json: JsonEventClass, judgeStore: JudgeStore) {
    this.updateFromJson(json, judgeStore);

    makeAutoObservable(this);
  }

  updateFromJson(json: JsonEventClass, judgeStore: JudgeStore) {
    this.class = json.class;
    this.date = toDate(json.date);
    this.judge = json.judge && judgeStore.getJudge(json.judge.id);
    this.places = json.places;
    this.entries = json.entries;
    this.members = json.members;
  }

  toJSON(): JsonEventClass {
    return {
      class: this.class,
      date: this.date?.toISOString(),
      judge: this.judge?.toJSON(),
      places: this.places,
      entries: this.entries,
      members: this.members
    }
  }
}
