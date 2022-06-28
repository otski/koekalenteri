import { fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import theme from './assets/Theme';
import { ADMIN_EVENT_TYPES, ADMIN_JUDGES, ADMIN_NEW_EVENT, ADMIN_ORGS, ADMIN_ROOT, ADMIN_USERS, ADMIN_VIEW_EVENT } from './config';
import { DataGridProps } from '@mui/x-data-grid';

const TIMEOUT = 5000;

jest.mock('./api/event');
jest.mock('./api/judge');
jest.mock('./api/official');
jest.mock('./api/organizer');
jest.mock('./api/eventType');

jest.mock('@aws-amplify/ui-react');

// DataGrid needs disableVirtualizaton to render properly in tests
jest.mock('@mui/x-data-grid', () => {
  const { DataGrid } = jest.requireActual('@mui/x-data-grid');
  return {
    ...jest.requireActual('@mui/x-data-grid'),
    DataGrid: (props: DataGridProps) => {
      return (
        <DataGrid
          {...props}
          disableVirtualization
        />
      );
    },
  };
});

function renderPath(path: string) {
  render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </MemoryRouter>
  );
}

it('renders home page', () => {
  renderPath('/');
  const imgElement = screen.getByAltText('Suomen noutajakoirajärjestö');
  expect(imgElement).toBeInTheDocument();
}, TIMEOUT);

it('renders event registration page', async () => {
  renderPath('/event/NOME-B/test2');
  const spinner = screen.getByRole('progressbar');
  expect(spinner).toBeInTheDocument();
  const organizer = await screen.findByText(/Järjestäjä 2/);
  expect(organizer).toBeInTheDocument();
  expect(spinner).not.toBeInTheDocument();
}, TIMEOUT);

it('renders event registration page with class and date selected', async () => {
  renderPath('/event/NOME-B/test2/AVO/13.02.');
  const c = await screen.findByText(/AVO, la \(aamu\) \/ la \(ilta\)/);
  expect(c).toBeInTheDocument();
}, TIMEOUT);

fit('renders admin default (event) page', async () => {
  renderPath(ADMIN_ROOT);
  const spinner = screen.getByRole('progressbar');
  expect(spinner).toBeInTheDocument();
  await screen.findByText('type1');
  expect(spinner).not.toBeInTheDocument();
  const row = screen.getAllByRole('row')[1];
  expect(row).toMatchSnapshot();
  const cell = within(row).getAllByRole('cell')[0];
  fireEvent.click(cell, 'click');
  expect(row).toHaveClass('Mui-selected');
  fireEvent.click(screen.getByText(/Muokkaa/));
  const newHead = await screen.findByText(/Muokkaa tapahtumaa/);
  expect(newHead).toBeInstanceOf(HTMLDivElement);
}, TIMEOUT);

it('renders admin createEvent page', async () => {
  renderPath(ADMIN_NEW_EVENT);
  const head = await screen.findByText(/Uusi tapahtuma/);
  expect(head).toBeInTheDocument();
}, TIMEOUT);

it('renders admin EventViewPage', async () => {
  renderPath(`${ADMIN_VIEW_EVENT}/test1`);
  const head = await screen.findByText(/type1, 10.-11.2.2021, test location/i, undefined, { timeout: TIMEOUT });
  expect(head).toBeInTheDocument();
}, TIMEOUT);

it('renders admin organizations', async () => {
  renderPath(ADMIN_ORGS);
  const head = await screen.findAllByText(/Yhdistykset/);
  expect(head.length).toBe(3);
}, TIMEOUT);

it('renders admin users', async () => {
  renderPath(ADMIN_USERS);
  const head = await screen.findAllByText(/Käyttäjät/);
  expect(head.length).toBe(2);
}, TIMEOUT);

it('renders admin judges', async () => {
  renderPath(ADMIN_JUDGES);
  const head = await screen.findAllByText(/Tuomarit/);
  expect(head.length).toBe(3);
}, TIMEOUT);

it('renders admin eventTypes', async () => {
  renderPath(ADMIN_EVENT_TYPES);
  const head = await screen.findAllByText(/Koemuodot/);
  expect(head.length).toBe(3);
}, TIMEOUT);

it('renders logout page', async () => {
  renderPath('/logout');
  expect(await screen.findByText('Kirjaudu')).toBeInTheDocument();
}, TIMEOUT);
