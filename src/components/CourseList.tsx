import {
  DataGrid, GridColDef, GridToolbarContainer,
  GridToolbarQuickFilter, GridFilterModel, GridFilterOperator, GridFilterItem, GridCellParams
} from '@mui/x-data-grid';
import { useState, useMemo } from 'react';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import ToggleButton from '@mui/material/ToggleButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Course from '../utils/Course';
import CourseInfo from './CourseInfo';

interface CustomToolbarProps {
  showSelected: boolean;
  setShowSelected: (showSelected: boolean) => void;
}

const CustomToolbar = ({ showSelected, setShowSelected }: CustomToolbarProps) => {
  return (
    <GridToolbarContainer style={{ margin: '8px' }}>
      <ToggleButton
        value='show selected'
        selected={showSelected}
        onChange={(_) => {
          setShowSelected(!showSelected);
        }}
        style={{ marginBottom: '8px', padding: '5px 15px' }}>
        <CheckCircleIcon fontSize='small' style={{ marginRight: '4px' }} /> Show selected only
      </ToggleButton>
      <GridToolbarQuickFilter />
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

const selectedOperator: GridFilterOperator = {
  value: 'selected',
  getApplyFilterFn: (filterItem: GridFilterItem) => {
    return (params: GridCellParams): boolean => {
      if (!filterItem.value.showSelected) {
        return true;
      }

      return (filterItem.value.selected).includes(params.value as string);
    };
  },
};

const CourseList = ({ timetable, selected, hovered, setSelected, setHovered }: Props) => {
  const [info, setInfo] = useState<string | null>(null);
  const [showSelected, setShowSelected] = useState(false);

  const columns: GridColDef[] = [
    {
      field: 'course',
      headerName: 'Course',
      width: 180,
      disableColumnMenu: true,
      filterOperators: [selectedOperator],
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
        operatorValue: 'selected',
        value: { selected: selected, showSelected: showSelected },
      } as GridFilterItem],
    } as GridFilterModel;
  }, [selected, showSelected]);

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