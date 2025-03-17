import { SyntheticEvent } from 'react';
import { NavLink, useNavigate } from 'react-router';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { Home } from '@mui/icons-material';
import { configProvider } from '../utils';

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
        border: '1px solid white',
        padding: 0.4,
        borderRadius: 4,
        overflow: 'hidden',
      }}
    >
      <BottomNavigation showLabels onChange={handleChange}>
        <BottomNavigationAction label='Home' value={appRoot} icon={<Home />}>
          <NavLink to={appRoot} end>
            Home
          </NavLink>
        </BottomNavigationAction>
        <BottomNavigationAction label='Login/Register' value={'login'} icon={<AccountCircleIcon />}>
          <NavLink to='/app/login'>Login/Register</NavLink>
        </BottomNavigationAction>
      </BottomNavigation>
    </Box>
  );
};
