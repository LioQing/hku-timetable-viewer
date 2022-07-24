import {
  DataGrid, GridColDef,
  GridFilterModel, GridFilterOperator, GridFilterItem, GridCellParams
} from '@mui/x-data-grid';
import { useState, useMemo } from 'react';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Course from '../utils/Course';
import CourseInfo from './CourseInfo';
import CourseListToolbar from './CourseListToolbar';

interface Props {
  timetable: Map<string, Course>;
  selected: string[];
  hovered: string | null;
  setTimetable: (timetable: Map<string, Course>) => void;
  setSelected: (selected: string[]) => void;
  setHovered: (hovered: string | null) => void;
}

const operator: GridFilterOperator = {
  value: 'courseFilter',
  getApplyFilterFn: (filterItem: GridFilterItem) => {
    return (params: GridCellParams): boolean => {
      const course = filterItem.value.timetable.get(params.value);

      const searchMatch = (params.value as string).toUpperCase().includes((filterItem.value.search as string).toUpperCase());
      const showSelected = filterItem.value.showSelected;
      const selectedMatch = filterItem.value.selected.includes(params.value);
      const semMatch = filterItem.value.sem === 0
        || (course ? course.term.includes(`Sem ${filterItem.value.sem}`) : false);

      return semMatch && searchMatch && (!showSelected || (showSelected && selectedMatch));
    };
  },
};

const CourseList = ({ timetable, selected, hovered, setTimetable, setSelected, setHovered }: Props) => {
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
          components={{ Toolbar: CourseListToolbar }}
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
              timetable: timetable,
              selected: selected,
              setTimetable: setTimetable,
              setSelected: setSelected,
              setHovered: setHovered,
            },
          }}
          rowHeight={28}
          rows={rows}
          headerHeight={32}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[8]}
          onSelectionModelChange={onSelectionModelChange}
          filterModel={filterModel}
          selectionModel={selected}
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