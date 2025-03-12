import { Sequelize } from 'sequelize';
import { IUser, ModelTypes } from '../types';

export const User = (sequelize: Sequelize) => {
  const User = sequelize.define('User', ModelTypes.User);

  const getUser = async (username: string) => {
    console.log(username);

    const user = await User.findOne({
      where: { username },
    });

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
  };
};
