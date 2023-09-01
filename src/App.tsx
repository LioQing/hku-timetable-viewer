import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Selection from './components/Selection';
import Timetable from './components/Timetable';
import TimetableProvider from './components/TimetableProvider';
import SettingsProvider from './components/SettingsProvider';
import StartUpNotice from './components/StartUpNotice';
import Typography from '@mui/material/Typography';
import { Link } from '@mui/material';

const App = () => {
  return (
    <SettingsProvider>
      <CssBaseline />
      <StartUpNotice>
        <Typography variant='body1'>
          Since 2023 September 1, all previous saved timetables on the browser's local storage
          are lost due to domain name change, this issue has been known and hasn't been fixed
          since 2016 on GitHub (
          <Link href='https://github.com/isaacs/github/issues/547' target='_blank'>
            https://github.com/isaacs/github/issues/547
          </Link>
          ).<br /><br />
          We are sincerely
          sorry for the inconvenience caused.
        </Typography>
      </StartUpNotice>
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
