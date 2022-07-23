import {
  DataGrid, GridColDef, GridToolbarContainer,
  GridFilterModel, GridFilterOperator, GridFilterItem, GridCellParams
} from '@mui/x-data-grid';
import { useState, useMemo } from 'react';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SearchIcon from '@mui/icons-material/Search';
import InfoIcon from '@mui/icons-material/Info';
import ToggleButton from '@mui/material/ToggleButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Course from '../utils/Course';
import CourseInfo from './CourseInfo';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

interface CustomToolbarProps {
  showSelected: boolean;
  setShowSelected: (showSelected: boolean) => void;
  setSearch: (search: string) => void;
  sem: number;
  setSem: (sem: number) => void;
}

const CustomToolbar = ({ showSelected, setShowSelected, setSearch, sem, setSem }: CustomToolbarProps) => {
  return (
    <GridToolbarContainer style={{ margin: '8px' }}>
      <Box sx={{ display: 'flex', orientation: 'horizontal', alignItems: 'center' }}>
        <ToggleButton
          value='show selected'
          selected={showSelected}
          onChange={(_) => {
            setShowSelected(!showSelected);
          }}
          style={{ marginBottom: '8px', padding: '5px 15px' }}>
          <CheckCircleIcon fontSize='small' style={{ marginRight: '4px' }} />
          <Typography variant='caption'>Selected only</Typography>
        </ToggleButton>
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

interface Props {
  timetable: Map<string, Course>;
  selected: string[];
  hovered: string | null;
  setSelected: (selected: string[]) => void;
  setHovered: (hovered: string | null) => void;
}

const operator: GridFilterOperator = {
  value: 'courseFilter',
  getApplyFilterFn: (filterItem: GridFilterItem) => {
    return (params: GridCellParams): boolean => {
      const searchMatch = params.value.includes(filterItem.value.search);
      const showSelected = filterItem.value.showSelected;
      const selectedMatch = filterItem.value.selected.includes(params.value);
      const semMatch = filterItem.value.sem === 0
        || filterItem.value.timetable.get(params.value).term.includes(`Sem ${filterItem.value.sem}`);

      return semMatch && searchMatch && (!showSelected || (showSelected && selectedMatch));
    };
  },
};

const CourseList = ({ timetable, selected, hovered, setSelected, setHovered }: Props) => {
  const [info, setInfo] = useState<string | null>(null);
  const [showSelected, setShowSelected] = useState(false);
  const [search, setSearch] = useState('');
  const [sem, setSem] = useState(1);

  const columns: GridColDef[] = [
    {
      field: 'course',
      headerName: 'Course',
      width: 180,
      disableColumnMenu: true,
      filterOperators: [operator],
    },
    {
      field: 'info',
      headerName: 'Info',
      width: 50,
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const onClick = (event: any) => {
          event.stopPropagation();
          setInfo(params.id.toString());
        };
  
        return (
          <IconButton onClick={onClick}>
            <InfoIcon style={{ fontSize: '1.5rem' }} />
          </IconButton>
        );
      }
    },
  ];

  const rows = Array
    .from(timetable)
    .map(([no, course]) => {
      return ({
        id: no,
        course: `${course.courseCode}-${course.classSection}`,
      });
    });

  const onSelectionModelChange = (selected: any) => {
    setSelected(selected);
  };

  const onRowMouseEnter = (event: any) => {
    const no = (event.target as HTMLElement).innerText;
    if (!no) {
      return;
    }

    setHovered(no);
  };

  const onRowMouseLeave = (_: any) => {
    setHovered(null);
  };

  const filterModel = useMemo(() => {
    return {
      items: [{
        columnField: 'course',
        operatorValue: 'courseFilter',
        value: {
          timetable: timetable,
          selected: selected,
          showSelected: showSelected,
          search: search,
          sem: sem,
        },
      } as GridFilterItem],
    } as GridFilterModel;
  }, [timetable, selected, showSelected, search, sem]);

  return (
    <>
      <Paper elevation={3} style={{ padding: 0, width: '100%' }}>
        <DataGrid
          autoHeight
          checkboxSelection
          disableColumnFilter
          disableColumnSelector
          disableDensitySelector
          components={{ Toolbar: CustomToolbar }}
          componentsProps={{
            cell: {
              onMouseEnter: onRowMouseEnter,
              onMouseLeave: onRowMouseLeave,
            },
            toolbar: {
              showSelected: showSelected,
              setShowSelected: setShowSelected,
              setSearch: setSearch,
              sem: sem,
              setSem: setSem,
            },
          }}
          rowHeight={40}
          rows={rows}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[8]}
          onSelectionModelChange={onSelectionModelChange}
          filterModel={filterModel}
          sx={{
            '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
              display: 'none',
            }
          }}
        />
      </Paper>
      <CourseInfo
        course={info === null ? undefined : timetable.get(info as string)}
        open={info !== null}
        onClose={() => setInfo(null)}
      />
    </>
  );
};

export default CourseList;