import { DbRecord, JsonDbRecord, NotOptional, Official, Organizer, Replace, ReplaceOptional, Secretary } from '.';
import { Judge, Person } from './Person';

export interface JsonEvent {
  accountNumber: string
  allowHandlerMembershipPriority: boolean
  allowOwnerMembershipPriority: boolean
  classes: Array<JsonEventClass>
  contactInfo?: ContactInfo
  cost: number
  costMember: number
  description: string
  endDate: string
  entries: number
  entryEndDate?: string
  entryOrigEndDate?: string
  entryStartDate?: string
  eventType: string
  id: string
  judges: Judge[]|number[]
  location: string
  name: string
  official?: Official
  organizer?: Organizer
  paymentDetails: string
  places: number
  referenceNumber: string
  startDate: string
  state: EventState
}

export interface JsonAdminEvent extends JsonDbRecord, JsonEvent {
  headquerters?: Partial<Headquarters>
  kcId?: number
  secretary?: Secretary
  visibleContactInfo?: Partial<VisibleContactInfo>
}

export type Event = { id: string } &
  Replace<
    Replace<
      ReplaceOptional<
        Omit<JsonEvent, keyof JsonDbRecord>,
        'entryStartDate' | 'entryEndDate' | 'entryOrigEndDate',
        Date
      >,
      'startDate' | 'endDate',
      Date
    >,
    'classes',
    Array<EventClass>
  >
export type AdminEvent = DbRecord &
  Replace<
    Replace<
      ReplaceOptional<
        Omit<JsonAdminEvent, keyof JsonDbRecord>,
        'startDate' | 'endDate' | 'entryStartDate' | 'entryEndDate' | 'entryOrigEndDate',
        Date
      >,
      'startDate' | 'endDate',
      Date
    >,
    'classes',
    Array<EventClass>
  >

export type JsonEventClass = {
  class: string
  date?: string
  judge?: Judge,
  places?: number
  entries?: number
  members?: number
}
export type EventClass = ReplaceOptional<JsonEventClass, 'date', Date>

export type EventState = 'draft' | 'tentative' | 'confirmed' | 'cancelled';

export type Headquarters = {
  name: string
  address: string
  zipCode: number
  postalDistrict: string
}

export type VisibleContactInfo = {
  official: ShowContactInfo
  secretary: ShowContactInfo
}

export type ShowContactInfo = {
  name: boolean
  email: boolean
  phone: boolean
}

export type ContactPerson = Partial<Omit<Person, 'location'>>

export type ContactInfo = {
  official?: ContactPerson
  secretary?: ContactPerson
}

export type JsonConfirmedEvent = NotOptional<JsonEvent, 'startDate' | 'endDate' | 'entryStartDate' | 'entryEndDate'> & {
  state: 'confirmed'
}
