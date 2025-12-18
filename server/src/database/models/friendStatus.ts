import { Sequelize } from 'sequelize';
import { FriendStatusModel, ModelTypes } from '../types';

export const FriendStatus = async (sequelize: Sequelize) => {
  const Model: FriendStatusModel = sequelize.define(
    'FriendStatus',
    ModelTypes.FriendStatus,
  );

  return {
    Model,
  };
};
