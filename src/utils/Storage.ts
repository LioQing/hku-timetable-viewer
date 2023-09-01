import LZString from 'lz-string';
import { Timetable } from '../contexts/TimetableContext';
import Course from './Course';
import TabOptions from './TabOptions';
import { Settings } from '../contexts/SettingsContext';
import ThemeMode from './ThemeMode';

interface TabData {
  selected: string[];
  options: string;
}

const tabDataToSelected = (tabData: Map<string, TabData>): Map<string, string[]> => {
  const result = new Map<string, string[]>();
  for (const [key, value] of tabData) {
    result.set(key, value.selected);
  }
  return result;
};

const tabDataToOptions = (tabData: Map<string, TabData>): Map<string, TabOptions> => {
  const result = new Map<string, TabOptions>();
  for (const [key, value] of tabData) {
    result.set(key, TabOptions.fromJson(value.options));
  }
  return result;
};

const saveTimetableCourses = (timetable: Timetable) => {
  const jsonString = JSON.stringify(Object.fromEntries(timetable.courses));
  const compressed = LZString.compress(jsonString);
  localStorage.setItem('timetable', compressed);
};

const loadTimetableCourses = (): Map<string, Course> => {
  const item = localStorage.getItem('timetable');
  if (item === null) return new Map<string, Course>();
  const decompressed = LZString.decompress(item);
  const courses = JSON.parse(decompressed);
  const result = new Map<string, Course>();
  for (const [key, value] of Object.entries(courses)) {
    const course = Course.fromObject(value);

    for (const time of course.times) {
      time.startDate = new Date(time.startDate);
      time.endDate = new Date(time.endDate);
      time.startTime = new Date(time.startTime);
      time.endTime = new Date(time.endTime);
    }

    result.set(key, course);
  }
  return result;
};

const saveTabs = (timetable: Timetable) => {
  const tabs: Map<string, TabData> = new Map();
  for (const [key, value] of timetable.selected) {
    tabs.set(key, {
      selected: value,
      options: timetable.tabOptions.get(key)?.toJson() || new TabOptions(1, new Map()).toJson(),
    });
  }

  const jsonString = JSON.stringify(Object.fromEntries(tabs));
  const compressed = LZString.compress(jsonString);
  localStorage.setItem('selected', compressed);
};

const loadTabs = (): Map<string, TabData> => {
  const item = localStorage.getItem('selected');
  if (item === null) return new Map<string, TabData>();
  const decompressed = LZString.decompress(item);
  const tabs = JSON.parse(decompressed);
  const result = new Map<string, TabData>();
  for (const [key, value] of Object.entries(tabs)) {
    const tabData = value as TabData;
    result.set(key, tabData);
  }
  return result;
};

const saveTimetable = (timetable: Timetable) => {
  saveTimetableCourses(timetable);
  saveTabs(timetable);
};

const loadTimetable = (timetable: Timetable): Timetable | null => {
  const item = localStorage.getItem('timetable');
  if (item === null) return null;
  const courses = loadTimetableCourses();
  const tabs = loadTabs();
  timetable.courses = courses;
  timetable.selected = tabDataToSelected(tabs);
  timetable.tabOptions = tabDataToOptions(tabs);
  timetable.currTab = tabs.keys().next().value;
  timetable.hovered = null;
  return timetable;
};

const saveSettings = (settings: Settings) => {
  localStorage.setItem('settings', JSON.stringify(settings));
};

const loadSettings = (): Settings => {
  const item = localStorage.getItem('settings');
  if (item === null) return { themeMode: ThemeMode.Light };
  const settings = JSON.parse(item);
  console.log(settings);
  return settings;
};

export { saveTimetable, loadTimetable, saveSettings, loadSettings };
