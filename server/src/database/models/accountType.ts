import { Sequelize } from 'sequelize';
import { AccountTypeModel, ModelTypes } from '../types';

export const AccountType = async (sequelize: Sequelize) => {
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

  return { Model };
};
