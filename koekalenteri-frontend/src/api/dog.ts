import { JsonDog } from 'koekalenteri-shared/model';
import http from './http';

const PATH = '/dog/';

export async function getDog(regNo: string, refresh?: boolean, signal?: AbortSignal): Promise<JsonDog> {
  const encodedRegNo = regNo.replace('/', '~');
  const qs = refresh ? '?refresh' : '';
  return http.get<JsonDog>(`${PATH}${encodedRegNo}${qs}`, {signal});
}
