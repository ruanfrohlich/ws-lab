import { Sequelize } from 'sequelize';
import { FriendsAttributes, FriendsModel, ModelTypes } from '../types';
import { isEmpty } from 'lodash';

export const Friends = async (sequelize: Sequelize) => {
  const Model: FriendsModel = sequelize.define('Friends', ModelTypes.Friends);

  const getAllFriendsById = async (userId: number) => {
    const friends: FriendsAttributes[] = [];
    const query = await Model.findAll({
      where: {
        id: userId,
      },
    });

    if (!isEmpty(query)) {
      query.map((item) => friends.push(item.dataValues));
    }

    return friends;
  };

  return {
    Model,
    getAllFriendsById,
  };
};
