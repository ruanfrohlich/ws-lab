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
  const { logged } = useUser();
  let times = 0;

  const initialActions = [
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
  ];

  const [actions, setActions] = useState<IActionsState[]>(initialActions);

  const handleChange = (event: SyntheticEvent, route: string) => {
    navigate(route);
  };

  const actionStyles = () => ({
    transition: 'transform 200ms ease',
    ':hover': {
      transform: 'scale(1.1)',
    },
  });

  const updateActions = () => {
    times++;

    if (logged) {
      setActions((actions) => {
        return [
          ...actions.filter((el) => el.value !== 'join' && el.value !== 'account'),
          {
            label: 'Meu Perfil',
            value: 'account',
            icon: <Person />,
          },
        ];
      });
    } else {
      setActions(initialActions);
    }

    console.log('chamou o logged %d vezes', times, logged);
  };

  useEffect(updateActions, [logged]);

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
