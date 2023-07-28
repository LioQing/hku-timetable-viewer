import { useContext, useMemo } from 'react';
import { GridToolbarContainer } from '@mui/x-data-grid';
import ToggleButton from '@mui/material/ToggleButton';
import IconButton from '@mui/material/IconButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import DarkMode from '@mui/icons-material/DarkMode';
import LightMode from '@mui/icons-material/LightMode';
import DownloadUpload from './DownloadUpload';
import CourseListFilters, { SearchBy } from '../utils/CourseListFilters';
import TabOptions from '../utils/TabOptions';
import { TimetableContext } from '../contexts/TimetableContext';
import { SettingsContext, ThemeMode } from '../contexts/SettingsContext';

interface Props {
  filters: CourseListFilters;
  setFilters: (filters: CourseListFilters) => void;
}

const CourseListToolbar = ({ filters, setFilters }: Props) => {
  const { timetable, setTimetable } = useContext(TimetableContext);
  const { settings, setSettings } = useContext(SettingsContext);
  const opt = useMemo(() => {
    return timetable.tabOptions.get(timetable.currTab) as TabOptions;
  }, [timetable]);

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
          style={{ padding: '0.4rem', margin: '0.2rem' }}>
          <CheckCircleIcon fontSize='small' style={{ marginRight: '0.2rem' }} />
          <Typography variant='caption' noWrap style={{ position: 'relative', top: '0.1rem' }}>Selected only</Typography>
        </ToggleButton>

        {/* download upload buttons */}
        <DownloadUpload />

        {/* light/dark mode toggle button */}
        <IconButton
          component='label'
          onClick={() => setSettings({
            ...settings,
            themeMode: settings.themeMode === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark,
          })}
          style={{ padding: '0.4rem', margin: '0.2rem' }}>
          {settings.themeMode === 'dark' ? <LightMode /> : <DarkMode />}
        </IconButton>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>

        {/* search field */}
        <SearchIcon sx={{ color: 'action.active', mr: 1, my: 0.5 }} />
        <TextField
          label='Search (Regex)'
          variant='standard'
          onChange={(event) => setFilters({ ...filters, search: event.target.value })}
        />

        {/* sem dropdown menu */}
        <Select
          variant='standard'
          value={opt.sem}
          label='Sem'
          onChange={(event) => setTimetable({
            ...timetable,
            tabOptions: timetable.tabOptions.set(
              timetable.currTab,
              TabOptions.fromObject({ ...opt, sem: event.target.value as number }),
            ),
          })}>
          <MenuItem value={0}>Both</MenuItem>
          <MenuItem value={1}>Sem 1</MenuItem>
          <MenuItem value={2}>Sem 2</MenuItem>
        </Select>
      </Box>
      <Box sx={{ display: 'flex' }}>
        {/* label */}
        <Typography variant='subtitle1' alignSelf='center' noWrap>Search by:</Typography>

        {/* search by course code button */}
        <ToggleButton
          value='course code'
          selected={filters.searchBy === SearchBy.Code}
          onChange={() => setFilters({ ...filters, searchBy: SearchBy.Code })}
          style={{ padding: '0.4rem', margin: '0.4rem' }}>
          <Typography variant='caption' noWrap style={{ position: 'relative', top: '0.1rem' }}>Code</Typography>
        </ToggleButton>

        {/* search by course title button */}
        <ToggleButton
          value='course title'
          selected={filters.searchBy === SearchBy.Title}
          onChange={() => setFilters({ ...filters, searchBy: SearchBy.Title })}
          style={{ padding: '0.4rem', margin: '0.4rem' }}>
          <Typography variant='caption' noWrap style={{ position: 'relative', top: '0.1rem' }}>Title</Typography>
        </ToggleButton>
      </Box>
    </GridToolbarContainer>
  );
};

export default CourseListToolbar;