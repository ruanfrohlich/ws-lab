import { Sequelize } from 'sequelize';
import { AccountType, Friends, User } from './models';
import { join } from 'path';
import { rootPath } from '../utils';

const database = async () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: join(rootPath, '.db/db.sqlite3'),
    logging: false,
    define: {
      freezeTableName: true,
    },
  });

  const AccountTypeModel = AccountType(sequelize);
  const UserModel = User(sequelize);
  const FriendsModel = Friends(sequelize);

  UserModel.Model.belongsTo(AccountTypeModel.Model, {
    onUpdate: 'restrict',
    targetKey: 'label',
    foreignKey: {
      name: 'type',
      allowNull: false,
    },
  });

  UserModel.Model.hasMany(FriendsModel.Model, {
    as: 'friends',
  });

  ['userId', 'friendId'].forEach((id) => {
    FriendsModel.Model.belongsTo(UserModel.Model, {
      foreignKey: {
        name: id,
        allowNull: false,
      },
    });
  });

  const close = () => sequelize.close();

  return {
    AccountTypeModel,
    UserModel,
    FriendsModel,
    close,
  };
};

export default database;
