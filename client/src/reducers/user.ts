import { IFriends, IUserAction, IUserContext } from 'interfaces';

export const userReducer = (
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
    case 'setError': {
      return {
        ...state,
        errors: action.payload?.errors,
      };
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
};
