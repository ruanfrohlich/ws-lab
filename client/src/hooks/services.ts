import axios, { isAxiosError } from 'axios';
import { useUser, useUserDispatch } from '../contexts';
import { configProvider, COOKIES, translateError } from '../utils';
import { IUser, IUserDataForm, IUserRegister } from '../interfaces';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';

const handler = axios.create({
  baseURL: process.env.ACCOUNT_API,
});

export const useServices = () => {
  const { user } = useUser();
  const userDispatch = useUserDispatch();
  const { isDev, appRoot } = configProvider();
  const nav = useNavigate();
  const hasAuthCookie = !!Cookies.get(COOKIES.userToken);

  const createAuthCookie = (uuid: string) => {
    Cookies.set(COOKIES.userToken, uuid, {
      domain: isDev ? 'localhost' : process.env.COOKIE_DOMAIN,
      sameSite: 'None',
      path: '/',
      secure: true,
      expires: 365,
    });
  };

  const fetchUser = async (token: string) => {
    try {
      const res = await handler.get<{ found: boolean; user: IUser }>(
        `/user/find`,
        {
          headers: {
            Authorization: token,
          },
        },
      );

      if (res.status === 200) {
        const { user } = res.data;

        return {
          user,
        };
      }

      return null;
    } catch (e) {
      console.log(e);

      return null;
    }
  };

  const findUser = async (user: {
    username: string;
    email: string;
  }): Promise<boolean> => {
    try {
      const { username, email } = user;
      const { data } = await handler.post<{ found: boolean }>('/user', {
        username,
        email,
      });

      if (data.found) {
        return true;
      }

      return false;
    } catch (e) {
      console.log(e);

      return false;
    }
  };

  const updateUser = async (userData: IUserDataForm['fields']) => {
    try {
      const { data } = await handler.post<{
        success: boolean;
        message: string;
      }>('/user/update', userData, {
        headers: {
          Authorization: Cookies.get(COOKIES.userToken),
        },
      });

      console.log(data);

      if (data.success) {
        userDispatch({
          type: 'setUser',
          payload: {
            logged: true,
            user: {
              ...user,
              ...(userData as IUser),
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

  const registerUser = async (
    fields: IUserRegister,
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await handler.post<{ user: IUser }>('/register', fields);

      if (res.status === 201) {
        createAuthCookie(res.data.user.uuid);
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
        console.error(e.response?.data);

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

      const res = await fetchUser(uuid);

      if (!res?.user) {
        return {
          success: false,
        };
      }

      createAuthCookie(uuid);
      userDispatch({
        type: 'setUser',
        payload: {
          logged: true,
          user: res?.user,
        },
      });

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
  };
};
