import { Op, Sequelize } from 'sequelize';
import {
  FriendsModel,
  IFindUserResponse,
  IUserFriends,
  ModelTypes,
  IUser,
  UserAttributes,
  UserCreationAttributes,
  UserModel,
} from '../types';
import { omit, pick } from 'lodash';
import { log, useCache } from 'utils';

export const User = async (sequelize: Sequelize) => {
  const Model: UserModel = sequelize.define('User', ModelTypes.User, {
    indexes: [
      {
        unique: true,
        fields: ['username', 'email'],
      },
    ],
  });
  const { get, set, del } = await useCache();

  const getUser = async (data: { username: string; email: string }) => {
    try {
      const { cachedUser, credential } = await new Promise<{
        cachedUser: IUser | null;
        credential: string;
      }>((res) => {
        Object.keys(data).map(async (credential) => {
          //@ts-expect-error i know
          if (data[credential] === '') return;

          //@ts-expect-error i know
          const cachedUser = await get<IUser>(data[credential]);

          res({ cachedUser, credential });
        });
      });

      if (cachedUser) {
        log('Serving from cache - ' + getUser.name);
        return cachedUser;
      }

      const user = await Model.findOne({
        where: {
          [Op.or]: [{ email: data.email }, { username: data.username }],
        },
      });

      if (!user) {
        return null;
      }

      //@ts-expect-error i know
      await set(data[credential], user);

      return user.toJSON();
    } catch (e) {
      console.log(e);

      return null;
    }
  };

  const createUser = async (
    userData: UserCreationAttributes,
  ): Promise<{
    user: UserAttributes & {
      friends: Array<IUserFriends>;
    };
  }> => {
    const { dataValues } = await Model.create({ ...userData });

    log(`User [${dataValues.username}] was saved to the database.`);

    return {
      user: { ...dataValues, friends: [] },
    };
  };

  const getUserByUUID = async (
    uuid: string,
    friendsModel: FriendsModel,
  ): Promise<IFindUserResponse | null> => {
    try {
      const cachedUser = await get<IFindUserResponse>(uuid);

      if (cachedUser) {
        log('Sending from cache - ' + getUserByUUID.name);

        return cachedUser;
      }

      const query = await Model.findOne({
        where: {
          uuid,
        },
        include: {
          model: friendsModel,
          as: 'friends',
          include: [Model],
        },
      });

      if (query) {
        const userWithFriends = {
          ...omit(query?.dataValues, ['password']),
          //@ts-expect-error friends created by association
          friends: query?.dataValues.friends.map((friend) =>
            pick(
              {
                ...friend.dataValues,
                user: pick(friend.dataValues.User.dataValues, [
                  'id',
                  'username',
                  'name',
                  'uuid',
                  'profilePic',
                ]),
              },
              ['id', 'status', 'activityStatus', 'user'],
            ),
          ),
        };

        await set(uuid, userWithFriends);

        return userWithFriends;
      }

      return null;
    } catch (e) {
      console.log(e);

      return null;
    }
  };

  const getAllUsers = async () => {
    const allUsersCached = await get('allUsers');

    if (allUsersCached) {
      return allUsersCached;
    }

    const users = await Model.findAll();
    await set('allUsers', users);

    return users;
  };

  const updateUser = async (
    data: Omit<UserCreationAttributes, 'password'>,
    token: string,
  ) => {
    try {
      const user = await Model.findOne({
        where: {
          uuid: token,
        },
      });

      if (user) {
        await user.update(data);

        const { email, uuid, username } = user.dataValues;

        [email, uuid, username].forEach(async (credential) => {
          await del(credential);
        });

        return user.toJSON();
      }

      return null;
    } catch (e) {
      console.log(e);

      return null;
    }
  };

  return {
    Model,
    getUser,
    getUserByUUID,
    getAllUsers,
    createUser,
    updateUser,
  };
};
