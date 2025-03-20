import { SyntheticEvent } from 'react';
import { NavLink, useNavigate } from 'react-router';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { BottomNavigation, BottomNavigationAction, Box, SxProps } from '@mui/material';
import { Home } from '@mui/icons-material';
import { configProvider } from '../utils';
import { Theme } from '@emotion/react';

export const Header = () => {
  const navigate = useNavigate();
  const { appRoot } = configProvider();

  const handleChange = (event: SyntheticEvent, route: string) => {
    navigate(route);
  };

  return (
    <Box
      component='header'
      sx={{
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        zIndex: 999,
        transform: 'translateX(-50%)',
        overflow: 'hidden',
        transformOrigin: 'center center',
        transition: `transform 350ms cubic-bezier(1,-0.50,0.15,1.12)`,
        ':hover': {
          transform: 'scale(1.2) translateX(-50%)',
        },
      }}
    >
      <BottomNavigation
        showLabels
        onChange={handleChange}
        sx={{
          border: '1px solid white',
          padding: 0.4,
          borderRadius: 4,
        }}
      >
        <BottomNavigationAction label='Início' value={appRoot} icon={<Home />}>
          <NavLink to={appRoot} end />
        </BottomNavigationAction>
        <BottomNavigationAction label='Entrar' value={'login'} icon={<AccountCircleIcon />}>
          <NavLink to='/app/login' />
        </BottomNavigationAction>
      </BottomNavigation>
    </Box>
  );
};
