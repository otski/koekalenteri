import { JsonDog } from "koekalenteri-shared/model";

export async function getDog(regNo: string, refresh?: boolean, signal?: AbortSignal): Promise<JsonDog> {
  return new Promise((resolve) => {
    process.nextTick(() => resolve({
      regNo,
      name: 'Test Dog',
      rfid: 'rfid',
      dob: '20220101T00:00:00',
      gender: 'M',
      breedCode: '121',
      titles: ''
    }));
  });
}
