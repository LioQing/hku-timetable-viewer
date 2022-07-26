import Stack from '@mui/material/Stack';
import Selection from './components/Selection';
import Timetable from './components/Timetable';
import TimetableProvider from './components/TimetableProvider';

const App = () => {
  return (
    <TimetableProvider>
      <Stack direction='row'>
        <Selection />
        <Timetable />
      </Stack>
    </TimetableProvider>
  );
};

export default App;
