import { useState } from 'react';
import { Timetable, TimetableContext } from '../context/TimetableContext';
import TabOptions from '../utils/TabOptions';

interface Props {
  children?: React.ReactNode;
}

const TimetableProvider = ({ children }: Props) => {
  const [timetable, setTimetable] = useState<Timetable>({
    courses: new Map(),
    selected: new Map([['untitled', []]]),
    tabOptions: new Map([['untitled', new TabOptions(0, new Map())]]),
    currTab: 'untitled',
    hovered: null,
    hour: [0, 23],
    days: [true, true, true, true, true, true, true],
  });

  return (
    <TimetableContext.Provider value={{ timetable, setTimetable }}>
      {children}
    </TimetableContext.Provider>
  );
};

export default TimetableProvider;