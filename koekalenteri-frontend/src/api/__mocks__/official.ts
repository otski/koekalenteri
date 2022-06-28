import { Official } from "koekalenteri-shared/model";

const mockOfficials: Official[] = [
  {
    name: "Toimitsija 1",
    id: 333,
    location: "Helsinki",
    phone: "123456781",
    email: "toimari1@sposti.not",
    district: "Piiri",
    eventTypes: []
  },
  {
    name: "Toimitsija 2",
    id: 444,
    location: "Tampere",
    phone: "123456782",
    email: "toimari2@sposti.not",
    district: "Piiri",
    eventTypes: []
  },
  {
    name: "Toimitsija 3",
    id: 555,
    location: "Turku",
    phone: "123456783",
    email: "toimari3@sposti.not",
    district: "Piiri",
    eventTypes: []
  },
];

export async function getOfficials() {
  return new Promise((resolve) => {
    process.nextTick(() => resolve(mockOfficials));
  });
}
