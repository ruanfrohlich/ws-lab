import { Sequelize } from 'sequelize';
import { User } from './models';
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

  const { getAllUsers, getUser, createUser, checkUserExists } = User(sequelize);

  await sequelize
    .sync()
    .then(() => log('All models were synchronized successfully.'))
    .catch((err) => console.log(err));

  const close = () => sequelize.close();

  return {
    getUser,
    getAllUsers,
    createUser,
    checkUserExists,
    close,
  };
};

export default database;
