import { Op, Sequelize } from 'sequelize';
import {
  FriendsModel,
  IFindUserResponse,
  IUserFriends,
  ModelTypes,
  IUser,
  UserAttributes,
  UserCreationAttributes,
  UserModel,
} from '../types';
import { omit, pick } from 'lodash';
import { log, useCache } from 'utils';

/**
 * Factory para criação do modelo User com métodos CRUD e cache
 * @param sequelize - Instância do Sequelize para criação do modelo
 * @returns Objeto contendo o modelo e métodos de operação com usuários
 */
export const User = async (sequelize: Sequelize) => {
  const Model: UserModel = sequelize.define('User', ModelTypes.User, {
    indexes: [
      {
        unique: true,
        fields: ['username', 'email'],
      },
    ],
  });
  const { get, set, del } = await useCache();

  /**
   * Busca um usuário por username ou email com cache
   * @param data - Dados de busca contendo username e email
   * @returns Dados do usuário ou null se não encontrado
   */
  const getUser = async (data: { username: string; email: string }) => {
    try {
      const { cachedUser, credential } = await new Promise<{
        cachedUser: IUser | null;
        credential: string;
      }>((res) => {
        Object.keys(data).map(async (credential) => {
          //@ts-expect-error i know
          if (data[credential] === '') return;

          //@ts-expect-error i know
          const cachedUser = await get<IUser>(data[credential]);

          res({ cachedUser, credential });
        });
      });

      if (cachedUser) {
        log('Serving from cache - ' + getUser.name);
        return cachedUser;
      }

      const user = await Model.findOne({
        where: {
          [Op.or]: [{ email: data.email }, { username: data.username }],
        },
      });

      if (!user) {
        return null;
      }

      //@ts-expect-error i know
      await set(data[credential], user);

      return user.toJSON();
    } catch (e) {
      console.log(e);

      return null;
    }
  };

  /**
   * Cria um novo usuário no banco de dados
   * @param userData - Dados do usuário a ser criado
   * @returns Objeto contendo os dados do usuário criado com lista de amigos vazia
   */
  const createUser = async (
    userData: UserCreationAttributes,
  ): Promise<{
    user: UserAttributes & {
      friends: Array<IUserFriends>;
    };
  }> => {
    const { dataValues } = await Model.create({ ...userData });

    log(`User [${dataValues.username}] was saved to the database.`);

    return {
      user: { ...dataValues, friends: [] },
    };
  };

  /**
   * Busca um usuário por UUID incluindo lista de amigos com cache
   * @param uuid - UUID único do usuário
   * @param friendsModel - Modelo de amigos para incluir na consulta
   * @returns Dados completos do usuário com amigos ou null se não encontrado
   */
  const getUserByUUID = async (
    uuid: string,
    friendsModel: FriendsModel,
  ): Promise<IFindUserResponse | null> => {
    try {
      const cachedUser = await get<IFindUserResponse>(uuid);

      if (cachedUser) {
        log('Sending from cache - ' + getUserByUUID.name);

        return cachedUser;
      }

      const query = await Model.findOne({
        where: {
          uuid,
        },
        include: {
          model: friendsModel,
          as: 'friends',
          include: [Model],
        },
      });

      if (query) {
        const userWithFriends = {
          ...omit(query?.dataValues, ['password']),
          //@ts-expect-error friends created by association
          friends: query?.dataValues.friends.map((friend) =>
            pick(
              {
                ...friend.dataValues,
                user: pick(friend.dataValues.User.dataValues, [
                  'id',
                  'username',
                  'name',
                  'uuid',
                  'profilePic',
                ]),
              },
              ['id', 'status', 'activityStatus', 'user'],
            ),
          ),
        };

        await set(uuid, userWithFriends);

        return userWithFriends;
      }

      return null;
    } catch (e) {
      console.log(e);

      return null;
    }
  };

  /**
   * Busca todos os usuários com cache
   * @returns Lista de todos os usuários do sistema
   */
  const getAllUsers = async () => {
    const allUsersCached = await get('allUsers');

    if (allUsersCached) {
      return allUsersCached;
    }

    const users = await Model.findAll();
    await set('allUsers', users);

    return users;
  };

  /**
   * Atualiza dados de um usuário e invalida cache relacionado
   * @param data - Dados a serem atualizados (exceto password)
   * @param token - UUID do usuário a ser atualizado
   * @returns Dados atualizados do usuário ou null se não encontrado
   */
  const updateUser = async (
    data: Omit<UserCreationAttributes, 'password'>,
    token: string,
  ) => {
    try {
      const user = await Model.findOne({
        where: {
          uuid: token,
        },
      });

      if (user) {
        await user.update(data);

        const { email, uuid, username } = user.dataValues;

        [email, uuid, username].forEach(async (credential) => {
          await del(credential);
        });

        return user.toJSON();
      }

      return null;
    } catch (e) {
      console.log(e);

      return null;
    }
  };

  return {
    Model,
    getUser,
    getUserByUUID,
    getAllUsers,
    createUser,
    updateUser,
  };
};
