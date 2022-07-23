import {
  DataGrid, GridColDef, GridToolbarContainer,
  GridToolbarQuickFilter
} from '@mui/x-data-grid';
import { useState } from 'react';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import InfoIcon from '@mui/icons-material/Info';
import Course from '../utils/Course';
import CourseInfo from './CourseInfo';

const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarQuickFilter />
    </GridToolbarContainer>
  );
};

interface Props {
  timetable: Map<string, Course>;
  hovered: string | null;
  setSelected: (selected: string[]) => void;
  setHovered: (hovered: string | null) => void;
}

const CourseList = ({ timetable, hovered, setSelected, setHovered }: Props) => {
   const [info, setInfo] = useState<string | null>(null);

  const columns: GridColDef[] = [
    {
      field: 'course',
      headerName: 'Course',
      width: 180,
    },
    {
      field: 'info',
      headerName: 'Info',
      width: 50,
      sortable: false,
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
            }
          }}
          rowHeight={40}
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          onSelectionModelChange={onSelectionModelChange}
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