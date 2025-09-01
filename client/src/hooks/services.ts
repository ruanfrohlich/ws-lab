import axios, { isAxiosError } from 'axios';
import { useUser, useUserDispatch } from 'contexts';
import { configProvider, COOKIES, randomPassword, translateError } from 'utils';
import { IUser, IUserDataForm, IUserRegister } from 'interfaces';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import { googleAuth } from 'integrations';
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
  const { startGoogleSignIn } = googleAuth();

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

  const findUser = async (user: { username?: string; email?: string }) => {
    try {
      const { data } = await handler.post<{ found: boolean; uuid?: string }>(
        '/user',
        {
          username: user.username ?? '',
          email: user.email ?? '',
        },
      );

      return data;
    } catch (e) {
      console.log(e);

      return {
        found: false,
      };
    }
  };

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

  const registerUser = async (
    fields: IUserRegister,
    google?: {
      image: string;
    },
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await handler.post<{ user: IUser }>('/register', fields);

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

        if (google) {
          await updateUser({
            ...res.data.user,
            profilePic: google.image,
          });
        }

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

  const googleSignIn = async () => {
    const googleUser = await startGoogleSignIn();

    if (!googleUser) return;

    const userFormatted = {
      email: googleUser.email,
      name: googleUser.name,
      password: randomPassword(8),
      username: toLower(
        `${googleUser.given_name}-${googleUser.sub.slice(0, 6)}`,
      ),
    };

    const { found: userExists, uuid } = await findUser({
      email: userFormatted.email,
    });

    if (userExists && uuid) {
      createAuthCookie(uuid);
      return await fetchUser(uuid);
    }

    const { success, error } = await registerUser(userFormatted, {
      image: googleUser.picture,
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
