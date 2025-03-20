import { Typography } from '@mui/material';
import { Link, LinkProps } from 'react-router';

interface AppLinkProps extends LinkProps {
  hover?: boolean;
}

export const AppLink = (props: AppLinkProps) => {
  return (
    <Typography
      component={'span'}
      sx={({ palette }) => ({
        ':hover': props.hover
          ? {
              borderBottom: `1px solid ${palette.primary.main}`,
            }
          : {},
      })}
    >
      <Link
        style={{
          textDecoration: 'none',
          color: 'GrayText',
        }}
        {...props}
      />
    </Typography>
  );
};
