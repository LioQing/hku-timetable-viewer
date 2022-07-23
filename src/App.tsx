import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Course from './utils/Course';
import Timetable from './components/Timetable';
import Selection from './components/Selection';

const App = () => {
  const [timetable, setTimetable] = useState<Map<string, Course>>(new Map());
  const [selected, setSelected] = useState<string[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <Stack direction='row'>
      <Timetable timetable={timetable} selected={selected} hovered={hovered} />
      <Selection
        timetable={timetable}
        hovered={hovered}
        setTimetable={setTimetable}
        setSelected={setSelected}
        setHovered={setHovered}
      />
    </Stack>
  );
};

export default App;
