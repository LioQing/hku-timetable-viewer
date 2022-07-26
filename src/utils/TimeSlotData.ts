import { Timetable } from '../context/TimetableContext';
import Course from './Course';
import { getIndexFromStartTime, getIndexFromEndTime } from './TimeUtils';

class TimeSlotData {
  selected: string | null;
  conflicted: string[] | null;
  hovered: boolean;

  constructor(selected: string | null, conflicted: string[] | null, hovered: boolean) {
    this.selected = selected;
    this.conflicted = conflicted;
    this.hovered = hovered;
  }

  static fromTimetable(timetable: Timetable): TimeSlotData[][] {
    var data: TimeSlotData[][] = [];
    for (let i = 0; i < 30; i++) {
      data.push([]);
      for (let j = 0; j < 7; j++) {
        data[i].push(new TimeSlotData(null, null, false));
      }
    }

    // selected
    for (const id of timetable.selected.get(timetable.currTab) as string[]) {
      const maybeCourse = timetable.courses.get(id);
      if (!maybeCourse) {
        console.error(`Course ${id} not found in timetable`);
        continue;
      }

      const course = maybeCourse as Course;
      for (const courseTime of course.times) {
        for (const [dayIndex, day] of courseTime.weekday.entries()) {
          if (!day || dayIndex >= data[0].length || dayIndex < 0) {
            continue;
          }
          
          const startIndex = getIndexFromStartTime(courseTime.startTime);
          const endIndex = getIndexFromEndTime(courseTime.endTime);

          for (let i = startIndex; i <= endIndex; i++) {
            if (i >= data.length || i < 0) {
              continue;
            }

            var datum = data[i][dayIndex];
            if (datum.selected === null) {
              datum.selected = id;
            } else if (
              datum.selected as string !== id
              && (
                datum.conflicted === null
                || !(datum.conflicted as string[]).includes(id)
                )
            ) {
              if (datum.conflicted === null) {
                datum.conflicted = [datum.selected as string, id];
              } else {
                datum.conflicted.push(id);
              }
            }
          }
        }
      }
    }

    // hovered
    if (timetable.hovered !== null) {
      const maybeCourse = timetable.courses.get(timetable.hovered);
      if (maybeCourse === undefined) {
        console.error(`Course ${timetable.hovered} not found in timetable`);
        return data;
      }

      const course = maybeCourse as Course;
      for (const courseTime of course.times) {
        for (const [dayIndex, day] of courseTime.weekday.entries()) {
          if (!day || dayIndex >= data[0].length || dayIndex < 0) continue;
          
          const startIndex = getIndexFromStartTime(courseTime.startTime);
          const endIndex = getIndexFromEndTime(courseTime.endTime);

          for (let i = startIndex; i <= endIndex; i++) {
            if (i >= data.length || i < 0) continue;

            data[i][dayIndex].hovered = true;
          }
        }
      }
    }

    return data;
  }
}

export default TimeSlotData;