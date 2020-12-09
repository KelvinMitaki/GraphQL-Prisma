import { PubSub } from "graphql-yoga";
import { Prisma } from "prisma-binding";

let users = [
  {
    id: "123098",
    name: "kevin",
    email: "kevin@gmail.com",
    age: 21
  },
  {
    id: "1298",
    name: "wezo",
    email: "wezo@gmail.com",
    age: 26
  },
  {
    id: "128",
    name: "brian",
    email: "brian@gmail.com",
    age: 22
  }
];
let posts = [
  {
    id: "jkhkj132",
    title: "First blog",
    body: "This is the first blog",
    published: true,
    author: "123098"
  },
  {
    id: "jkj132",
    title: "Second blog",
    body: "This is the second blog",
    published: false,
    author: "1298"
  },
  {
    id: "132",
    title: "last blog",
    body: "This is the last blog",
    published: true,
    author: "123098"
  }
];
let comments = [
  {
    id: "jkhkj13",
    text: "this is the First comment",
    author: "1298",
    post: "jkhkj132"
  },
  {
    id: "jkj13",
    text: "this is the Second comment",
    author: "1298",
    post: "jkj132"
  },
  {
    id: "123",
    text: "this is the third comment",
    author: "128",
    post: "jkhkj132"
  },
  {
    id: "13",
    text: "this is the last comment",
    author: "123098",
    post: "132"
  }
];

export interface Context {
  comments: typeof comments;
  posts: typeof posts;
  users: typeof users;
  pubsub: PubSub;
  prisma: Prisma;
}

export { users, comments, posts };
