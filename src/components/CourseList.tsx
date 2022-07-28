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
import Course from '../utils/Course';
import TabOptions from '../utils/TabOptions';
import { TimetableContext } from '../context/TimetableContext';

const CourseList = () => {
  const [info, setInfo] = useState<string | null>(null);
  const [filters, setFilters] = useState(new CourseListFilters(false, ''));
  const { timetable, setTimetable } = useContext(TimetableContext);

  // filter operator

  const operator: GridFilterOperator = {
    value: 'courseFilter',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      return (params: GridCellParams): boolean => {
        const { timetable, filters } = filterItem.value;

        const value = params.value as string;

        // unknow cause of bug, when currTab is removed
        // there will be a frame where the currTab is the removed tab
        // while the tab has already been removed from selected and tabOptions
        if (!timetable.selected.has(timetable.currTab)) {
          return true;
        }

        const searchMatch = value.toUpperCase().includes(filters.search.toUpperCase());
        const showSelected = filters.showSelected;

        const course = timetable.courses.get(value) as Course;
        const opt = timetable.tabOptions.get(timetable.currTab) as TabOptions;
        const selectedMatch = timetable.selected.get(timetable.currTab).includes(value);
        const semMatch = opt.sem === 0 || (course ? course.term.includes(`Sem ${opt.sem}`) : false);

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
  
  const onSelectionModelChange = (newSelected: any) => {
    // reset hidden course times
    const currSelected = timetable.selected.get(timetable.currTab)!;
    
    const removed = currSelected.filter(course => !newSelected.includes(course));
    const added: string[] = newSelected.filter((course: string) => !currSelected.includes(course));

    const currTabOpt = timetable.tabOptions.get(timetable.currTab)!;

    const newTabOpt = TabOptions.fromObject({
      ...currTabOpt,
      selectedHidden: new Map(Array.from(currTabOpt.selectedHidden)
        .filter(([course, _]) => !removed.includes(course))
        .concat(added
          .map((course: string): [string, boolean[]] => [
            course,
            Array(timetable.courses.get(course)!.times.length).fill(false),
          ])
        )
      ),
    });

    setTimetable({
      ...timetable,
      tabOptions: timetable.tabOptions.set(timetable.currTab, newTabOpt),
      selected: timetable.selected.set(timetable.currTab, newSelected)
    });
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
          selectionModel={timetable.selected.get(timetable.currTab) as string[]}
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