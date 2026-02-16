import {
  IFriends,
  IUserAction,
  IUserContext,
  TFriendActivityStatus,
} from 'interfaces';

/**
 * Reducer para gerenciamento do estado global do usuário
 * Manipula ações de login, logout, atualização de amigos e erros
 * @param state - Estado atual do contexto do usuário
 * @param action - Ação a ser processada
 * @returns Novo estado do contexto do usuário
 */
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

      console.log('Atualizando status amigo');

      if (user) {
        const updatedFriends = user.friends.reduce(
          (acc: IFriends[], curr: IFriends) => {
            if (curr.user.id === action.payload?.id) {
              acc.push({
                ...curr,
                activityStatus: action.payload?.status || 'offline',
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
