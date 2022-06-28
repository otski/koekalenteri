import fetchMock from 'jest-fetch-mock';
import { emptyEvent } from './test-utils/emptyEvent';
import { getEvents, getEvent, putEvent } from './event';
import { API_BASE_URL } from "../config";

fetchMock.enableMocks();

beforeEach(() => fetchMock.resetMocks());

test('getEvents', async () => {
  fetchMock.mockResponse(req => req.method === 'GET'
    ? Promise.resolve(JSON.stringify([emptyEvent]))
    : Promise.reject(new Error(`${req.method} !== 'GET'`)));

  const events = await getEvents();

  expect(events.length).toEqual(1);
  expect(fetchMock.mock.calls.length).toEqual(1);
  expect(fetchMock.mock.calls[0][0]).toEqual(API_BASE_URL + '/event');
});

test('getEvent', async () => {
  fetchMock.mockResponse(req => req.method === 'GET'
    ? Promise.resolve(JSON.stringify(emptyEvent))
    : Promise.reject(new Error(`${req.method} !== 'GET'`)));

  const testEvent = await getEvent('TestEventType', 'TestEventID');

  expect(testEvent).toMatchObject(emptyEvent);
  expect(fetchMock.mock.calls.length).toEqual(1);
  expect(fetchMock.mock.calls[0][0]).toEqual(API_BASE_URL + '/event/TestEventType/TestEventID');
});

test('putEvent', async() => {
  fetchMock.mockResponse(req => req.method === 'POST'
    ? Promise.resolve(JSON.stringify(emptyEvent))
    : Promise.reject(new Error(`${req.method} !== 'POST'`)));

  const newEvent = await putEvent({ eventType: 'TestEventType' });
  expect(fetchMock.mock.calls.length).toEqual(1);
  expect(fetchMock.mock.calls[0][0]).toEqual(API_BASE_URL + '/admin/event');
  expect(newEvent.id).not.toBeUndefined();
});

