import { ReactNode, useReducer } from 'react';
import { initialState, UserContext, UserDispatchContext } from 'contexts/user';
import { userReducer } from 'reducers';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext value={user}>
      <UserDispatchContext value={dispatch}>{children}</UserDispatchContext>
    </UserContext>
  );
};
