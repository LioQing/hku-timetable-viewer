import { createContext } from 'react';
import Course from '../utils/Course';

export interface Timetable {
  courses: Map<string, Course>;
  selected: string[];
  currTab: string;
  hovered: string | null;
}

export const TimetableContext = createContext({
  timetable: {
    courses: new Map<string, Course>(),
    selected: [],
    currTab: 'untitled',
    hovered: null,
  } as Timetable,
  setTimetable: (timetable: Timetable) => {},
})