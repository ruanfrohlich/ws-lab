import {
  CreationOptional,
  DataTypes,
  ModelAttributes,
  ModelDefined,
} from 'sequelize';

export interface DefaultAttributes {
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

export interface AccountTypeAttributes extends DefaultAttributes {
  label: AccountTypesEnum;
}

type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

export type AccountTypeCreationAttributes = Optional<
  AccountTypeAttributes,
  DefaultOptionalAttibutes
>;

export type AccountTypeModel = ModelDefined<
  AccountTypeAttributes,
  AccountTypeCreationAttributes
>;

export interface UserAttributes extends DefaultAttributes {
  name: string;
  type: AccountTypesEnum;
  username: string;
  email: string;
  password: string;
  uuid: string;
  profilePic: string;
  coverImage: string;
}

export type UserCreationAttributes = Optional<
  UserAttributes,
  DefaultOptionalAttibutes | 'uuid'
>;

export type UserModel = ModelDefined<UserAttributes, UserCreationAttributes>;

export interface FriendsAttributes extends DefaultAttributes {
  status: string;
}

export type FriendsCreationAttributes = Optional<
  FriendsAttributes,
  DefaultOptionalAttibutes
>;

export type FriendsModel = ModelDefined<
  FriendsAttributes,
  FriendsCreationAttributes
>;

export type TFriendStatus = 'send' | 'accepted' | 'rejected';

export interface IUserFriends {
  id: number;
  status: TFriendStatus;
  activityStatus: TActivityStatus;
  user: Pick<
    UserAttributes,
    'id' | 'username' | 'name' | 'uuid' | 'profilePic'
  >;
}

export type TActivityStatus = 'online' | 'away' | 'offline' | 'busy';

export interface FriendStatusAttributes extends DefaultAttributes {
  status: TFriendStatus;
}

export type FriendStatusModel = ModelDefined<
  FriendStatusAttributes,
  Optional<FriendStatusAttributes, DefaultOptionalAttibutes>
>;

export const ModelTypes: {
  [key: string]: ModelAttributes;
} = {
  User: {
    name: { type: DataTypes.STRING, allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    profilePic: { type: DataTypes.TEXT, defaultValue: '' },
    coverImage: { type: DataTypes.TEXT, defaultValue: '' },
  },
  AccountType: {
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  Friends: {
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'send',
    },
    activityStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'offline',
    },
  },
  FriendStatus: {
    status: {
      type: DataTypes.STRING,
    },
  },
};
