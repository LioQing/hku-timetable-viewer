import { useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Container from '@mui/material/Container';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TimeSlot from './TimeSlot';
import Course from '../utils/Course';
import TimeSlotData from '../utils/TimeSlotData';

const getStartTimeFromIndex = (index: number): Date => {
  return addHours(
    new Date('01/01/1970 08:30'),
    index / 2,
  );
};

const getEndTimeFromIndex = (index: number): Date => {
  return addHours(
    new Date('01/01/1970 08:50'),
    index / 2,
  );
};

const getIndexFromStartTime = (startTime: Date): number => {
  const firstTime = new Date('01/01/1970 08:30');
  return Math.floor(
    (
      startTime.getHours() * 60 + startTime.getMinutes() -
      firstTime.getHours() * 60 - firstTime.getMinutes()
    ) / 30);
};

const getIndexFromEndTime = (startTime: Date): number => {
  const firstTime = new Date('01/01/1970 08:50');
  return Math.floor(
    (
      startTime.getHours() * 60 + startTime.getMinutes() -
      firstTime.getHours() * 60 - firstTime.getMinutes()
    ) / 30);
};

const addHours = (date: Date, h: number) => {
  date.setTime(date.getTime() + (h * 60 * 60 * 1000));
  return date;
};

const processTimetable = (
  timetable: Map<string, Course>,
  selected: string[],
  hovered: string | null
): TimeSlotData[][] => {
  var data: TimeSlotData[][] = [];
  for (let i = 0; i < 28; i++) {
    data.push([]);
    for (let j = 0; j < 7; j++) {
      data[i].push({
        selected: null,
        conflicted: null,
        hovered: false,
      } as TimeSlotData);
    }
  }

  // selected
  for (const id of selected) {
    const maybeCourse = timetable.get(id);
    if (maybeCourse === null) {
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
  if (hovered !== null) {
    const maybeCourse = timetable.get(hovered);
    if (maybeCourse === undefined) {
      console.error(`Course ${hovered} not found in timetable`);
      return data;
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

          data[i][dayIndex].hovered = true;
        }
      }
    }
  }

  return data;
};

interface Props {
  timetable: Map<string, Course>;
  selected: string[];
  hovered: string | null;
}

const Timetable = ({ timetable, selected, hovered }: Props) => {
  const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const data = useMemo(() => {
    return processTimetable(timetable, selected, hovered);
  }, [timetable, selected, hovered]);

  return (
    <Box style={{ overflow: 'auto', padding: '10px' }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }} style={{ padding: 0 }} />
            {weekdays.map(day => {
              return (
                <TableCell
                  key={`${day}-day`}
                  align='center' 
                  sx={{ borderBottom: 'none' }}
                  style={{ padding: 0 }}>
                  {day}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {Array(28)
            .fill(0)
            .map((_, i) => {
              return (
                <TableRow key={i}>
                  <TableCell
                    align='right'
                    sx={{ borderBottom: 'none' }}
                    style={{ padding: '1px 8px' }}>
                    <Container style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        width: '6rem',
                        padding: 0,
                      }}>
                      <Typography variant='body2'>
                        {`${getStartTimeFromIndex(i).toLocaleTimeString('en-GB', {
                          hour12: false, 
                          hour: 'numeric', 
                          minute: 'numeric',
                        })} - ${getEndTimeFromIndex(i).toLocaleTimeString('en-GB', {
                          hour12: false, 
                          hour: 'numeric', 
                          minute: 'numeric',
                        })}`}
                      </Typography>
                    </Container>
                  </TableCell>
                  
                  {weekdays.map((_, j) => {
                    return (
                      <TimeSlot key={`${i}-${j}`} data={data[i][j]} />
                    );
                  })}
                </TableRow>
              );
            })
          }
        </TableBody>
      </Table>
    </Box>
  );
};

export default Timetable;
