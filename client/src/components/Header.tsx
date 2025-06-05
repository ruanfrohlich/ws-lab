import { ReactNode, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { AccountCircle, Home, Person } from '@mui/icons-material';
import { BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import { configProvider } from '../utils';
import { useUser } from '../contexts';

interface IActionsState {
  label: string;
  value: string;
  icon: ReactNode;
}

export const Header = () => {
  const navigate = useNavigate();
  const { appRoot } = configProvider();
  const { logged, user } = useUser();
  const [actions, setActions] = useState<IActionsState[]>([
    {
      label: 'Início',
      value: appRoot,
      icon: <Home />,
    },
    {
      label: 'Entrar',
      value: 'join',
      icon: <AccountCircle />,
    },
  ]);

  const handleChange = (event: SyntheticEvent, route: string) => {
    navigate(route);
  };

  const actionStyles = () => ({
    transition: 'transform 200ms ease',
    ':hover': {
      transform: 'scale(1.1)',
    },
  });

  useEffect(() => {
    if (logged && user) {
      setActions((actions) => {
        return [
          ...actions.filter((el) => el.value !== 'join'),
          {
            label: 'Minha Conta',
            value: 'account',
            icon: <Person />,
          },
        ];
      });
    }
  }, [logged]);

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
