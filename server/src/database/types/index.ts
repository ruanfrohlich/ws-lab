import { CreationOptional, DataTypes, ModelAttributes, Optional } from 'sequelize';

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

export interface UserAttributes {
  id: number;
  type: AccountTypesEnum;
  username: string;
  email: string;
  password: string;
  uuid: string;
  profilePic: string;
  coverImage: string;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

export type UserCreationAttributes = Optional<UserAttributes, 'id' | 'uuid' | 'createdAt' | 'updatedAt'>;

export const ModelTypes: {
  [key: string]: ModelAttributes;
} = {
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
