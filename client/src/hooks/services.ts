import axios, { AxiosResponse, isAxiosError } from 'axios';
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

  const fetchUser = async (token: string) => {
    try {
      const res: AxiosResponse<{ found: boolean; user: IUser }> = await handler.get(`/user/find`, {
        headers: {
          Authorization: token,
        },
      });

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

  const findUser = async (user: { username: string; email: string }): Promise<boolean> => {
    try {
      const { username, email } = user;
      const { data }: AxiosResponse<{ found: boolean }> = await handler.post('/user', {
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
      const res = await handler.post('/user/update', userData, {
        headers: {
          Authorization: Cookies.get(COOKIES.userToken),
        },
      });

      console.log(res);

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
    } catch (e) {
      console.log(e);

      return {
        success: false,
      };
    }
  };

  const registerUser = async (fields: IUserRegister): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await handler.post('/register', fields);

      if (res.status === 201) {
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
        data: { user, token },
      } = await handler.post('/login', {
        credential: credentials.username,
        password: credentials.password,
      });

      Cookies.set(COOKIES.userToken, token, {
        domain: isDev ? 'localhost' : process.env.COOKIE_DOMAIN,
        sameSite: 'None',
        path: '/',
        secure: true,
        expires: 365,
      });

      userDispatch({
        type: 'setUser',
        payload: {
          logged: true,
          user,
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
