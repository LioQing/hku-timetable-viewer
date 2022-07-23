import Paper from "@mui/material/Paper";
import Container from "@mui/material/Container";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { getStartTimeFromIndex, getEndTimeFromIndex, getHourString } from '../utils/TimeUtils';

interface Props {
  hour: number[];
  setHour: (newHour: number[]) => void;
  days: boolean[];
  setDays: (newDays: boolean[]) => void;
}

const TimetableOptions = ({ hour, setHour, days, setDays }: Props) => {
  const daysName = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const onHourChange = (_: any, newHourUn: number | number[], activeThumb: number) => {
    const newHour = newHourUn as number[];
    const oldHour = [hour[0], hour[1] + 1];
    const hourFixed = activeThumb === 0
    ? [Math.min(newHour[0], oldHour[1] - 1), oldHour[1] - 1]
    : [oldHour[0], Math.max(newHour[1], oldHour[0] + 1) - 1];
    setHour(hourFixed);
  };

  const onDayChange = (_: any, newDays: string[]) => {
    var days = [false, false, false, false, false, false, false];
    newDays.forEach(day => {
      days[daysName.indexOf(day)] = true;
    });
    setDays(days);
  };

  return (
    <Container style={{ margin: '8px', padding: 0, width: '100%' }}>
      <Paper elevation={3} style={{ padding: '8px 16px' }}>
        <Typography variant='body2'>
          {`Hour Range: ${getHourString(getStartTimeFromIndex(hour[0]))} - ${getHourString(getEndTimeFromIndex(hour[1]))}`}
        </Typography>
        <Container style={{ padding: '5px 0px' }}>
          <Slider
            getAriaLabel={() => 'Hour range'}
            getAriaValueText={(value: number) => `${value}`}
            value={[hour[0], hour[1] + 1]}
            onChange={onHourChange}
            min={0}
            max={30}
          />
        </Container>
        <Typography variant='body2'>
          Days
        </Typography>
        <ToggleButtonGroup
          value={daysName.filter((_, i) => days[i])}
          onChange={onDayChange}
          aria-label='Days'
          style={{ margin: '4px', display: 'flex', overflow: 'auto' }}
        >
          {daysName.map((day, i) => {
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
      </Paper>
    </Container>
  );
};

export default TimetableOptions;