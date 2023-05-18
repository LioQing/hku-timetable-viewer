import { useMemo, useState, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Prompt from './Prompt';
import TimeSlotData from '../utils/TimeSlotData';
import { getHourRangeStringFromIndex, dayNames } from '../utils/TimeUtils';
import { TimetableContext } from '../context/TimetableContext';

const compareMaps = (maybeMap1: Map<string, string[]> | null, maybeMap2: Map<string, string[]> | null) => {
  if (maybeMap1 === null && maybeMap2 === null) return true;
  if (maybeMap1 === null || maybeMap2 === null) return false;

  const map1 = maybeMap1!;
  const map2 = maybeMap2!;

  const compareArrays = (arr1: string[], arr2: string[]) => {
    if (arr1.length !== arr2.length) return false;

    for (var i = 0, l = arr1.length; i < l; i++) {
      if (arr1[i] !== arr2[i]) { 
        return false;   
      }
    }
    return true;
  };

  var testVal;
  if (map1.size !== map2.size) {
    return false;
  }
  for (var [key, val] of map1) {
    testVal = map2.get(key);
    if ((testVal === undefined && !map2.has(key)) || !compareArrays(testVal!, val)) {
      return false;
    }
  }
  return true;
}

interface Props {
  day: number;
  timeIndex: number;
  data: TimeSlotData[][];
  y: number;
  x: number;
}

const TimeSlot = ({ day, timeIndex, data, y, x }: Props) => {
  const theme = useTheme();
  const { timetable } = useContext(TimetableContext);
  const [detailOpen, setDetailOpen] = useState(false);
  const currData = useMemo(() => data[y][x], [data, y, x]);

  if (
    !(
      !currData.selected
      && !currData.overlapped
      && !currData.hovered
    )
    && y > 0
    && data[y - 1][x].selected === currData.selected
    && compareMaps(data[y - 1][x].overlapped, currData.overlapped)
    && data[y - 1][x].hovered === currData.hovered
  ) return null;

  const isTimeSlotConflicted = ((): boolean => {
    if (!currData.overlapped) return false;

    return Array.from((currData.overlapped as Map<string, string[]>).values()).some((conflicted: string[]) => {
      return conflicted.length !== 0;
    });
  })();

  const rowSpan = ((): number => {
    if (!currData.overlapped && !currData.selected && !currData.hovered) return 1;

    var rowSpan = 0;
    for (var i = y; i < data.length; i++) {
      if (
        data[i][x].selected !== currData.selected
        || !compareMaps(data[i][x].overlapped, currData.overlapped)
        || data[i][x].hovered !== currData.hovered
      ) break;
      rowSpan += 1;
    }

    return rowSpan;
  })();

  const getIdWithTitle = (id: string) => {
    return `${id}: ${timetable.courses.get(id)?.courseTitle}`;
  };

  const paperHeight = (theme.typography.body2.lineHeight as number)
    * parseFloat((theme.typography.body2.fontSize as string).slice(0, -3))
    * rowSpan + 0.28 * (rowSpan - 1) + 'rem'

  return (
    <>
      <TableCell
        align='center'
        rowSpan={rowSpan}
        sx={{ borderBottom: 'none' }}
        style={{ padding: '0.14rem 4px', height: '100%' }}>
        <Paper
          elevation={3}
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: paperHeight,
            minWidth: '7.4rem',
            overflow: 'hidden',
            backgroundColor: 
              !isTimeSlotConflicted ?
                (currData.selected === null ?
                  '#FFFFFF' : '#9CF783'
                ) : '#F78F83',
            outline: currData.hovered ? '3px solid #F5B945' : 'none',
          }}>
          <ButtonBase
            onClick={() => setDetailOpen(true)}
            sx={{ textTransform: 'none' }}
            style={{ padding: 0, width: '100%', height: '100%', top: rowSpan === 1 ? '-0.04rem' : '0' }} // hack to fix rowSpan offset bug
            disabled={currData.selected === null && currData.overlapped === null}>
              <Typography component='span' variant='caption'>
                {!isTimeSlotConflicted ?
                  (currData.overlapped === null ?
                    currData.selected
                      : `<${currData.overlapped.size} overlapped>`
                  ) : `<${Array.from(currData.overlapped!.values()).filter(d => d.length > 0).length} conflicted>`
                }
              </Typography>
          </ButtonBase>
        </Paper>
      </TableCell>
      <Prompt
        title={`${getHourRangeStringFromIndex(timeIndex, rowSpan)} on ${dayNames[day]}`}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}>
        {currData.overlapped === null
          ?
          <Typography>
            {getIdWithTitle(currData.selected as string)}
          </Typography>
          :
          <Typography>
            Overlapped:
            <br />
            {Array.from(currData.overlapped.keys()).map(id => {
              return (
                <Typography component='span' key={id}>
                  {getIdWithTitle(id)}
                  {currData.overlapped!.get(id)!.length > 0
                    ?
                    ` [conflict with: ${currData.overlapped!.get(id)?.map(overlappedId => {
                      return `${overlappedId}`;
                    }).join(', ')}]`
                    :
                    null
                  }
                  <br />
                </Typography>
              );
            })}
          </Typography>
        }
      </Prompt>
    </>
  );
};

export default TimeSlot;