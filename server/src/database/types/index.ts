import { CreationOptional, DataTypes, ModelAttributes, ModelDefined } from 'sequelize';

export interface IDefaultAttributes {
  id: number;
  createdAt: CreationOptional<Date>;
  updatedAt: CreationOptional<Date>;
}

type DefaultOptionalAttibutes = 'id' | 'createdAt' | 'updatedAt';

export enum AccountTypesEnum {
  USER = 'user',
  SERVER = 'server',
  CHANNEL = 'channel',
}

export interface AccountTypeAttributes extends IDefaultAttributes {
  label: AccountTypesEnum;
}

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type AccountTypeCreationAttributes = Optional<AccountTypeAttributes, DefaultOptionalAttibutes>;

export type AccountTypeModel = ModelDefined<AccountTypeAttributes, AccountTypeCreationAttributes>;

export interface UserAttributes extends IDefaultAttributes {
  name: string;
  type: AccountTypesEnum;
  username: string;
  email: string;
  password: string;
  uuid: string;
  profilePic: string;
  coverImage: string;
}

export type UserCreationAttributes = Optional<UserAttributes, DefaultOptionalAttibutes | 'uuid'>;

export type UserModel = ModelDefined<UserAttributes, UserCreationAttributes>;

export interface FriendsAttributes extends IDefaultAttributes {
  status: string;
}

export type FriendsCreationAttributes = Optional<FriendsAttributes, DefaultOptionalAttibutes>;

export type FriendsModel = ModelDefined<FriendsAttributes, FriendsCreationAttributes>;

export const ModelTypes: {
  [key: string]: ModelAttributes;
} = {
  User: {
    name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, allowNull: false },
    profilePic: { type: DataTypes.STRING, defaultValue: '' },
    coverImage: { type: DataTypes.STRING, defaultValue: '' },
  },
  AccountType: {
    label: {
      type: DataTypes.ENUM(...Object.values(AccountTypesEnum)),
      allowNull: false,
      unique: true,
    },
  },
  Friends: {
    status: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'send',
    },
    activityStatus: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: 'offline',
    },
  },
};
