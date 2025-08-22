import axios, { isAxiosError } from 'axios';
import { useUser, useUserDispatch } from 'contexts';
import { configProvider, COOKIES, decodeJWT, translateError } from 'utils';
import { IUser, IUserDataForm, IUserRegister } from 'interfaces';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import { toLower } from 'lodash';

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

        if (user) {
          userDispatch({
            type: 'setUser',
            payload: {
              logged: true,
              user,
            },
          });

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
  ): Promise<{ success: boolean; error?: string; user?: IUser }> => {
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
          user: res.data.user,
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

  const googleSignIn = () => {
    if (window !== undefined) {
      const { google } = window;

      if (!google) return console.error('Google AuthAPI not loaded!');

      google.accounts.id.initialize({
        client_id: String(process.env.GOOGLE_CLIENT_ID),
        callback: async (res) => {
          const { email, sub, given_name, name, picture } = decodeJWT(
            res.credential,
          );
          const req = await fetch(picture);
          const imgBlob = await req.blob();

          const getImageData = () =>
            new Promise<string>((res, rej) => {
              const reader = new FileReader();
              reader.onloadend = () => res(String(reader.result));
              reader.onerror = () => rej(reader.error);
              reader.readAsDataURL(imgBlob);
            });

          const imgBase64 = await getImageData();

          console.log(imgBase64);

          const userExists = await findUser({
            username: '',
            email,
          });

          if (!userExists) {
            await registerUser({
              name,
              email,
              password: sub + given_name,
              username: toLower(`${given_name}-${sub}`),
            });
            window.location.reload();
          }
        },
        cancel_on_tap_outside: false,
      });

      google.accounts.id.prompt();
    }
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
    googleSignIn,
  };
};
