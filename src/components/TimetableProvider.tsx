import { useState } from 'react';
import { Timetable, TimetableContext } from '../context/TimetableContext';

interface Props {
  children?: React.ReactNode;
}

const TimetableProvider = ({ children }: Props) => {
  const [timetable, setTimetable] = useState<Timetable>({
    courses: new Map(),
    selected: [],
    currTab: 'untitled',
    hovered: null,
  });

  return (
    <TimetableContext.Provider value={{ timetable, setTimetable }}>
      {children}
    </TimetableContext.Provider>
  );
};

export default TimetableProvider;