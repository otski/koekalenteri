import { render, screen } from '@testing-library/react';
import { EventInfo } from './EventInfo';
import { emptyEvent } from '../api/test-utils/emptyEvent';
import { JsonEvent, Judge } from 'koekalenteri-shared/model';
import { CEvent } from '../stores/classes';
import { RootStore } from '../stores/RootStore';

it('should render event information', async function() {
  const store = new RootStore();
  const data: JsonEvent = {
    ...emptyEvent,
    organizer: {
      id: 0,
      name: 'test organization'
    },
    name: 'name',
    location: 'location',
    startDate: new Date('2021-02-10').toISOString(),
    endDate: new Date('2021-02-11').toISOString(),
    entryStartDate: new Date('2021-01-20').toISOString(),
    entryEndDate: new Date('2021-02-04').toISOString(),
    description: 'event description text',
    classes: [{
      date: new Date('2021-02-10').toISOString(),
      class: 'TestClass',
      judge: { id: 1, name: 'Test Judge' } as Judge,
      places: 11,
      entries: 22,
      members: 2
    }],
    judges: [{ id: 1, name: 'Test Judge' } as Judge]
  };
  const event = new CEvent(store.eventStore);
  event.updateFromJson(data);
  render(<EventInfo event={event} />);

  // entry dates
  expect(screen.getByText('20.1.-4.2.2021')).toBeInTheDocument();

  // classes
  expect(screen.getByText('ke 10.2.')).toBeInTheDocument();
  expect(screen.getByText('TestClass')).toBeInTheDocument();
  expect(screen.getByText('Test Judge')).toBeInTheDocument();
  expect(screen.getByText('22 / 11')).toBeInTheDocument();

  // description
  expect(screen.getByText('event description text')).toBeInTheDocument();
});
