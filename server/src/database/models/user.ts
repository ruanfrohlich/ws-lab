import { QueryTypes, Sequelize } from 'sequelize';
import {
  FriendsModel,
  ModelTypes,
  TActivityStatus,
  TFriendStatus,
  UserAttributes,
  UserCreationAttributes,
  UserModel,
} from '../types';
import { log } from '../../utils';
import { isEmpty, omit, pick } from 'lodash';

export const User = (sequelize: Sequelize) => {
  const Model: UserModel = sequelize.define('User', ModelTypes.User);

  const getUser = async (data: { username: string; email: string }) => {
    try {
      const query = await sequelize.query<UserAttributes>(
        `SELECT * FROM User WHERE username="${data.username}" OR email="${data.email}"`,
        {
          type: QueryTypes.SELECT,
        },
      );

      if (isEmpty(query)) {
        return null;
      }

      return query[0];
    } catch (e) {
      console.log(e);

      return null;
    }
  };

  const createUser = async (userData: UserCreationAttributes): Promise<{ user: UserAttributes }> => {
    const { dataValues } = await Model.create({ ...userData });

    log(`User [${dataValues.username}] was saved to the database.`);

    return {
      user: dataValues,
    };
  };

  const getUserByUUID = async (
    uuid: string,
    friendsModel: FriendsModel,
  ): Promise<
    | (Omit<UserAttributes, 'password'> & {
        friends: Array<{
          id: number;
          status: TFriendStatus;
          activityStatus: TActivityStatus;
          user: Pick<UserAttributes, 'id' | 'username' | 'name' | 'uuid' | 'profilePic'>;
        }>;
      })
    | null
  > => {
    try {
      const query = await Model.findOne({
        where: {
          uuid,
        },
        include: {
          model: friendsModel,
          as: 'friends',
          include: [
            {
              model: Model,
            },
          ],
        },
      });

      if (query) {
        return {
          ...omit(query?.dataValues, ['password']),
          //@ts-expect-error friends created by association
          friends: query?.dataValues.friends.map((friend) =>
            pick(
              {
                ...friend.dataValues,
                user: pick(friend.dataValues.User.dataValues, ['id', 'username', 'name', 'uuid', 'profilePic']),
              },
              ['id', 'status', 'activityStatus', 'user'],
            ),
          ),
        };
      }

      return null;
    } catch (e) {
      console.log(e);

      return null;
    }
  };

  const getAllUsers = async () => {
    const users = await Model.findAll();

    return users;
  };

  const updateUser = async (data: Omit<UserCreationAttributes, 'password'>, token: string) => {
    try {
      const user = await Model.findOne({
        where: {
          uuid: token,
        },
      });

      if (user) {
        await user.update(data);

        return user;
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
