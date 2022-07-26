import { createContext } from 'react';
import Course from '../utils/Course';

export interface Timetable {
  courses: Map<string, Course>;
  selected: Map<string, string[]>;
  currTab: string;
  hovered: string | null;
  hour: number[];
  days: boolean[];
}

export const TimetableContext = createContext({
  timetable: {
    courses: new Map<string, Course>(),
    selected: new Map<string, string[]>([['untitled', []]]),
    currTab: 'untitled',
    hovered: null,
    hour: [0, 25],
    days: [true, true, true, true, true, true, true],
  } as Timetable,
  setTimetable: (timetable: Timetable) => {},
})