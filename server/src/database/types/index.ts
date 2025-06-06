import { CreationOptional, DataTypes } from 'sequelize';

export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

export const ModelTypes = {
  User: {
    username: { type: DataTypes.STRING, allowNull: false },
    email: DataTypes.STRING,
    password: { type: DataTypes.STRING, allowNull: false },
    profilePic: { type: DataTypes.STRING, allowNull: true },
    coverImage: { type: DataTypes.STRING, allowNull: true },
  },
};
