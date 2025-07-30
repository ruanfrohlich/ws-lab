import { Sequelize } from 'sequelize';
import { AccountType, User } from './models';
import { cwd } from 'process';
import { log } from '../utils';

const database = async () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: cwd() + '/server/.db/db.sqlite3',
    // username: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
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

  await sequelize
    .sync({ alter: true })
    .then(() => log('All models were synchronized successfully'))
    .catch((err) => console.log(err));

  const close = () => sequelize.close();

  await AccountTypeModel.createType('CHANNEL');
  await AccountTypeModel.createType('USER');
  await AccountTypeModel.createType('SERVER');

  return {
    AccountTypeModel,
    UserModel,
    close,
  };
};

export default database;
