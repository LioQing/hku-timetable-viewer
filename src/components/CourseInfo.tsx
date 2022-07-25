import { useContext } from 'react';
import Typography from '@mui/material/Typography';
import Prompt from './Prompt';
import Course from '../utils/Course';
import { dayNames, getHourString } from '../utils/TimeUtils';
import { TimetableContext } from '../context/TimetableContext';

interface Props {
  info: string | null;
  setInfo: (info: string | null) => void;
}

const CourseInfo = ({ info, setInfo }: Props) => {
  const { timetable } = useContext(TimetableContext);

  if (!info) return null;

  const maybeCourse = timetable.courses.get(info);
  if (!maybeCourse) {
    console.error(`CourseInfo: course ${info} not found`);
    return null;
  }
  const course = maybeCourse as Course;

  return (
    <Prompt title='Course Info' open={info !== null} onClose={() => setInfo(null)}>
      <Typography variant='h4'>{course.courseTitle}</Typography>
      <Typography variant='body1'>
        Term: {course.term}
        <br />
        Career: {course.acadCareer}
        <br />
        Offer Department: {course.offerDept}
        <br />
        <br />
        Instructor: {course.instructor}
        <br />
        <br />
        {course.times.map((time, i) => {
          return (
            <Typography component={'span'} key={i} variant='body1'>
              {time.startDate.toLocaleDateString('en-GB')}
              {' - '}
              {time.endDate.toLocaleDateString('en-GB')}
              {'; '}
              {getHourString(time.startTime)}
              {' - '}
              {getHourString(time.endTime)}
              {'; '}
              {time.weekday
                .map((day, index) => {
                  if (!day) return null;
                  return dayNames[index];
                })
                .filter(day => day !== null)
                .join(', ')
              }
              {'; '}
              {time.venue}
              <br />
            </Typography>
          );
        })}
      </Typography>
    </Prompt>
  );
};

export default CourseInfo;