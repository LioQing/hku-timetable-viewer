import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Container from '@mui/material/Container';

interface Props {
  title: string;
  open: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Prompt = ({ title, open, onClose, children, style }: Props) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <Container style={{ ...style, padding: '0px 24px 16px 24px' }}>
        {children}
      </Container>
    </Dialog>
  );
};

export default Prompt;