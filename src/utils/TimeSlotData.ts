import { Timetable } from '../context/TimetableContext';
import { getIndexFromStartTime, getIndexFromEndTime } from './TimeUtils';

const areDateRangesOverlapped = (a_start: Date, a_end: Date, b_start: Date, b_end: Date) => {
  if (a_start <= b_start && b_start <= a_end) return true;
  if (a_start <= b_end   && b_end   <= a_end) return true;
  if (b_start <  a_start && a_end   <  b_end) return true;
  return false;
};

class TimeSlotData {
  selected: string | null;
  overlapped: Map<string, string[]> | null; // key: course id, value: conflicted course id
  hovered: boolean;

  constructor(selected: string | null, overlapped: Map<string, string[]> | null, hovered: boolean) {
    this.selected = selected;
    this.overlapped = overlapped;
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

    const currTabOpt = timetable.tabOptions.get(timetable.currTab)!;

    // selected
    for (const id of timetable.selected.get(timetable.currTab) as string[]) {
      const maybeCourse = timetable.courses.get(id);
      if (!maybeCourse) {
        console.error(`Course ${id} not found in timetable`);
        continue;
      }

      const course = maybeCourse!;
      for (const [courseTimeIndex, courseTime] of course.times.entries()) {
        if (currTabOpt.selectedHidden.get(id)![courseTimeIndex]) continue;

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

            // selected or overlapped
            if (datum.selected === null) {
              datum.selected = id;
            } else if (
              datum.selected! !== id
              && (
                datum.overlapped === null
                || !Array.from(datum.overlapped.keys()).includes(id)
                )
            ) {
              // initialize overlapped if not initialized
              if (datum.overlapped === null) {
                datum.overlapped = new Map([[datum.selected, []]]);
              }
              
              // add id to overlapped
              datum.overlapped.set(id, []);
            }

            // check conflict with other overlapped courses with this course
            if (!datum.overlapped) continue;

            for (const [otherId, otherConflict] of datum.overlapped as Map<string, string[]>) {
              if (otherId === id) continue;

              for (const [otherCourseTimeIndex, otherCourseTime] of timetable.courses.get(otherId)!.times.entries()) {
                if (currTabOpt.selectedHidden.get(id)![otherCourseTimeIndex]) continue;

                if (!otherCourseTime.weekday[dayIndex]) continue;

                const otherStartIndex = getIndexFromStartTime(otherCourseTime.startTime);
                const otherEndIndex = getIndexFromEndTime(otherCourseTime.endTime);

                if (!(otherStartIndex <= i && i <= otherEndIndex)) continue;

                if (otherConflict.includes(id)) continue;

                if (areDateRangesOverlapped(
                  otherCourseTime.startDate, otherCourseTime.endDate,
                  courseTime.startDate, courseTime.endDate,
                )) {
                  otherConflict.push(id);
                  datum.overlapped.get(id)!.push(otherId);
                }
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

      const course = maybeCourse!;
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