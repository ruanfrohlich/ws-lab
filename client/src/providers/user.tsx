import { ReactNode, useEffect, useReducer } from 'react';
import { UserContext, UserDispatchContext } from 'contexts/user';
import Cookies from 'js-cookie';
import { COOKIES } from 'utils';
import { useServices } from 'hooks';
import { userReducer } from 'reducers';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, dispatch] = useReducer(userReducer, {
    logged: false,
  });

  const { fetchUser, googleSignIn, logout } = useServices();

  const checkUser = () => {
    try {
      const userToken = Cookies.get(COOKIES.userToken);

      if (!userToken) return googleSignIn();

      fetchUser(userToken).then((res) => {
        if (!res.success) logout();
      });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(checkUser, []);

  return (
    <UserContext value={user}>
      <UserDispatchContext value={dispatch}>{children}</UserDispatchContext>
    </UserContext>
  );
};
