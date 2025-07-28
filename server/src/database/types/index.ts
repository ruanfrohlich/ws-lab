import { CreationOptional, DataTypes } from 'sequelize';

export interface IUser {
  id: number;
  username: string;
  email: string;
  password: string;
  uuid: string;
  profilePic: string;
  coverImage: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

export const ModelTypes = {
  User: {
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false },
    profilePic: { type: DataTypes.STRING, allowNull: true },
    coverImage: { type: DataTypes.STRING, allowNull: true },
  },
};
