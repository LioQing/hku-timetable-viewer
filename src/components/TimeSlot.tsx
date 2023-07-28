import { useState, useContext } from 'react';
import { useTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';
import Prompt from './Prompt';
import TimeSlotData from '../utils/TimeSlotData';
import { getHourRangeStringFromIndex, dayNames } from '../utils/TimeUtils';
import { TimetableContext } from '../context/TimetableContext';

interface Props {
  day: number;
  timeIndex: number;
  currData: TimeSlotData;
  rowSpan: number;
}

const TimeSlot = ({ day, timeIndex, currData, rowSpan }: Props) => {
  const theme = useTheme();
  const { timetable } = useContext(TimetableContext);
  const [detailOpen, setDetailOpen] = useState(false);

  const isTimeSlotConflicted = ((): boolean => {
    if (!currData.overlapped) return false;

    return Array.from((currData.overlapped as Map<string, string[]>).values()).some((conflicted: string[]) => {
      return conflicted.length !== 0;
    });
  })();

  const getIdWithTitle = (id: string) => {
    return `${id}: ${timetable.courses.get(id)?.courseTitle}`;
  };

  const paperHeight = (theme.typography.body2.lineHeight as number)
    * parseFloat((theme.typography.body2.fontSize as string).slice(0, -3))
    * rowSpan + 0.28 * (rowSpan - 1) + 'rem'

  const joinedOverlappedStr = currData.overlapped
    ? [...currData.overlapped!.keys()].slice(0, rowSpan - 2).join(' \n ')
    : '';

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
                  theme.palette.background.default : '#9CF783'
                ) : '#F78F83',
            color: 'black',
            outline: currData.hovered ? '3px solid #F5B945' : 'none',
          }}>
          <ButtonBase
            onClick={() => setDetailOpen(true)}
            sx={{ textTransform: 'none' }}
            style={{ padding: 0, width: '100%', height: '100%', top: rowSpan === 1 ? '-0.04rem' : '0' }} // hack to fix rowSpan offset bug
            disabled={currData.selected === null && currData.overlapped === null}>
            <Typography component='span' variant='caption' style={{ whiteSpace: 'pre-line' }}>
              {!isTimeSlotConflicted ?
                (currData.overlapped === null ?
                  currData.selected
                  : `\
                      <${currData.overlapped.size} overlapped> \n \
                      ${joinedOverlappedStr} ${joinedOverlappedStr !== '' ? ' \n ' : ''} \
                      •••\
                      `
                ) : `\
                  <${Array.from(currData.overlapped!.values()).filter(d => d.length > 0).length} conflicted> \n \
                  ${joinedOverlappedStr} ${joinedOverlappedStr !== '' ? ' \n ' : ''} \
                  •••\
                  `
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