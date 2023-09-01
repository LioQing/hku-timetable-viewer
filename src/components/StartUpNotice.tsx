import { useState } from 'react';
import Prompt from './Prompt';

interface Props {
  children?: React.ReactElement;
}

const StartUpNotice = ({ children }: Props) => {
  const [open, setOpen] = useState(true);

  return (
    <Prompt title='Notice' open={open} onClose={() => setOpen(false)}>
      {children}
    </Prompt>
  );
};

export default StartUpNotice;