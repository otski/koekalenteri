import { useState } from 'react';
import {
  TableContainer,
  Paper,
  Table,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Collapse,
  Box,
  Grid,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { EventEx } from 'koekalenteri-shared';
import { EventInfo } from './EventInfo';
import { useTranslation } from 'react-i18next';

type EventTableProps = {
  events: Array<EventEx>
}

const useRowStyles = makeStyles({
  root: {
    '& > td': {
      backgroundColor: '#F2F2F2',
      borderBottom: '2px solid white',
      borderRadius: 4,
      padding: '2px 0',
      whiteSpace: 'nowrap',
    },
    '& div.MuiGrid-item': {
      overflow: 'hidden'
    },
    '&:last-child td': { border: 0 }
  },
  inner: {
    borderTop: '1px solid #BDBDBD',
    marginLeft: '34px'
  }
});

function eventClasses(event: EventEx) {
  const ret: string[] = [];
  for (const c of event.classes) {
    const name = typeof c === 'string' ? c : c.class;
    if (ret.indexOf(name) === -1) {
      ret.push(name);
    }
  }
  return ret.join(', ');
}

const placesColor = (event: EventEx) => event.entries > event.places ? 'warning.main' : 'text.primary';

function Row(props: { event: EventEx }) {
  const { event } = props;
  const [open, setOpen] = useState(false);
  const classes = useRowStyles();
  const { t } = useTranslation();

  return (
    <>
      <TableRow className={classes.root}>
        <TableCell>
          <Grid container spacing={0} alignItems="center">
            <Grid item xs={"auto"}>
              <IconButton aria-label="expand row" size="small" color="primary" onClick={() => setOpen(!open)}>
                {open ? <KeyboardArrowDown /> : <KeyboardArrowRight />}
              </IconButton>
            </Grid>
            <Grid item container xs>
              <Grid item container xs={12} md={6} justifyContent="flex-start" spacing={1}>
                <Grid item xs={3}>{t('daterange', { start: event.startDate, end: event.endDate })}</Grid>
                <Grid item xs={3}>{event.eventType}</Grid>
                <Grid item xs={3}>{eventClasses(event)}</Grid>
                <Grid item xs={3}>{event.location} ({event.name})</Grid>
              </Grid>
              <Grid item container xs={12} md={6} spacing={1}>
                <Grid item xs={7} md={8}>{event.organizer?.name}</Grid>
                <Grid item xs={2} md={2} textAlign="right" sx={{ color: placesColor(event) }}>
                  {event.entries ? `${event.entries}/${event.places}` : event.places + ' ' + t('total_places')}
                </Grid>
                <Grid item xs={3} md={2}>{event.isEntryOpen ? <Link to={`/event/${event.eventType}/${event.id}`}>{t('register')}</Link> : ''}</Grid>
              </Grid>
            </Grid>
          </Grid>
          <Collapse in={open} className={classes.inner} timeout="auto" unmountOnExit sx={{mt: 1, pt: 1}}>
            <EventInfo event={event}></EventInfo>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function EmptyResult() {
  const { t } = useTranslation();
  return (
    <Box sx={{ width: '100%', textAlign: 'center', color: 'red' }}>{t('no_results')}</Box>
  );
}

export function EventTable({ events }: EventTableProps) {
  return (
    <>
      {events.length ?
        <TableContainer component={Paper}>
          <Table aria-label="event table">
            <TableBody>
              {events.map((event) => (<Row key={event.id} event={event} />))}
            </TableBody>
          </Table>
        </TableContainer>
        : <EmptyResult />
      }
    </>
  )
}

