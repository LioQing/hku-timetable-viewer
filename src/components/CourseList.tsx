import {
  DataGrid, GridColDef,
  GridFilterModel, GridFilterOperator, GridFilterItem, GridCellParams
} from '@mui/x-data-grid';

import { useMemo, useState, useContext } from 'react';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import InfoIcon from '@mui/icons-material/Info';
import Panel from './Panel';
import CourseListToolbar from './CourseListToolbar';
import CourseInfo from './CourseInfo';
import CourseListFilters, { SearchBy } from '../utils/CourseListFilters';
import Course from '../utils/Course';
import TabOptions from '../utils/TabOptions';
import { Timetable, TimetableContext } from '../context/TimetableContext';
import { Typography } from '@mui/material';

const CourseList = () => {
  const [info, setInfo] = useState<string | null>(null);
  const [filters, setFilters] = useState(new CourseListFilters(false, '', SearchBy.Code));
  const { timetable, setTimetable } = useContext(TimetableContext);

  // filter operator

  const operator: GridFilterOperator = {
    value: 'courseFilter',
    getApplyFilterFn: (filterItem: GridFilterItem) => {
      return (params: GridCellParams): boolean => {
        interface FilterItemValue { timetable: Timetable, filters: CourseListFilters }
        const { timetable, filters }: FilterItemValue = filterItem.value;

        const value = params.value as string;
        const course = timetable.courses.get(value) as Course;
        const courseTitle = course.courseTitle;

        // unknow cause of bug, when currTab is removed
        // there will be a frame where the currTab is the removed tab
        // while the tab has already been removed from selected and tabOptions
        if (!timetable.selected.has(timetable.currTab)) {
          return true;
        }

        const opt = timetable.tabOptions.get(timetable.currTab) as TabOptions;
        if (!(opt.sem === 0 || (course ? course.term.includes(`Sem ${opt.sem}`) : false))) {
          return false;
        }

        const showSelected = filters.showSelected;
        const selectedMatch = timetable.selected.get(timetable.currTab)!.includes(value);

        if (!(!showSelected || (showSelected && selectedMatch))) {
          return false;
        }

        return true;
      };
    },
  };

  // data
  
  const columns: GridColDef[] = [
    {
      field: 'course',
      headerName: 'Course',
      flex: 1,
      disableColumnMenu: true,
      filterOperators: [operator],
      renderCell: (params) => {
        const maybeCourse = timetable.courses.get(params.id.toString());
        if (!maybeCourse) {
          console.error(`Course ${params.value} not found`);
          return null;
        }

        const course = maybeCourse as Course;

        return (
          <Container
            className='course-key'
            id={params.id.toString()}
            style={{
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'start',
            }}>
            <Typography variant='body2' lineHeight={1}>
              {params.id.toString()}
            </Typography>
            <Typography variant='caption' lineHeight={1}>
              {course.courseTitle}
            </Typography>
          </Container>
        );
      }
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
            <InfoIcon className='course-key' id={params.id.toString()} style={{ fontSize: '1.5rem' }} />
          </IconButton>
        );
      }
    },
  ];

  // for optimization
  const rows = useMemo(() => {
    const regexp = (() => {
      try {
        return RegExp(filters.search, 'i');
      } catch (e) {
        return null;
      }
    })();

    return Array
      .from(timetable.courses.entries())
      .filter(([_, course]) => {
        if (regexp) {
          return (filters.searchBy === SearchBy.Code && regexp.test(course.courseCode))
            || (filters.searchBy === SearchBy.Title && regexp.test(course.courseTitle));
        } else {
          return (filters.searchBy === SearchBy.Code && course.courseCode.includes(filters.search))
            || (filters.searchBy === SearchBy.Title && course.courseTitle.includes(filters.search));
        }
      })
      .map(([key, _]) => {
        return ({
          id: key,
          course: key,
        });
      });
  }, [filters.search, filters.searchBy, timetable.courses]);

  // hovers

  const onRowMouseEnter = (e: any) => {
    const key = (e.target as HTMLElement).getElementsByClassName('course-key')[0]?.id;
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
          rowHeight={36}
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