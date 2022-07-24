import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

const Intro = () => {
  return (
    <Container style={{ padding: '0px 24px 16px 24px' }}>
      <Typography variant='body1'>
        This is a simple web app that allows you to view and plan your HKU timetable.
        <br />
        <br />
        When multiple courses have a conflicted time slot, you can hover over the time slot to see which courses are conflicted.
        <br />
        <br />
        You can select the hour range and days you want to view in the timetable at panel below the course list.
        <br />
        <br />
        Please report any bug, or provide feedback to me at the GitHub repo. The button below links to the repo page.
      </Typography>
      <Button
        href='https://github.com/LioQing/hku-timetable-viewer'
        variant='outlined'
        style={{ marginTop: '16px' }}>
        Source Code on GitHub
      </Button>
    </Container>
  )
};

export default Intro;