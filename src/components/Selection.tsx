import { useState } from 'react';
import Container from '@mui/material/Container';
import HelpIcon from '@mui/icons-material/Help';
import Button from '@mui/material/Button';
import Upload from './Upload';
import CourseList from './CourseList';
import IntroDialog from './IntroDialog';
import Course from '../utils/Course';

interface Props {
  timetable: Map<string, Course>;
  hovered: string | null;
  setTimetable: (timetable: Map<string, Course>) => void;
  setSelected: (selected: string[]) => void;
  setHovered: (hovered: string | null) => void;
}

const Selection = ({ timetable, hovered, setTimetable, setSelected, setHovered }: Props) => {
  const [introOpen, setIntroOpen] = useState<boolean>(false);
  
  return (
    <Container style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100%',
      width: '320px',
      minWidth: '320px',
      margin: '10px',
      padding: '0px',
    }}>
      <Upload setTimetable={setTimetable} setSelected={setSelected} setHovered={setHovered} />
      <CourseList timetable={timetable} hovered={hovered} setSelected={setSelected} setHovered={setHovered} />
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