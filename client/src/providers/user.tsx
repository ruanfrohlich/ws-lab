import { ReactNode, useEffect, useReducer } from 'react';
import { IUserAction, IUserContext } from '../interfaces';
import { UserContext, UserDispatchContext } from '../contexts/user';
import Cookies from 'js-cookie';
import { userService } from '../services';
import { COOKIES } from '../utils';

const userReducer = (user: IUserContext, action: IUserAction): IUserContext => {
  switch (action.type) {
    case 'setUser': {
      if (action.payload) {
        return {
          ...user,
          ...action.payload,
        };
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
  const { fetchUser } = userService();

  useEffect(() => {
    const userToken = Cookies.get(COOKIES.userToken);

    if (!userToken) return;

    (async () => {
      const res = await fetchUser(userToken);

      if (!res) return;

      dispatch({
        type: 'setUser',
        payload: {
          logged: true,
          user: res.user,
        },
      });
    })();
  }, []);

  return (
    <UserContext value={user}>
      <UserDispatchContext value={dispatch}>{children}</UserDispatchContext>
    </UserContext>
  );
};
