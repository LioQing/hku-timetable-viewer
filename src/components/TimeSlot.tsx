import TableCell from '@mui/material/TableCell';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import TimeSlotData from '../utils/TimeSlotData';

interface ConflictedTooltipProps {
  children: React.ReactElement;
  conflicted: string[] | null;
}

const ConflictTooltip = ({ children, conflicted }: ConflictedTooltipProps) => {
  if (conflicted === null) {
    return children;
  }

  return (
    <Tooltip title={conflicted.join(', ')}>
      {children}
    </Tooltip>
  );
};

interface Props {
  data: TimeSlotData;
}

const TimeSlot = ({ data }: Props) => {
  return (
    <TableCell
      align='center'
      sx={{ borderBottom: 'none' }}
      style={{ padding: '2px 4px' }}>
      <ConflictTooltip conflicted={data.conflicted}>
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
              data.conflicted === null ?
                (data.selected === null ?
                  '#FFFFFF' : '#9CF783'
                ) : '#F78F83',
            outline: data.hovered ? '3px solid #F5B945' : 'none',
          }}>
          <Typography variant='caption'>
            {data.conflicted === null ?
              data.selected : `<${data.conflicted.length} conflicted>`
            }
          </Typography>
        </Paper>
      </ConflictTooltip>
    </TableCell>
  );
};

export default TimeSlot;