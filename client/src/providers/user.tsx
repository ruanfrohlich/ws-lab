import { ReactNode, useReducer } from 'react';
import { initialState, UserContext, UserDispatchContext } from 'contexts/user';
import { userReducer } from 'reducers';

/**
 * Provider de contexto para estado global do usuário
 * Fornece estado e dispatch para gerenciamento de dados do usuário autenticado
 * @param props - Propriedades do provider
 * @param props.children - Componentes filhos que terão acesso ao contexto
 */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext value={user}>
      <UserDispatchContext value={dispatch}>{children}</UserDispatchContext>
    </UserContext>
  );
};
