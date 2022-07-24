import { GridToolbarContainer } from '@mui/x-data-grid';
import ToggleButton from '@mui/material/ToggleButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import Course from '../utils/Course';
import DownloadUpload from './DownloadUpload';

interface Props {
  showSelected: boolean;
  setShowSelected: (showSelected: boolean) => void;
  setSearch: (search: string) => void;
  sem: number;
  setSem: (sem: number) => void;
  timetable: Map<string, Course>;
  selected: string[];
  setTimetable: (timetable: Map<string, Course>) => void;
  setSelected: (selected: string[]) => void;
  setHovered: (hovered: string | null) => void;
}

const CourseListToolbar = ({
  showSelected, setShowSelected, setSearch, sem, setSem,
  timetable, selected, setTimetable, setSelected, setHovered
}: Props) => {
  return (
    <GridToolbarContainer style={{ margin: '0.6rem' }}>
      <Box sx={{
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        marginBottom: '8px', justifyContent: 'space-between', width: '100%',
        }}>
        <ToggleButton
          value='show selected'
          selected={showSelected}
          onChange={(_) => {
            setShowSelected(!showSelected);
          }}
          style={{ padding: '0.4rem 1rem', margin: '0.2rem' }}>
          <CheckCircleIcon fontSize='small' style={{ marginRight: '0.2rem' }} />
          <Typography variant='caption' noWrap>Selected only</Typography>
        </ToggleButton>
        <DownloadUpload
          timetable={timetable} selected={selected}
          setTimetable={setTimetable} setSelected={setSelected} setHovered={setHovered}
        />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
        <TextField label='Search' variant='standard' onChange={(event: any) => setSearch(event.target.value)} />
        <Select variant='standard' value={sem} label='Sem' onChange={(event: any) => setSem(event.target.value)}>
          <MenuItem value={0}>Both</MenuItem>
          <MenuItem value={1}>Sem 1</MenuItem>
          <MenuItem value={2}>Sem 2</MenuItem>
        </Select>
      </Box>
    </GridToolbarContainer>
  );
};

export default CourseListToolbar;