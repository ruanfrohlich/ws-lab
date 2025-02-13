import { Sequelize } from 'sequelize';
import { User } from './models';

const database = () => {
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: '.db/db.sqlite3',
    // username: process.env.DB_USER,
    // password: process.env.DB_PASSWORD,
    logging: false,
  });

  const { getAllUsers, getUser } = User(sequelize);

  const close = () => sequelize.close();

  return {
    getUser,
    getAllUsers,
    close,
  };
};

export default database;
