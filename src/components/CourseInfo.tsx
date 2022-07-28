import { useContext } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import Prompt from './Prompt';
import Course from '../utils/Course';
import { dayNames, getHourString } from '../utils/TimeUtils';
import { TimetableContext } from '../context/TimetableContext';
import TabOptions from '../utils/TabOptions';

interface Props {
  info: string | null;
  setInfo: (info: string | null) => void;
}

const CourseInfo = ({ info, setInfo }: Props) => {
  const { timetable, setTimetable } = useContext(TimetableContext);

  if (!info) return null;
  
  const isHidden = timetable.tabOptions.get(timetable.currTab)!.selectedHidden.get(info!)!;

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
      </Typography>
      {course.times.map((time, i) => {
        return (
          <Box key={i} style={{ display: 'flex', flexDirection: 'row', gap: '4px', alignItems: 'center', margin: '4px' }}>
            <ToggleButton
              value='hide button'
              color='primary'
              selected={isHidden ? isHidden[i] : false}
              disabled={!timetable.selected.get(timetable.currTab)!.includes(info)}
              onChange={() => {
                setTimetable({
                  ...timetable,
                  tabOptions: timetable.tabOptions.set(
                    timetable.currTab,
                    TabOptions.fromObject({
                      ...timetable.tabOptions.get(timetable.currTab)!,
                      selectedHidden: new Map(
                        Array.from(timetable.tabOptions.get(timetable.currTab!)!.selectedHidden).map(([id, hidden]) => {
                          if (id !== info) return [id, hidden];
                          return [
                            id,
                            hidden.map((a, j) => {
                              if (j !== i) return a;
                              return !a;
                            })
                          ];
                        })
                      ),
                    })
                  ),
                });
              }}
              style={{
                padding: '4px',
              }}>
              <Typography component='span' variant='caption'>
                Hide
              </Typography>
            </ToggleButton>
            <Typography component={'span'} variant='body1'>
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
          </Box>
        );
      })}
    </Prompt>
  );
};

export default CourseInfo;