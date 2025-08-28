import { Sequelize } from 'sequelize';
import { FriendStatusModel, ModelTypes } from '../types';

export const FriendStatus = async (sequelize: Sequelize) => {
  const Model: FriendStatusModel = sequelize.define(
    'FriendStatus',
    ModelTypes.FriendStatus,
  );

  await Model.sync();

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
