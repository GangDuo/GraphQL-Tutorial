import { combineResolvers } from 'graphql-resolvers';
 
import { isAuthenticated, isMessageOwner } from './authorization';

export default {
  Query: {
    messages: async (
      parent,
      { offset = 0, limit = 0 },
      { models }
    ) => {
      return await models.Message.findAll({
        offset,
        limit,
      });
    },
    message: async (parent, { id }, { models }) => {
      return await models.Message.findByPk(id);
    },
  },

  Mutation: {
    createMessage: combineResolvers(
      isAuthenticated,
      async (parent, { text }, { me, models }) => {
        return await models.Message.create({
          text,
          userId: me.id,
        });
      },
    ),

    deleteMessage: combineResolvers(
      isAuthenticated,
      isMessageOwner,
      async (parent, { id }, { models }) => {
        return await models.Message.destroy({ where: { id } });
      },
    ),

    editMessage: async (parent, { id, text }, { models }) => {
      try {
        await models.Message.update({ text }, { where: { id } });
        return true;
      } catch (error) {
        return false;
      }
    },
  },

  Message: {
    user: async (message, args, { models }) => {
      return await models.User.findByPk(message.userId);
    },
  },
};