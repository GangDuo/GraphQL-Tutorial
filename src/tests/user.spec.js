import { expect } from 'chai';

import * as userApi from './api';

describe('users', () => {
  describe('users: [User!]', () => {
    it('returns users when user can be found', async () => {
      const expectedResult = {
        data: {
          users: [
            {
              email: "hello@robin.com",
              id: "1",
              role: "ADMIN",
              username: "rwieruch",
            },
            {
              email: "hello@david.com",
              id: "2",
              role: null,
              username: "ddavids",
            }
          ]
        }
      };
  
      const result = await userApi.users();
  
      expect(result.data).to.eql(expectedResult);
    });
  });

  describe('user(id: String!): User', () => {
    it('returns a user when user can be found', async () => {
      const expectedResult = {
        data: {
          user: {
            id: '1',
            username: 'rwieruch',
            email: 'hello@robin.com',
            role: 'ADMIN',
          },
        },
      };

      const result = await userApi.user({ id: '1' });

      expect(result.data).to.eql(expectedResult);
    });

    it('returns null when user cannot be found', async () => {
      const expectedResult = {
        data: {
          user: null,
        },
      };

      const result = await userApi.user({ id: '42' });

      expect(result.data).to.eql(expectedResult);
    });
  });

  describe('me: User', () => {
    it('returns a user when user authorized', async () => {
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
          me: {
            id: '2',
            username: 'ddavids',
            email: 'hello@david.com',
            role: null
          }
        },
      };

      const result = await userApi.me(token);
 
      expect(result.data).to.eql(expectedResult);
    });

    it('returns null when user cannot be authorized', async () => {
      const expectedResult = {
        data: {
          me: null,
        },
      };

      const result = await userApi.me();

      expect(result.data).to.eql(expectedResult);
    });
  });

  describe('signUp(username: String!, email: String!, password: String!): Token!', () => {
    it('returns a token when user authorized', async () => {
      const {
        data: {
          data: {
            signUp: { token },
          },
        },
      } = await userApi.signUp({
        username: 'test',
        email: 'test@example.com',
        password: '0'.repeat(7),
      });

      expect(token).to.be.a('string');
    });

    // パスワード長さ
    it('returns an error because password must be at least 7 characters', async () => {
      const username = Math.random().toString(32).substring(2)
      const {
        data: { errors },
      } = await userApi.signUp({
        username,
        email: `${username}@example.com`,
        password: '0'.repeat(6),
      });

      expect(errors[0].message).to.eql('Validation error: Validation len on password failed');
    });

    it('returns an error because password can be up to 42 characters', async () => {
      const username = Math.random().toString(32).substring(2)
      const {
        data: { errors },
      } = await userApi.signUp({
        username,
        email: `${username}@example.com`,
        password: '0'.repeat(43),
      });

      expect(errors[0].message).to.eql('Validation error: Validation len on password failed');
    });

    // 重複アドレス、ユーザ名
    it('returns an error because a username is unique', async () => {
      const {
        data: { errors },
      } = await userApi.signUp({
        username: 'rwieruch',
        email: `${Math.random().toString(32).substring(2)}@example.com`,
        password: 'rwieruch',
      });

      expect(errors[0].message).to.eql('A username is not unique.');
    });

    it('returns an error because a email is unique', async () => {
      const {
        data: { errors },
      } = await userApi.signUp({
        username: Math.random().toString(32).substring(2),
        email: 'hello@robin.com',
        password: 'rwieruch',
      });

      expect(errors[0].message).to.eql('A email is not unique.');
    });
  });

  describe('deleteUser(id: String!): Boolean!', () => {
    it('returns an error because only admins can delete a user', async () => {
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
 
      const {
        data: { errors },
      } = await userApi.deleteUser({ id: '1' }, token);
 
      expect(errors[0].message).to.eql('Not authorized as admin.');
    });

    it('returns true because only admins can delete a user', async () => {
        const {
          data: {
            data: {
              signIn: { token },
            },
          },
        } = await userApi.signIn({
          login: 'rwieruch',
          password: 'rwieruch',
        });
   
        const expectedResult = {
          data: {
            deleteUser: true
          },
        };

        const result = await userApi.deleteUser({ id: '1' }, token);
   
        expect(result.data).to.eql(expectedResult);
      });
  });
});
