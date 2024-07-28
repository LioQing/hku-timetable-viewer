import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Selection from './components/Selection';
import Timetable from './components/Timetable';
import TimetableProvider from './components/TimetableProvider';
import SettingsProvider from './components/SettingsProvider';

const App = () => {
  return (
    <SettingsProvider>
      <CssBaseline />
      <TimetableProvider>
        <Stack direction='row'>
          <Selection />
          <Timetable />
        </Stack>
      </TimetableProvider>
    </SettingsProvider>
  );
};

export default App;
