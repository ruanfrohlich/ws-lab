import { CreationOptional, DataTypes } from 'sequelize';

export interface IUser {
  id: number;
  username: string;
  email: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

export const ModelTypes = {
  User: {
    username: DataTypes.STRING,
    email: DataTypes.STRING,
  },
};
