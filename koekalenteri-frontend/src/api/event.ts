import { JsonAdminEvent, JsonEvent, JsonEventClass, JsonRegistration, Registration } from 'koekalenteri-shared/model';
import http from './http';

export async function getEvents(signal?: AbortSignal): Promise<JsonEvent[]> {
  return http.get<Array<JsonEvent>>('/event', {signal});
}

export async function getEvent(eventType: string, id: string, signal?: AbortSignal): Promise<JsonEvent> {
  return http.get<JsonEvent>(`/event/${eventType}/${id}`, {signal});
}

export async function getRegistrations(eventId: string, signal?: AbortSignal): Promise<JsonRegistration[]> {
  return http.get<Array<JsonRegistration>>(`/registration/${eventId}`, {signal})
}

export async function getRegistration(eventId: string, id: string, signal?: AbortSignal): Promise<JsonRegistration | undefined> {
  return http.get<JsonRegistration>(`registration/${eventId}/${id}`, {signal});
}

export type RegistrationResult = {
  registration: JsonRegistration,
  entries: number,
  classes: JsonEventClass[]
}
export async function putRegistration(registration: Registration): Promise<RegistrationResult> {
  return http.post<Registration, RegistrationResult>('/event/register', registration);
}

export async function getAdminEvents(signal?: AbortSignal): Promise<JsonAdminEvent[]> {
  return http.get<Array<JsonAdminEvent>>('/admin/event', {signal});
}

export async function putEvent(event: Partial<JsonAdminEvent>): Promise<JsonAdminEvent> {
  return http.post<Partial<JsonAdminEvent>, JsonAdminEvent>('/admin/event', event);
}
