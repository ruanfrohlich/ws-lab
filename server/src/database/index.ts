import { Sequelize } from 'sequelize';
import { AccountType, Friends, FriendStatus, User } from './models';

const database = async () => {
  const sequelize = new Sequelize(String(process.env.DB_URL), {
    dialect: 'postgres',
    logging: false,
    define: {
      freezeTableName: true,
    },
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  });

  const AccountTypeModel = AccountType(sequelize);
  const UserModel = User(sequelize);
  const FriendsModel = Friends(sequelize);
  const FriendStatusModel = FriendStatus(sequelize);

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

  AccountTypeModel.Model.hasOne(UserModel.Model, {
    sourceKey: 'label',
    foreignKey: {
      name: 'type',
      allowNull: false,
    },
  });

  const close = () => sequelize.close();

  const syncDB = async () => await sequelize.sync({ alter: true });

  return {
    AccountTypeModel,
    UserModel,
    FriendsModel,
    FriendStatusModel,
    close,
    syncDB,
  };
};

export default database;
