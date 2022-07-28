import { useState, useContext } from 'react';
import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Prompt from './Prompt';
import TimeSlotData from '../utils/TimeSlotData';
import { getHourRangeStringFromIndex, dayNames } from '../utils/TimeUtils';
import { TimetableContext } from '../context/TimetableContext';

interface Props {
  day: number;
  timeIndex: number;
  data: TimeSlotData;
}

const TimeSlot = ({ day, timeIndex, data }: Props) => {
  const { timetable } = useContext(TimetableContext);
  const [detailOpen, setDetailOpen] = useState(false);

  const isTimeSlotConflicted = (): boolean => {
    if (!data.overlapped) return false;

    return Array.from((data.overlapped as Map<string, string[]>).values()).some((conflicted: string[]) => {
      return conflicted.length !== 0;
    });
  };

  const getIdWithTitle = (id: string) => {
    return `${id}: ${timetable.courses.get(id)?.courseTitle}`;
  };

  return (
    <>
      <TableCell
        align='center'
        sx={{ borderBottom: 'none' }}
        style={{ padding: '2px 4px' }}>
        <Button
          onClick={() => setDetailOpen(true)}
          sx={{ textTransform: 'none' }}
          style={{ padding: 0 }}
          disabled={data.selected === null && data.overlapped === null}>
          <Paper
            elevation={3}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '1.2rem',
              minWidth: '7.4rem',
              overflow: 'hidden',
              backgroundColor: 
                !isTimeSlotConflicted() ?
                  (data.selected === null ?
                    '#FFFFFF' : '#9CF783'
                  ) : '#F78F83',
              outline: data.hovered ? '3px solid #F5B945' : 'none',
            }}>
            <Typography component='span' variant='caption'>
              {!isTimeSlotConflicted() ?
                (data.overlapped === null ?
                  data.selected : `<${data.overlapped.size} overlapped>`
                ) : `<${Array.from(data.overlapped!.values()).filter(x => x.length > 0).length} conflicted>`
              }
            </Typography>
          </Paper>
        </Button>
      </TableCell>
      <Prompt
        title={`${getHourRangeStringFromIndex(timeIndex)} on ${dayNames[day]}`}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}>
        {data.overlapped === null
          ?
          <Typography>
            {getIdWithTitle(data.selected as string)}
          </Typography>
          :
          <Typography>
            Overlapped:
            <br />
            {Array.from(data.overlapped.keys()).map(id => {
              return (
                <Typography component='span' key={id}>
                  {getIdWithTitle(id)}
                  {data.overlapped!.get(id)!.length > 0
                    ?
                    ` [conflict with: ${data.overlapped!.get(id)?.map(overlappedId => {
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