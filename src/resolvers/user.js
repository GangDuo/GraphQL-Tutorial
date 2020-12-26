export default {
  Query: {
    users: (parent, args, { models }) => {
      return new Promise(resolve => setTimeout(() => resolve(Object.values(models.users)), 3000));
    },
    user: (parent, { id }, { models }) => {
      return models.users[id];
    },
    me: (parent, args, { me }) => {
      return me;
    },
  },

  User: {
    username: user => user.username,
    messages: (user, args, { models }) => {
      return Object.values(models.messages).filter(
        message => message.userId === user.id,
      );
    },
  },
};