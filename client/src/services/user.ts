import axios, { isAxiosError } from 'axios';
import { IUserRegister } from '../interfaces';

const handler = axios.create({
  baseURL: process.env.ACCOUNT_API,
});

export const userService = () => {
  const registerUser = async (fields: IUserRegister): Promise<{ success: boolean }> => {
    try {
      const req = await handler.post('/register', fields);

      if (req.status === 200) {
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
      } else {
        console.error(e);
      }

      return {
        success: false,
      };
    }
  };

  return {
    registerUser,
  };
};
