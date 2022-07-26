import { useState } from 'react';
import { Timetable, TimetableContext } from '../context/TimetableContext';

interface Props {
  children?: React.ReactNode;
}

const TimetableProvider = ({ children }: Props) => {
  const [timetable, setTimetable] = useState<Timetable>({
    courses: new Map(),
    selected: new Map([['untitled', []]]),
    currTab: 'untitled',
    hovered: null,
    hour: [0, 25],
    days: [true, true, true, true, true, true, true],
  });

  return (
    <TimetableContext.Provider value={{ timetable, setTimetable }}>
      {children}
    </TimetableContext.Provider>
  );
};

export default TimetableProvider;