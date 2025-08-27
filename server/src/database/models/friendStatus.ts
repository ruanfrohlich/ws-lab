import { Sequelize } from 'sequelize';
import { FriendStatusModel, ModelTypes } from '../types';

export const FriendStatus = (sequelize: Sequelize) => {
  const Model: FriendStatusModel = sequelize.define(
    'FriendStatus',
    ModelTypes.FriendStatus,
  );

  ['send', 'accepted', 'rejected'].forEach(async (status) => {
    await Model.findOrCreate({
      where: {
        status,
      },
    });
  });

  return {
    Model,
  };
};
