import { Sequelize } from 'sequelize';
import { AccountType, Friends, User } from './models';
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
