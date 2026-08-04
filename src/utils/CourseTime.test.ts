import CourseTime from './CourseTime';

const baseCourseTimeData = {
  'START DATE': '2026-09-01',
  'END DATE': '2026-12-01',
  'START TIME': '09:00',
  'END TIME': '10:00',
  'VENUE': 'Test venue',
};

describe('CourseTime.fromData', () => {
  test('ignores explicit empty weekday cells', () => {
    const courseTime = CourseTime.fromData({
      ...baseCourseTimeData,
      MON: '',
      TUE: '',
      WED: '',
      THU: 'THU',
      FRI: '',
      SAT: '',
      SUN: '',
    });

    expect(courseTime.weekday).toEqual([false, false, false, true, false, false, false]);
  });

  test('supports the legacy format with only present weekday keys', () => {
    const courseTime = CourseTime.fromData({
      ...baseCourseTimeData,
      MON: 'MON',
    });

    expect(courseTime.weekday).toEqual([true, false, false, false, false, false, false]);
  });

  test('treats empty and falsy weekday values as absent', () => {
    const courseTime = CourseTime.fromData({
      ...baseCourseTimeData,
      MON: '',
      TUE: '   ',
      WED: null,
      THU: undefined,
      FRI: false,
      SAT: 0,
      SUN: '',
    });

    expect(courseTime.weekday).toEqual([false, false, false, false, false, false, false]);
  });

  test('supports multiple truthy weekday markers', () => {
    const courseTime = CourseTime.fromData({
      ...baseCourseTimeData,
      TUE: 'TUE',
      FRI: true,
      SUN: 1,
    });

    expect(courseTime.weekday).toEqual([false, true, false, false, true, false, true]);
  });
});
