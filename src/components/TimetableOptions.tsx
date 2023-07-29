import { useContext } from 'react';
import Container from '@mui/material/Container';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Panel from './Panel';
import { getStartTimeFromIndex, getEndTimeFromIndex, getHourString, dayNames } from '../utils/TimeUtils';
import { TimetableContext } from '../contexts/TimetableContext';

const TimetableOptions = () => {
  const { timetable, setTimetable } = useContext(TimetableContext);

  const onHourChange = (_: any, newHourUn: number | number[], activeThumb: number) => {
    const newHour = newHourUn as number[];
    const oldHour = [timetable.hour[0], timetable.hour[1] + 1];
    const hourFixed = activeThumb === 0
      ? [Math.min(newHour[0], oldHour[1] - 1), oldHour[1] - 1]
      : [oldHour[0], Math.max(newHour[1], oldHour[0] + 1) - 1];
    setTimetable({ ...timetable, hour: hourFixed });
  };

  const onDayChange = (_: any, newDays: string[]) => {
    var days = [false, false, false, false, false, false, false];
    newDays.forEach(day => {
      days[dayNames.indexOf(day)] = true;
    });
    setTimetable({ ...timetable, days });
  };

  return (
    <Container style={{ margin: '8px', padding: 0, width: '100%' }}>
      <Panel padding>
        <Typography variant='body2'>
          {'Hour Range: '}
          {`${getHourString(getStartTimeFromIndex(timetable.hour[0]))}`}
          {' - '}
          {`${getHourString(getEndTimeFromIndex(timetable.hour[1]))}`}
        </Typography>
        <Container style={{ padding: '5px 0px' }}>
          <Slider
            getAriaLabel={() => 'Hour range'}
            getAriaValueText={(value: number) => `${value}`}
            value={[timetable.hour[0], timetable.hour[1] + 1]}
            onChange={onHourChange}
            min={0}
            max={30}
          />
        </Container>
        <Typography variant='body2'>
          Days
        </Typography>
        <ToggleButtonGroup
          value={dayNames.filter((_, i) => timetable.days[i])}
          onChange={onDayChange}
          aria-label='Days'
          style={{ margin: '4px', display: 'flex', overflow: 'auto' }}
        >
          {dayNames.map((day, i) => {
            return (
              <ToggleButton key={i} value={day} color='primary' aria-label={day}
                style={{ padding: '4px', width: '2.4rem' }}>
                <Typography variant='body2' align='center'>
                  {day}
                </Typography>
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>
      </Panel>
    </Container>
  );
};

export default TimetableOptions;