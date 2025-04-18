import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SheetDataProvider } from '../contexts/SheetDataContext';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2DD4BF',
      light: '#5EEAD4',
      dark: '#14B8A6',
    },
    secondary: {
      main: '#4ade80',
      light: '#86efac',
      dark: '#22c55e',
    },
    background: {
      default: '#0B1929',
      paper: '#0F2942',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
    divider: 'rgba(45, 212, 191, 0.08)',
    error: {
      main: '#f87171',
    },
    warning: {
      main: '#fbbf24',
    },
    info: {
      main: '#2DD4BF',
    },
    success: {
      main: '#4ade80',
    },
  },
  typography: {
    fontFamily: '"Pretendard", -apple-system, BlinkMacSystemFont, system-ui, Roboto, "Helvetica Neue", "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.25px',
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.2)',
    '0 4px 8px rgba(0,0,0,0.3)',
    '0 8px 16px rgba(0,0,0,0.4)',
    ...Array(21).fill('none'),
  ],
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0F2942',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0F2942',
          '&:hover': {
            backgroundColor: '#0F2942',
          },
        },
      },
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SheetDataProvider>
        <Component {...pageProps} />
      </SheetDataProvider>
    </ThemeProvider>
  );
} 