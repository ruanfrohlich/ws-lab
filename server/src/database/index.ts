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

  const AccountTypeModel = await AccountType(sequelize);
  const UserModel = await User(sequelize);
  const FriendsModel = await Friends(sequelize);
  const FriendStatusModel = await FriendStatus(sequelize);

  UserModel.Model.hasMany(FriendsModel.Model, {
    as: 'friends',
    sourceKey: 'id',
    foreignKey: {
      name: 'userId',
      allowNull: false,
    },
  });

  FriendsModel.Model.belongsTo(UserModel.Model, {
    targetKey: 'id',
    foreignKey: {
      name: 'friendId',
      allowNull: false,
    },
  });

  AccountTypeModel.Model.hasOne(UserModel.Model, {
    sourceKey: 'label',
    foreignKey: 'type',
  });

  const close = () => sequelize.close();

  const sync = async () => await sequelize.sync({ alter: true });

  return {
    AccountTypeModel,
    UserModel,
    FriendsModel,
    FriendStatusModel,
    close,
    sync,
  };
};

export default database;
