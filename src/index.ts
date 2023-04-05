import { ApolloServer } from "apollo-server";
import { schema } from "./schema";
import { typeDefs } from "./schema";
import { resolvers } from "./resolvers";

const server = new ApolloServer({ typeDefs, resolvers, schema });

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
