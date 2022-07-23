import { useState } from 'react';
import Container from '@mui/material/Container';
import HelpIcon from '@mui/icons-material/Help';
import Button from '@mui/material/Button';
import Upload from './Upload';
import CourseList from './CourseList';
import IntroDialog from './IntroDialog';
import TimetableOptions from './TimetableOptions';
import Course from '../utils/Course';

interface Props {
  timetable: Map<string, Course>;
  selected: string[];
  hovered: string | null;
  hour: number[];
  days: boolean[];
  setTimetable: (timetable: Map<string, Course>) => void;
  setSelected: (selected: string[]) => void;
  setHovered: (hovered: string | null) => void;
  setHour: (hour: number[]) => void;
  setDays: (days: boolean[]) => void;
}

const Selection = ({
  timetable, selected, hovered, hour, days,
  setTimetable, setSelected, setHovered, setHour, setDays,
}: Props) => {
  const [introOpen, setIntroOpen] = useState<boolean>(false);
  
  return (
    <Container style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '20rem',
      minWidth: '20rem',
      margin: '10px',
      padding: '0px',
    }}>
      <Upload setTimetable={setTimetable} setSelected={setSelected} setHovered={setHovered} />
      <CourseList
        timetable={timetable}
        selected={selected}
        hovered={hovered}
        setSelected={setSelected}
        setHovered={setHovered}
      />
      <TimetableOptions hour={hour} setHour={setHour} days={days} setDays={setDays} />
      <Button
        variant='outlined'
        onClick={(_) => setIntroOpen(true)}
        startIcon={<HelpIcon />}
        style={{ margin: '8px' }}>
        What is this website?
      </Button>
      <IntroDialog open={introOpen} onClose={() => setIntroOpen(false)} />
    </Container>
  );
};

export default Selection;