import { Sequelize } from 'sequelize';
import { IUser, ModelTypes } from '../types';
import { IDBUser } from '../../interfaces';
import { log } from '../../utils';

export const User = (sequelize: Sequelize) => {
  const User = sequelize.define('User', ModelTypes.User);

  const getUser = async (username: string) => {
    const user = await User.findOne({
      where: { username },
    });

    return {
      user: user as unknown as IUser,
    };
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
