import { ModelDefined, QueryTypes, Sequelize } from 'sequelize';
import { AccountTypesEnum, ModelTypes, UserAttributes, UserCreationAttributes } from '../types';
import { IDBUser } from '../../interfaces';
import { log } from '../../utils';
import { isEmpty } from 'lodash';

export const User = (sequelize: Sequelize) => {
  const User: ModelDefined<UserAttributes, UserCreationAttributes> = sequelize.define('User', ModelTypes.User);

  const getUser = async (data: Omit<IDBUser, 'password' | 'coverImage' | 'profilePic'>): Promise<IDBUser | null> => {
    try {
      const query = await sequelize.query<IDBUser>(
        `SELECT * FROM User WHERE username="${data.username}" OR email="${data.email}"`,
        {
          type: QueryTypes.SELECT,
        },
      );

      if (isEmpty(query)) {
        return null;
      }

      return query[0];
    } catch (e) {
      console.log(e);

      return null;
    }
  };

  const createUser = async (userData: IDBUser): Promise<{ user: UserAttributes }> => {
    const { dataValues } = await User.create({ type: AccountTypesEnum['USER'], ...userData });

    log(`User [${dataValues.username}] was saved to the database.`);

    return {
      user: dataValues,
    };
  };

  const getUserByUUID = async (uuid: string): Promise<IDBUser | null> => {
    try {
      const user = await User.findOne({
        where: {
          uuid: uuid,
        },
      });

      if (user) {
        return user.dataValues;
      }

      return null;
    } catch (e) {
      console.log(e);

      return null;
    }
  };

  const getAllUsers = async () => {
    const users = await User.findAll();

    return users;
  };

  const updateUser = async (data: Omit<IDBUser, 'password'>, token: string) => {
    try {
      const updatedUser = await User.update(data, {
        where: {
          password: token,
        },
      });

      return updatedUser[0];
    } catch (e) {
      console.log(e);

      return 0;
    }
  };

  return {
    User,
    getUser,
    getUserByUUID,
    getAllUsers,
    createUser,
    updateUser,
  };
};
