import axios, { isAxiosError } from 'axios';
import { useUser, useUserDispatch } from 'contexts';
import { configProvider, COOKIES, randomPassword, translateError } from 'utils';
import { IAccountSearch, IUser, IUserDataForm, IUserRegister } from 'interfaces';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import { googleAuth } from 'integrations';
import { omit, toLower } from 'lodash';

const handler = axios.create({
  baseURL: process.env.ACCOUNT_API,
});

/**
 * Hook customizado para serviços de autenticação e gerenciamento de usuário
 * Fornece métodos para login, registro, busca e atualização de usuários
 * @returns Objeto contendo todos os métodos de serviço disponíveis
 */
export const useServices = () => {
  const { user } = useUser();
  const userDispatch = useUserDispatch();
  const { isDev, appRoot } = configProvider();
  const nav = useNavigate();
  const hasAuthCookie = !!Cookies.get(COOKIES.userToken);
  const { startGoogleSignIn } = googleAuth();

  /**
   * Cria cookie de autenticação para o usuário
   * @param uuid - UUID único do usuário autenticado
   */
  const createAuthCookie = (uuid: string) => {
    Cookies.set(COOKIES.userToken, uuid, {
      domain: isDev ? 'localhost' : process.env.COOKIE_DOMAIN,
      sameSite: 'None',
      path: '/',
      secure: true,
      expires: 365,
    });
  };

  /**
   * Busca dados do usuário pela API usando token de autenticação
   * @param token - Token/UUID de autenticação do usuário
   * @returns Resultado da operação com flag de sucesso
   */
  const fetchUser = async (token: string) => {
    try {
      const res = await handler.get<{ found: boolean; user: IUser }>(`/user/find`, {
        headers: {
          Authorization: token,
        },
      });

      if (res.status === 200) {
        const { user } = res.data;

        userDispatch({
          type: 'setUser',
          payload: {
            logged: true,
            user,
          },
        });

        if (user) {
          return {
            success: true,
          };
        }

        return {
          success: false,
        };
      }

      return {
        success: false,
      };
    } catch (e) {
      console.log(e);

      return {
        success: false,
      };
    }
  };

  /**
   * Verifica se um usuário existe por username ou email
   * @param user - Dados do usuário para busca
   * @returns Resultado indicando se o usuário foi encontrado e seu UUID
   */
  const findUser = async (user: { username?: string; email?: string }) => {
    try {
      const { data } = await handler.get<{ found: boolean; uuid?: string }>(
        `/user?username=${user.username}&email=${user.email}`,
      );

      return data;
    } catch (e) {
      console.log(e);

      return {
        found: false,
      };
    }
  };

  /**
   * Atualiza dados do usuário autenticado
   * @param userData - Novos dados do usuário
   * @returns Resultado da operação de atualização
   */
  const updateUser = async (userData: IUserDataForm['fields']) => {
    try {
      const { data } = await handler.post<{
        success: boolean;
        message: string;
        newAssets?: {
          profilePic: string;
          coverImage: string;
        };
      }>('/user/update', userData, {
        headers: {
          Authorization: Cookies.get(COOKIES.userToken),
        },
      });

      if (data.success && user) {
        userDispatch({
          type: 'setUser',
          payload: {
            logged: true,
            user: {
              ...user,
              profilePic: data.newAssets?.profilePic ?? user.profilePic,
              coverImage: data.newAssets?.coverImage ?? user.coverImage,
            },
          },
        });

        return {
          success: true,
        };
      }

      return {
        success: false,
      };
    } catch (e) {
      console.log(e);

      return {
        success: false,
      };
    }
  };

  /**
   * Registra um novo usuário no sistema
   * @param fields - Dados de registro do usuário
   * @param google - Dados adicionais para registro via Google (opcional)
   * @returns Resultado da operação de registro
   */
  const registerUser = async (
    fields: IUserRegister,
    social?: {
      image: string;
      provider: string;
      token: string;
    },
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await handler.post<{ user: IUser }>('/register', { fields, social });

      if (res.status === 201) {
        const { uuid } = res.data.user;
        createAuthCookie(uuid);

        userDispatch({
          type: 'setUser',
          payload: {
            logged: true,
            user: res.data.user,
          },
        });

        return {
          success: true,
        };
      }

      return {
        success: false,
      };
    } catch (e) {
      if (isAxiosError(e)) {
        return {
          success: false,
          error: translateError(e.response?.data.message),
        };
      } else {
        console.error(e);
      }

      return {
        success: false,
      };
    }
  };

  const searchAccount = async (term: string) => {
    const { data } = await handler.get<IAccountSearch>(`/accounts/search?term=${term}`, {
      headers: {
        Authorization: Cookies.get(COOKIES.userToken),
      },
    });
    return data;
  };

  /**
   * Realiza login do usuário com credenciais
   * @param credentials - Credenciais de login (username e password)
   * @returns Resultado da operação de login
   */
  const login = async (credentials: { username: string; password: string }) => {
    try {
      const {
        data: { uuid },
      } = await handler.post<{ uuid: string }>('/login', {
        credential: credentials.username,
        password: credentials.password,
      });

      if (!uuid) {
        return {
          success: false,
        };
      }

      const { success } = await fetchUser(uuid);

      if (!success) {
        return {
          success: false,
        };
      }

      createAuthCookie(uuid);
      nav(appRoot);

      return {
        success: true,
      };
    } catch (e) {
      console.error(e);

      return {
        success: false,
      };
    }
  };

  /**
   * Realiza logout do usuário, removendo cookies e limpando estado
   */
  const logout = () => {
    Cookies.remove(COOKIES.userToken);
    userDispatch({
      type: 'setUser',
      payload: {
        logged: false,
        user: null,
      },
    });
    nav(appRoot);
  };

  /**
   * Realiza autenticação via Google OAuth
   * Registra ou faz login do usuário baseado nos dados do Google
   */
  const googleSignIn = async () => {
    const googleUser = await startGoogleSignIn();

    if (!googleUser) return;

    const userFormatted = {
      email: googleUser.email,
      name: googleUser.name,
      password: randomPassword(8),
      username: toLower(`${googleUser.given_name}-${googleUser.sub.slice(0, 6)}`),
    };

    const {
      data: { socialAccount },
    } = await handler.get<{
      socialAccount: {
        id: number;
        provider: string;
        user: IUser;
      };
    }>(`/user/social`, {
      params: {
        token: googleUser.sub,
      },
    });

    console.log(socialAccount);

    if (socialAccount && socialAccount.user) {
      createAuthCookie(socialAccount.user.uuid);
      return userDispatch({
        type: 'setUser',
        payload: {
          logged: true,
          user: socialAccount.user,
        },
      });
    }

    const { success, error } = await registerUser(userFormatted, {
      image: googleUser.picture,
      provider: 'google',
      token: googleUser.sub,
    });

    if (!success && error) {
      userDispatch({
        type: 'setError',
        payload: {
          errors: [error],
        },
      });
    }
  };

  /**
   * Redireciona o usuário para a página inicial
   */
  const redirectHome = () => {
    nav(appRoot);
  };

  return {
    fetchUser,
    findUser,
    updateUser,
    registerUser,
    login,
    logout,
    redirectHome,
    hasAuthCookie,
    googleSignIn,
    searchAccount,
  };
};
