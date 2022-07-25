import Paper from '@mui/material/Paper';

interface Props {
  padding?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

const Panel = ({ padding, children, style }: Props) => {
  return (
    <Paper elevation={3} style={{ padding: padding ? '8px' : '0', ...style }}>
      {children}
    </Paper>
  );
};

export default Panel;