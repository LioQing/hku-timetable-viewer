import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Intro from './Intro';

interface Props {
  open: boolean;
  onClose: () => void;
}

const IntroDialog = ({ open, onClose }: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        HKU Timetable Viewer
      </DialogTitle>
      <Intro />
    </Dialog>
  );
};

export default IntroDialog;