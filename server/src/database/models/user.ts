import { QueryTypes, Sequelize } from 'sequelize';
import { IUser, ModelTypes } from '../types';
import { IDBUser } from '../../interfaces';
import { log } from '../../utils';
import { first, isEmpty } from 'lodash';

export const User = (sequelize: Sequelize) => {
  const User = sequelize.define('User', ModelTypes.User);

  const getUser = async (data: Omit<IDBUser, 'password'>): Promise<IDBUser | null> => {
    try {
      const query = await sequelize.query(
        `SELECT * FROM User WHERE username="${data.username}" OR email="${data.email}"`,
        {
          type: QueryTypes.SELECT,
        },
      );

      if (isEmpty(query)) {
        return null;
      }

      return first(query) as unknown as IDBUser;
    } catch (e) {
      console.log(e);

      return null;
    }
  };

  const createUser = async (userData: IDBUser) => {
    const user = User.build({ ...userData });

    await user.save();

    log(`User [${userData.username}] was saved to the database.`);

    return {
      user: user as unknown as IUser,
    };
  };

  const getAllUsers = async () => {
    const users = await User.findAll();

    return users as unknown as IUser[];
  };

  return {
    getUser,
    getAllUsers,
    createUser,
  };
};
