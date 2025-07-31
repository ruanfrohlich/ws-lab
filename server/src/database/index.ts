import { Sequelize } from 'sequelize';
import { AccountType, User } from './models';
import { cwd } from 'process';

const database = async () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: cwd() + '/server/.db/db.sqlite3',
    logging: false,
    define: {
      freezeTableName: true,
    },
  });

  const AccountTypeModel = AccountType(sequelize);
  const UserModel = User(sequelize);

  UserModel.User.belongsTo(AccountTypeModel.AccountType, {
    onUpdate: 'restrict',
    targetKey: 'label',
    foreignKey: {
      name: 'type',
      allowNull: false,
    },
  });

  const close = () => sequelize.close();

  return {
    AccountTypeModel,
    UserModel,
    close,
  };
};

export default database;
