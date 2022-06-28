import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { deserializeFilter, EventFilter, EventTable, serializeFilter } from '../components';
import { Banner, Header } from '../layout';
import { useSessionStarted, useStores } from '../stores';
import { FilterProps } from '../stores/EventStore';

export const SearchPage = observer(function SearchPage() {
  const { rootStore } = useStores();
  const [sessionStarted, setSessionStarted] = useSessionStarted();
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState(deserializeFilter(searchParams));

  const organizers = rootStore.organizerStore.organizers.map(o => o.toJSON());
  const judges = rootStore.judgeStore.activeJudges.map(j => j.toJSON());
  const eventTypes = rootStore.eventTypeStore.activeEventTypes.map(et => et.eventType);

  const handleChange = (filter: FilterProps) => {
    setFilter(filter);
    setSearchParams(serializeFilter(filter));
    rootStore.eventStore.setFilter(filter);
  };

  useEffect(() => {
    if (!sessionStarted) {
      setSessionStarted(new Date().toISOString());
    }
    if (!rootStore.loaded) {
      rootStore.load();
    }
  });

  useEffect(() => {
    const value = deserializeFilter(searchParams);
    setFilter(value);
    rootStore.eventStore.setFilter(value);
  }, [searchParams, rootStore.eventStore]);

  return (
    <>
      <Header />
      <Banner />
      <Box>
        <EventFilter organizers={organizers} judges={judges} filter={filter} eventTypes={eventTypes} onChange={handleChange} />
        <EventTable events={rootStore.eventStore.filteredEvents} loading={rootStore.loading} />
      </Box>
    </>
  )
})
