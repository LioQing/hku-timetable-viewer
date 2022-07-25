import Typography from '@mui/material/Typography';
import Prompt from './Prompt';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CourseListHelp = ({ open, onClose }: Props) => {
  return (
    <Prompt title='Course List Help' open={open} onClose={onClose}>
      <Typography variant='body1'>
        The 'SELECTED ONLY' button is for filtering the course list to only show the courses you have selected.
        <br />
        <br />
        The upload button is for uploading the class timetable in .xlsx format.
        It assumes the first sheet is the timetable.
        Generally, the class timetables can be found in HKU Portal -&gt; Timetable -&gt; Class Timetable -&gt; Download Class Timetable (for XXXX-XX).
        <br />
        <br />
        The uploaded .xlsx file can also contain selected courses.
        It assumes the sheet for selected coureses to be named 'Selected Courses'.
        <br />
        <br />
        The download button is for downloading the class timetable in .xlsx format.
        The downloaded file will contain both the complete class timetable and the selected courses, put in separate sheets.
        <br />
        <br />
        You can use the search bar to search for a course in the course list by its course code and/or class.
        <br />
        <br />
        You can select the semester next to the search bar using the dropdown menu.
        <br />
        <br />
        You can also see more detailed info by pressing the info button on the right of the course in the course list.
      </Typography>
    </Prompt>
  );
};

export default CourseListHelp;