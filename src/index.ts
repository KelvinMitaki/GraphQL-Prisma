import { GraphQLServer, PubSub } from "graphql-yoga";
import { comments, posts, users } from "./db";
import { prisma } from "./prisma";
import { fragmentReplacements, resolvers } from "./resolvers";

const pubsub = new PubSub();
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context(request) {
    return {
      comments,
      posts,
      users,
      pubsub,
      prisma,
      request
    };
  },
  // @ts-ignore
  fragmentReplacements
});

server.start((): void => {
  console.log("the server is up");
});
