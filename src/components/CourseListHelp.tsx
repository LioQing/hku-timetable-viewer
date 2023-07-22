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
        <strong>Upload/Download</strong><br />
        The upload button is for uploading the class timetable in .xlsx format.
        It assumes the first sheet is the timetable.
        Generally, the class timetables can be found in HKU Portal -&gt; Timetable -&gt; Class Timetable -&gt; Download Class Timetable (for XXXX-XX).
        Or click <a href='https://intraweb.hku.hk/reserved_1/sis_student/sis/SIS-class-timetable.html' target='_blank' rel='noreferrer'>here</a> to go to the page directly.
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
        <strong>Filtering</strong><br />
        The 'SELECTED ONLY' button is for filtering the course list to only show the courses you have selected.
        <br />
        <br />
        The search bar and sem dropdown menu can be used to search for courses by the code and the class and filter the semester respectively.
        <br />
        <br />
        <strong>Course Info</strong><br />
        The info button next to the courses can be clicked to see more detail of the course,
        including the title, instructor, offering department, exact timeslots, venues.
      </Typography>
    </Prompt>
  );
};

export default CourseListHelp;