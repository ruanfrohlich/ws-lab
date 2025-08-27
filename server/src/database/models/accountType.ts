import { Sequelize } from 'sequelize';
import { AccountTypeModel, ModelTypes } from '../types';

export const AccountType = (sequelize: Sequelize) => {
  const Model: AccountTypeModel = sequelize.define(
    'AccountType',
    ModelTypes.AccountType,
    {
      indexes: [
        {
          unique: true,
          fields: ['label'],
        },
      ],
    },
  );

  ['user', 'server', 'channel'].forEach(async (type) => {
    await Model.findOrCreate({
      where: {
        label: type,
      },
    });
  });

  return { Model };
};
