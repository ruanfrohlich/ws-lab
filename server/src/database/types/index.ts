import { CreationOptional, DataTypes, Optional } from 'sequelize';

export interface IUser {
  id: number;
  typeId: number;
  username: string;
  email: string;
  password: string;
  uuid: string;
  profilePic: string;
  coverImage: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

export enum AccountTypesEnum {
  USER = 'user',
  SERVER = 'server',
  CHANNEL = 'channel',
}

export interface AccountTypeAttributes {
  id: number;
  label: AccountTypesEnum;
}

export type AccountTypeCreationAttributes = Optional<AccountTypeAttributes, 'id'>;

export const ModelTypes = {
  User: {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false },
    profilePic: { type: DataTypes.STRING, allowNull: true },
    coverImage: { type: DataTypes.STRING, allowNull: true },
  },
  AccountType: {
    label: {
      type: DataTypes.ENUM(...Object.values(AccountTypesEnum)),
      allowNull: false,
      unique: true,
    },
  },
};
