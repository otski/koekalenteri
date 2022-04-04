export default {
  event: {
    state: "confirmed",
    startDate: "2022-04-22T21:00:00.000Z",
    endDate: "2022-04-23T21:00:00.000Z",
    classes: [
      {
        class: "ALO",
        date: "2022-04-22T21:00:00.000Z",
        judge: {
          id: 100002,
          name: "Tuomari 2",
        },
        places: 14,
      },
      {
        class: "ALO",
        date: "2022-04-23T21:00:00.000Z",
        judge: {
          id: 100002,
          name: "Tuomari 2",
        },
        places: 14,
      },
    ],
    judges: [100002],
    accountNumber: "FI46....",
    allowHandlerMembershipPriority: true,
    allowOwnerMembershipPriority: true,
    cost: 40,
    costMember: 35,
    description: "Pietun pysti jaossa ALO-luokassa",
    entries: 4,
    eventType: "NOME-B",
    id: "0001",
    location: "Liperi",
    name: "Nuusku",
    official: {
      name: "Teemu Toimitsija",
      location: "Ähtäri",
      id: 1,
      phone: "0700-teemu",
      email: "teemu@example.org",
    },
    organizer: {
      name: "Järjestäjä 1",
      id: 1,
    },
    secretary: {
      name: "Siiri Sihteeri",
      location: "Praha",
      id: 2,
      phone: "0700-siiri",
      email: "siiri@example.org",
    },
    paymentDetails: "lorem ipsum",
    places: 28,
    referenceNumber: "11041",
    createdAt: "2022-02-15T22:24:16.656Z",
    createdBy: "anonymous",
    modifiedAt: "2022-02-15T22:24:16.656Z",
    modifiedBy: "anonymous",
    contactInfo: {
      secretary: {
        name: true,
        phone: true,
        email: true,
      },
    },
    entryStartDate: "2022-02-15T22:00:00.000Z",
    allowOnlinePayment: true,
    isEntryUpcoming: false,
    unofficial: false,
    isEntryClosing: false,
    requirePaymentBeforeEntry: false,
    entryEndDate: "2022-04-15T00:00:00.000Z",
    isEntryOpen: true,
    allowOnlineEntry: true,
    kcId: "123",
  },
  reg: {
    eventId: "0001",
    eventType: "NOME-B",
    language: "fi",
    class: "ALO",
    dates: [
      {
        date: "2022-03-24T00:00:00.000Z",
        time: "ap",
      },
    ],
    reserve: "ANY",
    dog: {
      regNo: "FI10090/20",
      refreshDate: "2022-03-20T11:00:50.103Z",
      gender: "F",
      dob: "2019-11-19T22:00:00.000Z",
      name: "WATERFOWLER KATIE",
      breedCode: "122",
      rfid: "978101082313347",
      titles: "",
      results: [
        {
          date: "2020-09-11T21:00:00.000Z",
          result: "NOU1",
          ext: "",
          resCert: false,
          notes: "",
          rank: 0,
          location: "Raasepori",
          cert: false,
          judge: "VILLIKKA KATJA",
          type: "NOU",
          class: "NOU",
          points: 0,
        },
      ],
      sire: {
        name: "Waterfowler Copper",
      },
      dam: {
        name: "Kelmarsky Ballina",
      },
    },
    breeder: {
      name: "Susanna Särkijärvi",
      location: "Ypäjä",
    },
    owner: {
      name: "Jukka Kurkela",
      phone: "+35840-jukka",
      email: "jukka.kurkela@gmail.com",
      location: "Ypäjä",
      membership: true,
    },
    handler: {
      name: "Jukka Kurkela",
      phone: "+35840-jukka",
      email: "jukka.kurkela@gmail.com",
      location: "Ypäjä",
      membership: true,
    },
    qualifyingResults: [
      {
        date: "2020-09-11T21:00:00.000Z",
        result: "NOU1",
        ext: "",
        resCert: false,
        notes: "",
        rank: 0,
        location: "Raasepori",
        cert: false,
        judge: "VILLIKKA KATJA",
        type: "NOU",
        class: "NOU",
        points: 0,
      },
    ],
    notes: "test",
    agreeToTerms: true,
    agreeToPublish: true,
  },
  eventDate: "23.-23.4.2022",
  dogBreed: "Labradorinnoutaja",
  regDates: "la 23.4. aamupäivä, su 24.4. iltapäivä",
  editLink: "https://localhost/somewhere/edit/that",
};