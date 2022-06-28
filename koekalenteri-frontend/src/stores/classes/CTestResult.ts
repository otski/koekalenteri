import { JsonTestResult, TestResult } from "koekalenteri-shared/model";
import { makeAutoObservable } from "mobx";
import { CDog } from "./CDog";


export class CTestResult implements TestResult {
  cert?: boolean | undefined;
  class: string = '';
  date: Date = new Date();
  dog: CDog;
  ext?: string | undefined;
  id: string = '';
  judge: string = '';
  location: string = '';
  notes?: string | undefined;
  official: boolean = false;
  points?: number | undefined;
  rank?: number | undefined;
  resCert?: boolean | undefined;
  result: string = '';
  type: string = '';

  constructor(dog: CDog) {
    this.dog = dog;

    makeAutoObservable(this, {
      dog: false,
    });
  }


  updateFromJson(json: JsonTestResult) {
  }

  updateFromRule(rule?: Partial<TestResult>) {

  }

  toJSON(): JsonTestResult & {id: string} {
    return {
      cert: this.cert,
      class: this.class,
      date: this.date.toISOString(),
      ext: this.ext,
      id: this.id,
      judge: this.judge,
      location: this.location,
      notes: this.notes,
      official: this.official,
      points: this.points,
      rank: this.rank,
      resCert: this.resCert,
      result: this.result,
      type: this.type,
    }
  }
}
