import { comments, posts, users } from "../db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Context } from "../db";
import getUserId from "../utils/getUserId";

const Mutation = {
  async createUser(
    parent: any,
    args: {
      data: { name: string; email: string; age: number; password: string };
    },
    ctx: Context,
    info: any
  ) {
    const emailTaken = await ctx.prisma.exists.User({ email: args.data.email });
    if (emailTaken) {
      throw new Error("User with that email already exists");
    }
    if (args.data.password.trim().length < 6) {
      throw new Error("password must be atleast six characters");
    }
    args.data.password = await bcrypt.hash(args.data.password, 10);
    const user = await ctx.prisma.mutation.createUser({ data: args.data });
    return {
      user,
      token: jwt.sign({ id: user.id }, "jkshkjhdskjhdskewyoiuoiqw")
    };
  },
  async login(
    parent: any,
    args: { data: { email: string; password: string } },
    ctx: Context,
    info: any
  ) {
    const user = await ctx.prisma.query.user({
      where: { email: args.data.email }
    });
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isMatch = await bcrypt.compare(args.data.password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    return {
      user,
      token: jwt.sign({ id: user.id }, "jkshkjhdskjhdskewyoiuoiqw")
    };
  },
  async updateUser(
    parent: any,
    args: {
      data: { name?: string; email?: string; age?: number; password?: string };
    },
    ctx: Context,
    info: any
  ) {
    const userId = getUserId(ctx.request);
    if (args.data.password) {
      args.data.password = await bcrypt.hash(args.data.password, 10);
    }
    return ctx.prisma.mutation.updateUser(
      { data: args.data, where: { id: userId } },
      info
    );
  },
  async deleteUser(parent: any, args: { id: string }, ctx: Context, info: any) {
    const userId = getUserId(ctx.request);
    return ctx.prisma.mutation.deleteUser({ where: { id: userId } }, info);
  },
  async createPost(
    parent: any,
    args: {
      data: {
        title: string;
        body: string;
        published: boolean;
      };
    },
    ctx: Context,
    info: any
  ) {
    const userId = getUserId(ctx.request);
    return ctx.prisma.mutation.createPost(
      { data: { ...args.data, author: { connect: { id: userId } } } },
      info
    );
  },
  async updatePost(
    parent: any,
    args: {
      id: string;
      data: { title?: string; body?: string; published?: boolean };
    },
    ctx: Context,
    info: any
  ) {
    const userId = getUserId(ctx.request);
    const postExists = await ctx.prisma.exists.Post({
      id: args.id,
      author: { id: userId }
    });
    if (!postExists) {
      throw new Error("No post with that ID");
    }
    return ctx.prisma.mutation.updatePost(
      { where: { id: args.id }, data: args.data },
      info
    );
  },
  async deletePost(parent: any, args: { id: string }, ctx: Context, info: any) {
    const userId = getUserId(ctx.request);
    const postExists = await ctx.prisma.exists.Post({
      id: args.id,
      author: { id: userId }
    });
    if (!postExists) {
      throw new Error("No post with that ID");
    }
    return ctx.prisma.mutation.deletePost({ where: { id: args.id } }, info);
  },
  async createComment(
    parent: any,
    args: { data: { text: string; post: string } },
    ctx: Context,
    info: any
  ) {
    const postExists = await ctx.prisma.exists.Post({
      id: args.data.post,
      published: true
    });
    if (!postExists) {
      throw new Error("post or author doesnot exist");
    }
    const userId = getUserId(ctx.request);
    return ctx.prisma.mutation.createComment(
      {
        data: {
          ...args.data,
          author: { connect: { id: userId } },
          post: { connect: { id: args.data.post } }
        }
      },
      info
    );
  },
  async updateComment(
    parent: any,
    args: { id: string; data: { text: string } },
    ctx: Context,
    info: any
  ) {
    const userId = getUserId(ctx.request);
    const commentExists = await ctx.prisma.exists.Comment({
      id: args.id,
      author: { id: userId }
    });
    if (!commentExists) {
      throw new Error("Comment not found");
    }
    return ctx.prisma.mutation.updateComment(
      { where: { id: args.id }, data: args.data },
      info
    );
  },
  async deleteComment(
    parent: any,
    args: { id: string },
    ctx: Context,
    info: any
  ) {
    const userId = getUserId(ctx.request);
    const commentExists = await ctx.prisma.exists.Comment({
      id: args.id,
      author: { id: userId }
    });
    if (!commentExists) {
      throw new Error("No comment with that id");
    }
    return ctx.prisma.mutation.deleteComment({ where: { id: args.id } }, info);
  }
};

export default Mutation;
