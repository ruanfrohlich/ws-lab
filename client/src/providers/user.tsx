import { ReactNode, useReducer } from 'react';
import { IUserAction, IUserContext } from '../interfaces';
import { UserContext, UserDispatchContext } from '../contexts/user';

const userReducer = (user: IUserContext, action: IUserAction): IUserContext => {
  switch (action.type) {
    case 'setUser': {
      if (action.payload) {
        return action.payload;
      }

      return user;
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
};

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
