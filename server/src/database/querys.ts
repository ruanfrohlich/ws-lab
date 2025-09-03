import { QueryTypes, Sequelize } from 'sequelize';

export const searchAccounts = async (term: string, userId: number, sequelize: Sequelize) => {
  // Buscar usuários, servidores e canais em uma única query usando UNION
  const accounts = await sequelize.query(
    `
    SELECT  id, username as slug, email, name, "profilePic" as avatar, type
    FROM "User" 
    WHERE id != :id
    AND (name ILIKE :term OR username ILIKE :term) 
    LIMIT 10;
    `,
    // `
    // UNION ALL

    // SELECT 'server' as type, id, null as uuid, name, null as email, description as display_name, avatar, null as server_id, owner_id
    // FROM "Server"
    // WHERE name ILIKE :term
    // OR description ILIKE :term

    // UNION ALL

    // SELECT 'channel' as type, id, null as uuid, name, null as email, description as display_name, null as avatar, server_id, null as owner_id
    // FROM "Channel"
    // WHERE name ILIKE :term
    // OR description ILIKE :term
    // `,
    {
      replacements: { term: `%${term}%`, id: userId },
      type: QueryTypes.SELECT,
    },
  );

  return accounts;
};
