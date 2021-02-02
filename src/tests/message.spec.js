import { expect } from 'chai';

import { messageApi, userApi } from './api';

const createMessageWithSignIn = async ({login, password, text}) => {
  const {
    data: {
      data: {
        signIn: { token },
      },
    },
  } = await userApi.signIn({
    login,
    password,
  });

  return await messageApi.createMessage({ text }, token);
};

describe('messages', () => {
  describe('createMessage(text: String!): Message!', () => {
    it('returns a message when user is authorized', async () => {
      const expectedResult = {
        data: {
          createMessage: {
            text: 'Hello!'
          }
        }
      };

      const result = await createMessageWithSignIn({
        login: 'ddavids',
        password: 'ddavids',
        text: 'Hello!'
      });
      
      expect(result.data).to.eql(expectedResult);
    });
  });

  describe('messageCreated: MessageCreated!', function() {
    it('returns a message when user create a message', async () => {
      try {
        const subscriptionPromise = messageApi.subscribeToNewMessage();

        await createMessageWithSignIn({
            login: 'ddavids',
            password: 'ddavids',
            text: 'Hello!'
          });

        const {
          data: {
            messageCreated: {
              message: { text }
            }
          }
        } = await subscriptionPromise;
  
        expect(text).to.eql('Hello!');
      } catch (e) { throw e }
    });
  });
});
