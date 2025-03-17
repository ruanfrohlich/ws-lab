import { SyntheticEvent } from 'react';
// import logo from '../assets/logo.jpeg';
import { NavLink, useNavigate } from 'react-router';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { Home } from '@mui/icons-material';

export const Header = () => {
  const navigate = useNavigate();

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
        <BottomNavigationAction label='Home' value={'/app'} icon={<Home />}>
          <NavLink to='/app' end>
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
