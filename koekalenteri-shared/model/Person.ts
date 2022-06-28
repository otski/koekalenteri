export type Person = {
  name: string
  email: string
  phone: string
  location: string
}

export type OfficialPerson = Person & {
  id: number
}

export type Secretary = OfficialPerson;

export type Official = OfficialPerson & {
  district: string
  eventTypes: string[]
}

export type JsonJudge = OfficialPerson & {
  district: string
  eventTypes: string[]
  languages: string[]
  active?: boolean
  official?: boolean
}

export type Judge = JsonJudge;
