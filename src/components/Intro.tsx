import { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import HelpIcon from '@mui/icons-material/Help';
import Prompt from './Prompt';

const Intro = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant='outlined'
        onClick={(_) => setOpen(true)}
        startIcon={<HelpIcon />}
        style={{ margin: '8px' }}>
        What is this website?
      </Button>
      <Prompt title='HKU Timetable Viewer' open={open} onClose={() => setOpen(false)}>
        <Typography variant='body1'>
          This is a simple web app that allows you to view and plan your HKU timetable.
          <br />
          <br />
          Start by uploading the class timetables in .xlsx format.
          Press the help button on the course list to see more info.
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
      </Prompt>
    </>
  );
};

export default Intro;