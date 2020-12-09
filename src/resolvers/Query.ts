import { comments, Context, posts, users } from "../db";

type OpArgs = { [key: string]: string | any };

const Query = {
  users(parent: any, args: { query?: string }, ctx: Context, info: any) {
    const opArgs = {} as OpArgs;
    if (args.query) {
      opArgs.where = {
        OR: [{ name_contains: args.query }, { email_contains: args.query }]
      };
    }
    return ctx.prisma.query.users(opArgs, info);
  },
  posts(parent: any, args: { query?: string }, ctx: Context, info: any) {
    const opArgs = {} as OpArgs;
    if (args.query) {
      opArgs.where = {
        OR: [{ title_contains: args.query }, { body_contains: args.query }]
      };
    }
    return ctx.prisma.query.posts(opArgs, info);
  },
  comments(parent: any, args: { query?: string }, ctx: Context, info: any) {
    const opArgs = {} as OpArgs;
    if (args.query) {
      opArgs.where = {
        OR: [{ text_contains: args.query }, { author_contains: args.query }]
      };
    }
    return ctx.prisma.query.comments(opArgs, info);
  },
  me() {
    return {
      id: "123098",
      name: "kevin",
      email: "kevin@gmail.com",
      age: 21
    };
  },
  post() {
    return {
      id: "jkhkj132",
      title: "First blog",
      body: "This is the first blog",
      published: true
    };
  }
};

export default Query;
