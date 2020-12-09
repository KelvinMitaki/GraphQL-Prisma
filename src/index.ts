import { GraphQLServer, PubSub } from "graphql-yoga";
import { comments, posts, users } from "./db";
import Comment from "./resolvers/Comment";
import Mutation from "./resolvers/Mutation";
import Post from "./resolvers/Post";
import Query from "./resolvers/Query";
import Subscription from "./resolvers/Subcsription";
import User from "./resolvers/User";

const pubsub = new PubSub();
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  context: {
    comments,
    posts,
    users,
    pubsub
  }
});

server.start((): void => {
  console.log("the server is up");
});
