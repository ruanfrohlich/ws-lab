import { ModelDefined, Sequelize } from 'sequelize';
import { AccountTypeAttributes, AccountTypeCreationAttributes, AccountTypesEnum, ModelTypes } from '../types';

export const AccountType = (sequelize: Sequelize) => {
  const AccountType: ModelDefined<AccountTypeAttributes, AccountTypeCreationAttributes> = sequelize.define(
    'AccountType',
    ModelTypes.AccountType,
  );

  const createType = async (type: keyof typeof AccountTypesEnum) => {
    await AccountType.findOrCreate({
      where: {
        label: AccountTypesEnum[type],
      },
    });
  };

  return { AccountType, createType };
};
