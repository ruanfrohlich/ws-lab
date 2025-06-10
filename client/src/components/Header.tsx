import { ReactNode, SyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
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
  const { pathname } = useLocation();
  const [selected, setSelected] = useState<string>();

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
    transition: 'transform 200ms ease, color 300ms ease-in-out',
    ':hover': {
      transform: 'scale(1.1)',
    },
  });

  const handleSelected = (item?: string) => {
    if (item) {
      setSelected(item);
      return;
    }

    const page = pathname.split(appRoot + '/')[1];

    if (page) setSelected(page);
    else setSelected(appRoot);
  };

  const updateActions = () => {
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
  };

  useEffect(updateActions, [logged]);

  useEffect(handleSelected, [pathname]);

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
            sx={({ palette }) => ({
              ...actionStyles,
              svg: {
                fill: action.value === selected ? palette.primary.light : 'inherit',
              },
            })}
            onClick={() => handleSelected(action.value)}
          />
        ))}
      </BottomNavigation>
    </Box>
  );
};
