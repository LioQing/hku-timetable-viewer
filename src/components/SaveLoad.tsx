import { useContext } from 'react';
import Button from "@mui/material/Button";
import SaveIcon from '@mui/icons-material/Save';
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { saveTimetable, loadTimetable } from '../utils/Storage';
import { TimetableContext } from '../contexts/TimetableContext';

const SaveLoad = () => {
  const { timetable, setTimetable } = useContext(TimetableContext);

  return (
    <Container style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', padding: 0 }}>
      <Button
        variant='outlined'
        onClick={() => saveTimetable(timetable)}
        style={{ padding: '0.4rem', margin: '0.2rem' }}>
        <SaveIcon fontSize='small' style={{ marginRight: '0.2rem' }} />
        <Typography variant='caption' noWrap style={{ position: 'relative', top: '0.1rem' }}>Save</Typography>
      </Button>
      <Button
        variant='outlined'
        onClick={() => {
          const loaded = loadTimetable(timetable);
          if (loaded === null) return;
          setTimetable({ ...loaded })
        }}
        style={{ padding: '0.4rem', margin: '0.2rem' }}>
        <FileOpenIcon fontSize='small' style={{ marginRight: '0.2rem' }} />
        <Typography variant='caption' noWrap style={{ position: 'relative', top: '0.1rem' }}>Load</Typography>
      </Button>
    </Container>
  );
};

export default SaveLoad;