import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Selection from './components/Selection';
import Timetable from './components/Timetable';
import TimetableProvider from './components/TimetableProvider';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const darkTheme = createTheme({
  palette: {
    // mode: 'dark',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <TimetableProvider>
        <Stack direction='row'>
          <Selection />
          <Timetable />
        </Stack>
      </TimetableProvider>
    </ThemeProvider>
  );
};

export default App;
