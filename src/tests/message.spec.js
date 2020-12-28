import { expect } from 'chai';

import { messageApi, userApi } from './api';

describe('messages', () => {
  describe.only('createMessage(text: String!): Message!', () => {
    it('returns a message when user is authorized', async () => {
      const {
        data: {
          data: {
            signIn: { token },
          },
        },
      } = await userApi.signIn({
        login: 'ddavids',
        password: 'ddavids',
      });

      const expectedResult = {
        data: {
          createMessage: {
            text: 'Hello!'
          }
        }
      };

      const result = await messageApi.createMessage({ text: 'Hello!' }, token);
      
      expect(result.data).to.eql(expectedResult);
    });
  });
});