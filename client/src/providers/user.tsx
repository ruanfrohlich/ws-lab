import { ReactNode, useEffect, useReducer } from 'react';
import { IFriends, IUserAction, IUserContext } from 'interfaces';
import { UserContext, UserDispatchContext } from 'contexts/user';
import Cookies from 'js-cookie';
import { COOKIES } from 'utils';
import { useServices } from 'hooks';

const userReducer = (
  state: IUserContext,
  action: IUserAction,
): IUserContext => {
  switch (action.type) {
    case 'setUser': {
      if (action.payload) {
        return {
          ...state,
          ...action.payload,
        };
      }

      return state;
    }
    case 'updateFriendActivity': {
      const { user } = state;

      if (user) {
        const updatedFriends = user.friends.reduce(
          (acc: IFriends[], curr: IFriends) => {
            if (curr.user.uuid === action.payload?.uuid) {
              acc.push({
                ...curr,
                activityStatus: 'online',
              });
            } else {
              acc.push(curr);
            }

            return acc;
          },
          [],
        );

        return {
          ...state,
          user: {
            ...user,
            friends: updatedFriends,
          },
        };
      }

      return state;
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
  const { fetchUser } = useServices();

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
