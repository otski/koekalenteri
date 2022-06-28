import { red } from '@mui/material/colors';
import { createTheme, Theme, responsiveFontSizes } from '@mui/material/styles';

declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}

declare module '@mui/material/styles/createPalette' {
  interface TypeBackground {
    form: string
    oddRow: string
    tableHead: string
    ok: string
    hover: string
    selected: string
    weekdays: {
      0: string
      1: string
      2: string
      3: string
      4: string
      5: string
      6: string
    }
  }
}

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1900,
    }
  },
  components: {
    MuiSwitch: {
      defaultProps: {
        color: 'success'
      }
    },
    MuiToggleButtonGroup: {
      defaultProps: {
        color: 'success'
      }
    }
  },
  palette: {
    primary: {
      light: '#547463',
      main: '#000',
      dark: '#1d392a',
      contrastText: '#fff',
    },
    secondary: {
      light: '#f7ebcf',
      main: '#98A59E',
      dark: '#aca189',
      contrastText: '#000',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fcfdfd',
      form: '#f2f2f2',
      oddRow: '#f8f8f8',
      tableHead: '#C4C4C4',
      ok: '#c1d4c9',
      hover: '#AFC1B7',
      selected: '#D5E1DB',
      weekdays: {
        0: '#AB46BE',
        1: '#E67273',
        2: '#FF8A63',
        3: '#FFD550',
        4: '#AFD582',
        5: '#63B5F5',
        6: '#7985CD',
      }
    },
  },
  typography: {
    button: {
      textTransform: "none"
    },
  },
  zIndex: {
    snackbar: 1200,
    drawer: 1000
  }
})

export default responsiveFontSizes(theme);
