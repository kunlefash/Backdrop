import { makeExecutableSchema } from "graphql-tools";
import { resolvers } from "./resolvers";

const typeDefs = `
  type User {
    id: ID!
    name: String!
    bankCode: String!
    accountNumber: String!
    isVerified: Boolean!
  }

  type Query {
    accountName(bankCode: String!, accountNumber: String!): String!
  }

  type Mutation {
    verifyUser(
      accountNumber: String!
      bankCode: String!
      accountName: String!
    ): User!
  }
`;

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export { typeDefs };
