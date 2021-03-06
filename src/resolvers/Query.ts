import { comments, Context, posts, users } from "../db";
import getUserId from "../utils/getUserId";

type OpArgs = { [key: string]: string | any };

const Query = {
  users(
    parent: any,
    args: { query?: string; first?: number; skip?: number; after?: string },
    ctx: Context,
    info: any
  ) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after
    } as OpArgs;
    if (args.query) {
      opArgs.where = {
        name_contains: args.query
      };
    }
    return ctx.prisma.query.users(opArgs, info);
  },
  myPosts(
    parent: any,
    args: { query?: string; first?: number; skip?: number; after?: string },
    ctx: Context,
    info: any
  ) {
    const userId = getUserId(ctx.request);
    const opArgs = {
      where: { author: { id: userId } },
      first: args.first,
      skip: args.skip,
      after: args.after
    } as OpArgs;
    if (args.query) {
      opArgs.where = {
        ...opArgs.where,
        OR: [{ title_contains: args.query }, { body_contains: args.query }]
      };
    }
    return ctx.prisma.query.posts(opArgs, info);
  },
  posts(
    parent: any,
    args: { query?: string; first?: number; skip?: number; after?: string },
    ctx: Context,
    info: any
  ) {
    const opArgs = {
      where: { published: true },
      first: args.first,
      skip: args.skip,
      after: args.after
    } as OpArgs;
    if (args.query) {
      opArgs.where = {
        ...opArgs.where,
        OR: [{ title_contains: args.query }, { body_contains: args.query }]
      };
    }
    return ctx.prisma.query.posts(opArgs, info);
  },
  comments(
    parent: any,
    args: { query?: string; first?: number; skip?: number; after?: string },
    ctx: Context,
    info: any
  ) {
    const opArgs = {
      first: args.first,
      skip: args.skip,
      after: args.after
    } as OpArgs;
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
  me(parent: any, args: any, ctx: Context, info: any) {
    const userId = getUserId(ctx.request);
    return ctx.prisma.query.user({ where: { id: userId } }, info);
  },
  async post(parent: any, args: { id: string }, ctx: Context, info: any) {
    const userId = getUserId(ctx.request, false);
    const post = await ctx.prisma.query.posts(
      {
        where: {
          id: args.id,
          OR: [{ author: { id: userId } }, { published: true }]
        }
      },
      info
    );
    if (!post || (post && post.length === 0)) {
      throw new Error("No post with that id");
    }
    return post[0];
  }
};

export default Query;
