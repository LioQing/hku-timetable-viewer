import {
  DataGrid, GridColDef,
  GridFilterModel, GridFilterOperator, GridFilterItem, GridCellParams
} from '@mui/x-data-grid';

import { useMemo, useState, useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Panel from './Panel';
import CourseListToolbar from './CourseListToolbar';
import CourseInfo from './CourseInfo';
import CourseListFilters from '../utils/CourseListFilters';
import { TimetableContext } from '../context/TimetableContext';

const CourseList = () => {
  const [info, setInfo] = useState<string | null>(null);
  const [filters, setFilters] = useState(new CourseListFilters(1, false, ''));
  const { timetable, setTimetable } = useContext(TimetableContext);

  // filter operator

  const operator: GridFilterOperator = {
    value: 'courseFilter',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      return (params: GridCellParams): boolean => {
        const { timetable, filters } = filterItem.value;

        const value = params.value as string;
        const course = timetable.courses.get(value);

        const searchMatch = value.toUpperCase().includes(filters.search.toUpperCase());
        const showSelected = filters.showSelected;
        const selectedMatch = timetable.selected.includes(value);
        const semMatch = filters.sem === 0 || (course ? course.term.includes(`Sem ${filters.sem}`) : false);

        return semMatch && searchMatch && (!showSelected || (showSelected && selectedMatch));
      };
    },
  };

  // data
  
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

  const rows = Array.from(timetable.courses.keys()).map(key => {
    return ({
      id: key,
      course: key,
    });
  });

  // hovers

  const onRowMouseEnter = (event: any) => {
    const key = (event.target as HTMLElement).innerText;
    if (!key) return;

    setTimetable({ ...timetable, hovered: key });
  };

  const onRowMouseLeave = () => {
    setTimetable({ ...timetable, hovered: null });
  };

  // models
  
  const onSelectionModelChange = (selected: any) => {
    setTimetable({ ...timetable, selected });
  };
  
  const filterModel = useMemo(() => {
    return {
      items: [{
        columnField: 'course',
        operatorValue: 'courseFilter',
        value: {
          timetable,
          filters,
        },
      } as GridFilterItem],
    } as GridFilterModel;
  }, [timetable, filters]);

  // returns

  return (
    <>
      <Panel style={{ width: '100%' }}>
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
              filters,
              setFilters,
            },
          }}
          headerHeight={32}
          rowHeight={28}
          rows={rows}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[8]}
          filterModel={filterModel}
          selectionModel={timetable.selected}
          onSelectionModelChange={onSelectionModelChange}
          sx={{
            '& .MuiDataGrid-columnHeaderCheckbox .MuiDataGrid-columnHeaderTitleContainer': {
              display: 'none',
            }
          }}
        />
      </Panel>
      <CourseInfo info={info} setInfo={setInfo} />
    </>
  );
};

export default CourseList;