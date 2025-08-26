import { Sequelize } from 'sequelize';
import { AccountTypeModel, AccountTypesEnum, ModelTypes } from '../types';

export const AccountType = (sequelize: Sequelize) => {
  const Model: AccountTypeModel = sequelize.define('AccountType', ModelTypes.AccountType);

  const createType = async (type: keyof typeof AccountTypesEnum) => {
    await Model.findOrCreate({
      where: {
        label: AccountTypesEnum[type],
      },
    });
  };

  return { Model, createType };
};
