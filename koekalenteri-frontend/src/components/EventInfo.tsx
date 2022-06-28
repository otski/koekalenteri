import { Table, TableBody, TableRow, TableCell } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { format } from 'date-fns';
import type { EventClass } from 'koekalenteri-shared/model';
import { useTranslation } from 'react-i18next';
import { entryDateColor } from '../utils';
import { CostInfo, LinkButton } from '.';
import { CEvent } from '../stores/classes';
import { observer } from 'mobx-react-lite';

const useRowStyles = makeStyles({
  root: {
    '& *': {
      borderBottom: 'unset',
      padding: '2px 16px 2px 0'
    },
    '& th': {
      width: '1%',
      whiteSpace: 'nowrap',
      verticalAlign: 'top'
    },
    '& td': {
      whiteSpace: 'normal'
    }
  },
  classes: {
    '& th': {
      padding: '0 8px 0 0',
      verticalAlign: 'middle'
    }
  }
});

export const EventInfo = observer(function EventInfo({ event }: { event: CEvent }) {
  const classes = useRowStyles();
  const { t } = useTranslation();
  return (
    <>
      <Table size="small" aria-label="details" className={classes.root}>
        <TableBody>
          <TableRow key={event.id + 'date'}>
            <TableCell component="th" scope="row">{t('entryTime')}:</TableCell>
            <TableCell sx={{ color: entryDateColor(event.isEntryOpen, event.isEntryClosing, !!event.entryOrigEndDate) }}>
              <b>{t('daterange', { start: event.entryStartDate, end: event.entryEndDate })}</b>
              {event.isEntryOpen ? (event.entryOrigEndDate ? 'jatkettu, ' : '') + t('distanceLeft', { date: event.entryEndDate }) : ''}
            </TableCell>
          </TableRow>
          <TableRow key={event.id + 'organizer'}>
            <TableCell component="th" scope="row">{t('event.organizer')}:</TableCell>
            <TableCell>{event.organizer?.name}</TableCell>
          </TableRow>
          <TableRow key={event.id + 'eventType'}>
            <TableCell component="th" scope="row">{t('event.eventType')}:</TableCell>
            <TableCell>{event.eventType}</TableCell>
          </TableRow>
          {event.classes.length ? <EventClassRow key={event.id + 'classes'} event={event} /> : <></>}
          {event.allJudgesInClasses ? <></> :
            <>
              <TableRow key={event.id + 'judge' + event.judges[0]}>
                <TableCell component="th" scope="row" rowSpan={event.judges.length}>{t('event.judges')}:</TableCell>
                <TableCell>{event.judges[0]?.name}</TableCell>
              </TableRow>
              {event.judges.slice(1).map((judge) => (
                <TableRow key={event.id + 'judge' + judge.id}><TableCell>{judge.name}</TableCell></TableRow>
              ))}
            </>
          }
          <TableRow key={event.id + 'official'}>
            <TableCell component="th" scope="row">{t('event.official')}:</TableCell>
            <TableCell>{event.official?.name || ''}</TableCell>
          </TableRow>
          <TableRow key={event.id + 'payment'}>
            <TableCell component="th" scope="row">{t('event.paymentDetails')}:</TableCell>
            <TableCell><CostInfo event={event} /></TableCell>
          </TableRow>
          <TableRow key={event.id + 'location'}>
            <TableCell component="th" scope="row">{t('event.location')}:</TableCell>
            <TableCell>{event.location}</TableCell>
          </TableRow>
          <TableRow key={event.id + 'description'}>
            <TableCell component="th" scope="row">{t('event.description')}:</TableCell>
            <TableCell>{event.description}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
});

type EventProps = {
  event: CEvent
}

const EventClassRow = observer(function EventClassRow({ event }: EventProps) {
  const { t } = useTranslation();
  return (
    <TableRow key={event.id + 'classes'}>
      <TableCell component="th" scope="row">{t('event.classes')}:</TableCell>
      <TableCell><EventClassTable event={event} /></TableCell>
    </TableRow>
  );
})

const eventClassKey = (eventId: string, eventClass: string | EventClass) =>
  eventId + 'class' + (typeof eventClass === 'string' ? eventClass : eventClass.date + eventClass.class);

const EventClassTable = observer(function EventClassTable({ event }: EventProps) {
  const classes = useRowStyles();
  return (
    <Table size="small" className={classes.classes}>
      <TableBody>
        {event.classes.map(eventClass =>
          <EventClassTableRow key={eventClassKey(event.id, eventClass)} event={event} eventClass={eventClass} />)}
      </TableBody>
    </Table>
  );
})

const EventClassTableRow = observer(function EventClassTableRow({ event, eventClass }: { event: CEvent, eventClass: EventClass }) {
  const { t } = useTranslation();
  const classDate = format(eventClass.date || event.startDate, t('dateformatS'));
  const entryStatus = eventClass.places || eventClass.entries ? `${eventClass.entries || 0} / ${eventClass.places || '-'}` : '';
  const memberStatus = eventClass.members ? t('members', {count: eventClass.members}) : '';
  return (
    <TableRow>
      <TableCell component="th" scope="row">{t('dateshort', { date: eventClass.date })}</TableCell>
      <TableCell component="th" scope="row">{eventClass.class}</TableCell>
      <TableCell component="th" scope="row">{eventClass.judge?.name}</TableCell>
      <TableCell component="th" scope="row" align="right" sx={{fontWeight: 'bold'}}>{entryStatus}</TableCell>
      <TableCell component="th" scope="row" align="right" sx={{fontWeight: 'bold'}}>{memberStatus}</TableCell>
      <TableCell component="th" scope="row">
        {event.isEntryOpen ? <LinkButton to={`/event/${event.eventType}/${event.id}/${eventClass.class}/${classDate}`} text={t('register')} /> : ''}
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  )
})
