import { Link, LinkProps } from 'react-router';

export const AppLink = (props: LinkProps) => {
  return (
    <Link
      style={{
        textDecoration: 'none',
        color: 'GrayText',
      }}
      {...props}
    />
  );
};
