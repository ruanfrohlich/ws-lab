import { Sequelize } from 'sequelize';
import { IUser, ModelTypes } from '../types';

export const User = (sequelize: Sequelize) => {
  const User = sequelize.define('User', ModelTypes.User);

  User.sync({ force: false, alter: true }).catch((err) => {
    throw new Error(`'Unable to create table :(': ${err}`);
  });

  const getUser = async (username: string) => {
    const [user, created] = await User.findOrCreate({
      where: { username },
    });

    return {
      user: user as unknown as IUser,
      created,
    };
  };

  const getAllUsers = async () => {
    const users = await User.findAll();

    return users as unknown as IUser[];
  };

  return {
    getUser,
    getAllUsers,
  };
};
