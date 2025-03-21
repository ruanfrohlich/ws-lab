import { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router';
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

  const actionStyles = () => ({
    transition: 'transform 200ms ease',
    ':hover': {
      transform: 'scale(1.1)',
    },
  });

  const actions = [
    {
      label: 'Início',
      value: appRoot,
      icon: <Home />,
    },
    {
      label: 'Entrar',
      value: 'join',
      icon: <AccountCircleIcon />,
    },
  ];

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
        {actions.map((action) => (
          <BottomNavigationAction
            key={action.label}
            label={action.label}
            value={action.value}
            icon={action.icon}
            sx={actionStyles}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};
