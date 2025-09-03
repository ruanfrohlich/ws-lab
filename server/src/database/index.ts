import { Sequelize } from 'sequelize';
import { AccountType, Friends, FriendStatus, User } from './models';
import { searchAccounts } from './querys';

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
    onDelete: 'cascade',
  });

  FriendsModel.Model.belongsTo(UserModel.Model, {
    targetKey: 'id',
    foreignKey: {
      name: 'friendId',
      allowNull: false,
    },
    onDelete: 'cascade',
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
    searchAccounts: async (term: string, userId: number) => await searchAccounts(term, userId, sequelize),
  };
};

export default database;
