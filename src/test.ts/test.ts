import { ApolloServer } from 'apollo-server';
import { createTestClient } from 'apollo-server-testing';
import { typeDefs } from '../schema';
import { resolvers } from '../resolvers';

describe('verifyUser', () => {
  it('should verify a user with correct inputs', async () => {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({
        PaystackService: {
          resolveAccountNumber: async () => ({
            status: true,
            data: { account_name: 'John Doe' },
          }),
        },
        UserRepository: {
          getUserByBankAndAccount: async () => ({
            id: '123',
            name: 'John Doe',
            is_verified: false,
          }),
          updateUser: async () => ({
            id: '123',
            name: 'John Doe',
            is_verified: true,
          }),
        },
        computeLevenshteinDistance: (s1: string, s2: string) => 1,
      }),
    });

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: `
        mutation {
          verifyUser(
            user_account_number: "1234567890",
            user_bank_code: "056",
            user_account_name: "John Doe"
          ) {
            id
            name
            is_verified
          }
        }
      `,
    });

    expect(res.data.verifyUser).toEqual({
      id: '123',
      name: 'John Doe',
      is_verified: true,
    });
  });

  it('should not verify a user with incorrect inputs', async () => {
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context: () => ({
        PaystackService: {
          resolveAccountNumber: async () => ({
            status: true,
            data: { account_name: 'John Doe' },
          }),
        },
        UserRepository: {
          getUserByBankAndAccount: async () => ({
            id: '123',
            name: 'John Doe',
            is_verified: false,
          }),
          updateUser: async () => ({
            id: '123',
            name: 'John Doe',
            is_verified: false,
          }),
        },
        computeLevenshteinDistance: (s1: string, s2: string) => 2,
      }),
    });

    const { mutate } = createTestClient(server);
    const res = await mutate({
      mutation: `
        mutation {
          verifyUser(
            user_account_number: "1234567890",
            user_bank_code: "056",
            user_account_name: "Jane Doe"
          ) {
            id
            name
            is_verified
          }
        }
      `,
    });

    expect(res.data.verifyUser).toEqual({
      id: '123',
      name: 'John Doe',
      is_verified: false,
    });
  });
});
