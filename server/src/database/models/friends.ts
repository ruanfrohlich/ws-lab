import { QueryTypes, Sequelize } from 'sequelize';

export const Friends = (sequelize: Sequelize) => {
  const getAllFriendsById = async (userId: number) => {
    const friends = await sequelize.query(`SELECT * FROM Friends WHERE userId=${userId};`, {
      type: QueryTypes.SELECT,
    });

    console.log(friends);
  };

  return {
    getAllFriendsById,
  };
};
