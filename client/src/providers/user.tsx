import { ReactNode, useReducer } from 'react';
import { UserContext, UserDispatchContext } from 'contexts/user';
import { userReducer } from 'reducers';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, dispatch] = useReducer(userReducer, {
    logged: false,
  });

  return (
    <UserContext value={user}>
      <UserDispatchContext value={dispatch}>{children}</UserDispatchContext>
    </UserContext>
  );
};
