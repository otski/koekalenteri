import type { JsonAdminEvent, Judge } from 'koekalenteri-shared/model';

const defaultDate = new Date('1990-01-01').toISOString();

export const emptyEvent: JsonAdminEvent = {
  accountNumber: 'test',
  allowHandlerMembershipPriority: true,
  allowOwnerMembershipPriority: true,
  classes: [{ class: 'test' }],
  cost: 123,
  costMember: 123,
  description: 'test',
  endDate: defaultDate,
  entries: 0,
  entryEndDate: defaultDate,
  entryStartDate: defaultDate,
  eventType: 'test',
  id: 'test',
  judges: [{ id: 123, name: 'test judge' } as Judge],
  location: 'test',
  name: 'test',
  official: {
    id: 1,
    name: 'Teemu Toimitsija',
    email: 'joo@ei.com',
    phone: '040-official',
    location: 'Suomi',
    district: 'Helsinki',
    eventTypes: ['test']
  },
  organizer: {
    id: 1,
    name: 'Suomen Noutajakoirajärjestö ry'
  },
  paymentDetails: 'test',
  places: 10,
  referenceNumber: 'test',
  startDate: defaultDate,
  state: 'confirmed',
  createdAt: defaultDate,
  createdBy: 'mock',
  modifiedAt: defaultDate,
  modifiedBy: 'mock'
}
