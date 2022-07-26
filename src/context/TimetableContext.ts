import { createContext } from 'react';
import Course from '../utils/Course';
import TabOptions from '../utils/TabOptions';

export interface Timetable {
  courses: Map<string, Course>;
  selected: Map<string, string[]>;
  tabOptions: Map<string, TabOptions>;
  currTab: string;
  hovered: string | null;
  hour: number[];
  days: boolean[];
}

export const TimetableContext = createContext({
  timetable: {
    courses: new Map<string, Course>(),
    selected: new Map<string, string[]>([['untitled', []]]),
    tabOptions: new Map<string, TabOptions>([['untitled', new TabOptions(1)]]),
    currTab: 'untitled',
    hovered: null,
    hour: [0, 23],
    days: [true, true, true, true, true, true, true],
  } as Timetable,
  setTimetable: (timetable: Timetable) => {},
})