import { useMemo, useContext } from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import TimeSlot from './TimeSlot';
import TabView from './TabView';
import TimeSlotData from '../utils/TimeSlotData';
import { getHourRangeStringFromIndex, dayNames } from '../utils/TimeUtils';
import { TimetableContext } from '../context/TimetableContext';

const Timetable = () => {
  const { timetable } = useContext(TimetableContext);

  const data = useMemo(() => {
    return TimeSlotData.fromTimetable(timetable);
  }, [timetable]);

  return (
    <Box style={{ padding: '10px' }}>
      <TabView />
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ borderBottom: 'none' }} style={{ padding: 0 }} />
            {dayNames.map((day, i) => {
              if (!timetable.days[i]) return null;

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
          {Array(timetable.hour[1] + 1)
            .fill(0)
            .map((_, i) => {
              if (i < timetable.hour[0]) {
                return null;
              }

              return (
                <TableRow key={i}>
                  <TableCell
                    align='right'
                    sx={{ borderBottom: 'none' }}
                    style={{ padding: '1px 8px' }}>
                    <Box style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      width: '6rem',
                    }}>
                      <Typography variant='body2'>
                        {getHourRangeStringFromIndex(i)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {dayNames.map((_, j) => {
                    if (!timetable.days[j]) return null;
                    return (<TimeSlot key={`${i}-${j}`} day={j} timeIndex={i} data={data[i][j]} />);
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