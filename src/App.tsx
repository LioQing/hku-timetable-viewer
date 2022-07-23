import { useState } from 'react';
import Stack from '@mui/material/Stack';
import Course from './utils/Course';
import Timetable from './components/Timetable';
import Selection from './components/Selection';

const App = () => {
  const [timetable, setTimetable] = useState<Map<string, Course>>(new Map());
  const [selected, setSelected] = useState<string[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [hour, setHour] = useState<number[]>([0, 25]);
  const [days, setDays] = useState<boolean[]>([true, true, true, true, true, true, true]);

  return (
    <Stack direction='row'>
      <Selection
        timetable={timetable}
        selected={selected}
        hovered={hovered}
        hour={hour}
        days={days}
        setTimetable={setTimetable}
        setSelected={setSelected}
        setHovered={setHovered}
        setHour={setHour}
        setDays={setDays}
      />
      <Timetable timetable={timetable} selected={selected} hovered={hovered} hour={hour} days={days} />
    </Stack>
  );
};

export default App;
