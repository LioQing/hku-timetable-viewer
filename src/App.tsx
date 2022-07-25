import Stack from '@mui/material/Stack';
import Selection from './components/Selection';
import TimetableProvider from './components/TimetableProvider';

const App = () => {
  return (
    <TimetableProvider>
      <Stack direction='row'>
        <Selection />
      </Stack>
    </TimetableProvider>
  );
};

export default App;
