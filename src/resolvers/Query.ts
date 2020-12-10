import { comments, Context, posts, users } from "../db";
import getUserId from "../utils/getUserId";

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
        OR: [
          { text_contains: args.query }
          // {
          //   author: {
          //     OR: [{ name_contains: args.query, email_contains: args.query }]
          //   }
          // }
        ]
      };
    }
    return ctx.prisma.query.comments(opArgs, info);
  },
  user(
    parent: any,
    args: { query: { email?: string; id?: string } },
    ctx: Context,
    info: any
  ) {
    return ctx.prisma.query.user({ where: args.query }, info);
  },
  me() {
    return {
      id: "123098",
      name: "kevin",
      email: "kevin@gmail.com",
      age: 21
    };
  },
  async post(parent: any, args: { id: string }, ctx: Context, info: any) {
    const userId = getUserId(ctx.request, false);

    const post = await ctx.prisma.query.post({ where: { id: args.id } });

    if (userId) {
      return post;
    }
    if (!userId && !post.published) {
      throw new Error("No post with that id");
    }
    return post;
  }
};

export default Query;
