import { GridToolbarContainer } from '@mui/x-data-grid';
import ToggleButton from '@mui/material/ToggleButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import DownloadUpload from './DownloadUpload';
import CourseListFilters from '../utils/CourseListFilters';

interface Props {
  filters: CourseListFilters;
  setFilters: (filters: CourseListFilters) => void;
}

const CourseListToolbar = ({ filters, setFilters }: Props) => {
  return (
    <GridToolbarContainer style={{ margin: '0.6rem' }}>
      <Box sx={{
        display: 'flex', flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', width: '100%',
        }}>
        {/* selected only button */}
        <ToggleButton
          value='selected only'
          selected={filters.showSelected}
          onChange={() => setFilters({ ...filters, showSelected: !filters.showSelected })}
          style={{ padding: '0.4rem 1rem', margin: '0.2rem' }}>
          <CheckCircleIcon fontSize='small' style={{ marginRight: '0.2rem' }} />
          <Typography variant='caption' noWrap>Selected only</Typography>
        </ToggleButton>

        {/* download upload buttons */}
        <DownloadUpload />
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>

        {/* search field */}
        <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
        <TextField label='Search' variant='standard' onChange={(event) => setFilters({ ...filters, search: event.target.value})} />

        {/* sem dropdown menu */}
        <Select
          variant='standard'
          value={filters.sem}
          label='Sem'
          onChange={(event) => setFilters({ ...filters, sem: event.target.value as number })}>
          <MenuItem value={0}>Both</MenuItem>
          <MenuItem value={1}>Sem 1</MenuItem>
          <MenuItem value={2}>Sem 2</MenuItem>
        </Select>
      </Box>
    </GridToolbarContainer>
  );
};

export default CourseListToolbar;