import {
  Fragment,
  ReactNode,
  SyntheticEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useLocation, useNavigate } from 'react-router';
import { AccountCircle, Home, Person, Search } from '@mui/icons-material';
import {
  alpha,
  BottomNavigation,
  BottomNavigationAction,
  Box,
} from '@mui/material';
import { configProvider } from 'utils';
import { useUser } from 'contexts';
import { FindModal } from './modals';

interface IActionsState {
  label: string;
  value?: string;
  icon: ReactNode;
  onClick?: () => void;
}

/**
 * Componente de cabeçalho da aplicação com navegação adaptativa
 * Exibe diferentes opções de navegação baseado no estado de autenticação do usuário
 * @returns JSX do cabeçalho com navegação responsiva
 */
export const Header = () => {
  const navigate = useNavigate();
  const { appRoot } = configProvider();
  const { logged } = useUser();
  const { pathname } = useLocation();
  const [selected, setSelected] = useState<string>();
  const [findModal, setFindModal] = useState<boolean>(false);
  const headerRef = useRef<HTMLElement>(null);
  const [showHeader, setShowHeader] = useState<boolean>(false);

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

  /**
   * Manipula mudanças de rota na navegação
   * @param event - Evento sintético do React
   * @param route - Rota de destino
   */
  const handleChange = (event: SyntheticEvent, route: string) => {
    navigate(route);
  };

  /**
   * Gerencia seleção de item ativo na navegação
   * @param item - Item a ser selecionado (opcional)
   * @param cb - Callback adicional a ser executado (opcional)
   */
  const handleSelected = (item?: string, cb?: () => void) => {
    if (item) {
      setSelected(item);
      return;
    }

    const page = pathname.split(appRoot + '/')[1];

    if (page) setSelected(page);
    else setSelected(appRoot);

    if (cb) cb();
  };

  /**
   * Atualiza as ações disponíveis baseado no estado de autenticação
   * Adiciona opções de perfil e pesquisa para usuários logados
   */
  const updateActions = () => {
    if (logged) {
      setActions((actions) => {
        return [
          ...actions.filter(
            (el) => el.value !== 'join' && el.value !== 'account',
          ),
          {
            label: 'Meu Perfil',
            value: 'account',
            icon: <Person />,
          },
          {
            label: 'Pequisar',
            icon: <Search />,
            onClick: () => setFindModal(true),
          },
        ];
      });
    } else {
      setActions(initialActions);
    }
  };

  useEffect(updateActions, [logged]);

  useEffect(handleSelected, [pathname]);

  useEffect(() => {
    const { current } = headerRef;

    if (current) {
      current.addEventListener('mouseenter', () => setShowHeader(true));
      current.addEventListener('mouseleave', () => setShowHeader(false));
    }
  }, [headerRef]);

  return (
    <Fragment>
      {findModal && <FindModal onClose={() => setFindModal(false)} />}
      <Box
        component='header'
        ref={headerRef}
        sx={{
          position: 'fixed',
          bottom: showHeader ? '-240px' : '-266px',
          left: '50%',
          zIndex: 999,
          transform: 'translateX(-50%)',
          overflow: 'hidden',
          transition: 'bottom 250ms ease-in-out',
          minHeight: '300px',
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
              sx={({ palette: { primary, secondary } }) => ({
                color:
                  action.value === selected ? secondary.main : primary.main,
                svg: {
                  fill:
                    action.value === selected ? secondary.main : primary.main,
                },
                ':hover': {
                  span: {
                    transition: 'color 250ms ease-in-out',
                    color: alpha(secondary.main, 0.8),
                  },
                },
                flex: '1 1 auto',
              })}
              onClick={() => handleSelected(action.value, action.onClick)}
            />
          ))}
        </BottomNavigation>
      </Box>
    </Fragment>
  );
};
