import axios, { AxiosResponse, isAxiosError } from 'axios';
import { IUser, IUserDataForm, IUserRegister } from '../interfaces';
import { configProvider, COOKIES, translateError } from '../utils';
import Cookies from 'js-cookie';

const handler = axios.create({
  baseURL: process.env.ACCOUNT_API,
});

export const userService = () => {
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
    console.log(userData);

    try {
      const res = await handler.post('/user/update', userData, {
        headers: {
          Authorization: Cookies.get(COOKIES.userToken),
        },
      });

      console.log(res);

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

  const login = async (credentials: {
    username: string;
    password: string;
  }): Promise<{ logged: boolean; user?: IUser; token?: string }> => {
    const { isDev } = configProvider();

    try {
      const { data } = await handler.post('/login', {
        credential: credentials.username,
        password: credentials.password,
      });

      Cookies.set(COOKIES.userToken, data.token, {
        domain: isDev ? 'localhost' : process.env.COOKIE_DOMAIN,
        sameSite: 'None',
        path: '/',
        secure: true,
        expires: 365,
      });

      return {
        logged: true,
        user: data.user,
        token: data.token,
      };
    } catch (e) {
      console.error(e);

      return {
        logged: false,
      };
    }
  };

  const logout = async () => {
    Cookies.remove(COOKIES.userToken);
  };

  return {
    fetchUser,
    findUser,
    registerUser,
    updateUser,
    login,
    logout,
  };
};
