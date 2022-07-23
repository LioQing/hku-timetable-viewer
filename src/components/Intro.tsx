import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';

const Intro = () => {
  return (
    <Container style={{ padding: '0px 24px 16px 24px' }}>
      <Typography variant='body1'>
        This is a simple web app that allows you to view and plan your HKU timetable.
        <br />
        <br />
        You can upload the class timetable in .xlsx format. The class timetables are
        generally found in HKU Portal -&gt; Timetable -&gt; Class Timetable -&gt; Download Class Timetable (for XXXX-XX)
        <br />
        <br />
        You can search for a course in the course list by its course code and/or class.
        <br />
        <br />
        You can also see more detailed info by pressing the info button on the right of the course in the course list.
        <br />
        <br />
        When multiple courses have a conflicted time slot, you can hover over the time slot to see which courses are conflicted.
      </Typography>
    </Container>
  )
};

export default Intro;