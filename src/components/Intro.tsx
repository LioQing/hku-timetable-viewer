import { useState } from 'react';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import HelpIcon from '@mui/icons-material/Help';
import GitHubIcon from '@mui/icons-material/GitHub';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BugReportIcon from '@mui/icons-material/BugReport';
import Prompt from './Prompt';
import packageJson from '../../package.json';
import Box from '@mui/material/Box';

const Intro = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant='outlined'
        onClick={(_) => setOpen(true)}
        startIcon={<HelpIcon />}
        style={{ margin: '8px' }}>
        About This App
      </Button>
      <Prompt title={`HKU Timetable Viewer v${packageJson.version}`} open={open} onClose={() => setOpen(false)}>
        <Typography variant='body1'>
          This is a simple web app that allows you to view and plan your HKU timetable.
          <br />
          <br />
          <strong>Getting Started</strong><br />
          Start by uploading the class timetables in .xlsx format.
          Press the help button on the course list to see more info.
          <br />
          <br />
          <strong>Tab View</strong><br />
          You can open multiple tabs, where the selected courses will be stored within that tab to make planning for multiple sems or backup plans easier.
          Double click the tab to rename.
          <br />
          <br />
          <strong>Time Slots</strong><br />
          Time slot will show whether the selected courses in the time is good, or overlapped, or conflicted.
          <br />
          <br />
          <strong>Time Slot Details</strong><br />
          You can click on the time slot when it has selected courses.
          It will show you the courses in that time slot, and the conflicts if any.
          <br />
          <br />
          <strong>Bugs and Feedbacks</strong><br />
          Please report any bug, or provide feedback to me at the GitHub repo. The button below links to the repo page.
        </Typography>
        <Button
          href='https://github.com/LioQing/hku-timetable-viewer'
          variant='outlined'
          target='_blank'
          startIcon={<GitHubIcon />}
          style={{ marginTop: '16px' }}>
          Source Code
        </Button>
        <Box width='8px' style={{ display: 'inline-block' }} />
        <Button
          href='https://github.com/LioQing/hku-timetable-viewer/blob/master/CHANGELOG.md'
          variant='outlined'
          target='_blank'
          startIcon={<AccessTimeIcon />}
          style={{ marginTop: '16px' }}>
          Changelog
        </Button>
        <Box width='8px' style={{ display: 'inline-block' }} />
        <Button
          href='https://github.com/LioQing/hku-timetable-viewer/issues/new'
          variant='outlined'
          target='_blank'
          startIcon={<BugReportIcon />}
          style={{ marginTop: '16px' }}>
          Report Issue
        </Button>
      </Prompt>
    </>
  );
};

export default Intro;