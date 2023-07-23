import { memo, useMemo, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import TimeSlot from './TimeSlot';
import TabView from './TabView';
import compareMaps from '../utils/compareMaps';
import TimeSlotData from '../utils/TimeSlotData';
import { getHourRangeStringFromIndex, dayNames } from '../utils/TimeUtils';
import { TimetableContext } from '../context/TimetableContext';

interface MemoTimeSlotProps {
  rowSpan: number;
  currData: TimeSlotData;
}

const memoTimeSlots = Array(30).fill(null).map((_, i) => {
  return Array(7).fill(null).map((_, j) => {
    return memo(
      ({ rowSpan, currData }: MemoTimeSlotProps) => {
        return <TimeSlot key={`${i}-${j}`} day={j} timeIndex={i} currData={currData} rowSpan={rowSpan} />;
      },
      (prevProps, nextProps) => {
        return (
          prevProps.rowSpan === nextProps.rowSpan
          && prevProps.currData.selected === nextProps.currData.selected
          && compareMaps(prevProps.currData.overlapped, nextProps.currData.overlapped)
          && prevProps.currData.hovered === nextProps.currData.hovered
        );
      },
    );
  });
});

const Timetable = () => {
  const theme = useTheme();
  const { timetable } = useContext(TimetableContext);

  // useRef for checking if data is changed
  const data = useMemo(() => {
    return TimeSlotData.fromTimetable(timetable);
  }, [timetable]);

  // use memo to prevent re-rendering
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
            .filter((_, i) => i >= timetable.hour[0])
            .map((_, i) => (
                <TableRow key={i}>
                  <TableCell
                    align='right'
                    sx={{ borderBottom: 'none' }}
                    style={{ padding: '0.14rem 8px' }}>
                    <Box style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                      width: '6rem',
                      height: theme.typography.body2.lineHeight,
                      padding: 0,
                    }}>
                      <Typography variant='body2'>
                        {getHourRangeStringFromIndex(i)}
                      </Typography>
                    </Box>
                  </TableCell>

                  {dayNames
                    .filter((_, j) => timetable.days[j])
                    .map((_, j) => {
                      const currData = data[i][j];
                      const y = i;
                      const x = j;

                      if (
                        !(
                          !currData.selected
                          && !currData.overlapped
                          && !currData.hovered
                        )
                        && y > timetable.hour[0]
                        && data[i - 1][x].selected === currData.selected
                        && compareMaps(data[y - 1][x].overlapped, currData.overlapped)
                        && data[y - 1][x].hovered === currData.hovered
                      ) return null;
                    
                      const rowSpan = ((): number => {
                        if (!currData.overlapped && !currData.selected && !currData.hovered) return 1;
                    
                        var rowSpan = 0;
                        for (var i = y; i <= timetable.hour[1]; i++) {
                          if (
                            data[i][x].selected !== currData.selected
                            || !compareMaps(data[i][x].overlapped, currData.overlapped)
                            || data[i][x].hovered !== currData.hovered
                          ) break;
                          rowSpan += 1;
                        }
                    
                        return rowSpan;
                      })();

                      const MemoTimeSlot = memoTimeSlots[y][x];
                      return <MemoTimeSlot key={`${y}-${x}`} rowSpan={rowSpan} currData={currData} />;
                    })
                  }
                </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </Box>
  );
};

export default Timetable;