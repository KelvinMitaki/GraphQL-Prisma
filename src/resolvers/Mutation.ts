import { comments, posts, users } from "../db";
import { v1 } from "uuid";
import { Context } from "../db";

const Mutation = {
  async createUser(
    parent: any,
    args: { data: { name: string; email: string; age: number } },
    ctx: Context,
    info: any
  ) {
    const emailTaken = await ctx.prisma.exists.User({ email: args.data.email });
    if (emailTaken) {
      throw new Error("User with that email already exists");
    }

    return ctx.prisma.mutation.createUser({ data: args.data }, info);
  },
  async updateUser(
    parent: any,
    args: { id: string; data: { name?: string; email?: string; age?: number } },
    ctx: Context,
    info: any
  ) {
    const userExists = await ctx.prisma.exists.User({ id: args.id });
    if (!userExists) {
      throw new Error("No user with that ID");
    }
    return ctx.prisma.mutation.updateUser(
      { data: args.data, where: { id: args.id } },
      info
    );
  },
  async deleteUser(parent: any, args: { id: string }, ctx: Context, info: any) {
    const userExists = await ctx.prisma.exists.User({ id: args.id });
    if (!userExists) {
      throw new Error("No user with that id");
    }
    return ctx.prisma.mutation.deleteUser({ where: { id: args.id } }, info);
  },
  async createPost(
    parent: any,
    args: {
      data: {
        title: string;
        body: string;
        published: boolean;
        author: string;
      };
    },
    ctx: Context,
    info: any
  ) {
    const authorExists = ctx.prisma.exists.User({ id: args.data.author });
    if (!authorExists) {
      throw new Error("No author with that ID");
    }
    return ctx.prisma.mutation.createPost(
      { data: { ...args.data, author: { connect: { id: args.data.author } } } },
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
    const postExists = await ctx.prisma.exists.Post({ id: args.id });
    if (!postExists) {
      throw new Error("No post with that ID");
    }
    return ctx.prisma.mutation.updatePost(
      { where: { id: args.id }, data: args.data },
      info
    );
  },
  async deletePost(parent: any, args: { id: string }, ctx: Context, info: any) {
    const postExists = await ctx.prisma.exists.Post({ id: args.id });
    if (!postExists) {
      throw new Error("No post with that ID");
    }
    return ctx.prisma.mutation.deletePost({ where: { id: args.id } }, info);
  },
  createComment(
    parent: any,
    args: { data: { text: string; author: string; post: string } },
    ctx: Context,
    info: any
  ) {
    const postExists = ctx.prisma.exists.Post({ id: args.data.post });
    const authorExists = ctx.prisma.exists.User({ id: args.data.author });
    if (!postExists || !authorExists) {
      throw new Error("post or author doesnot exist");
    }
    return ctx.prisma.mutation.createComment({
      data: {
        ...args.data,
        author: { connect: { id: args.data.author } },
        post: { connect: { id: args.data.post } }
      }
    });
  },
  updateComment(
    parent: any,
    args: { id: string; data: { text: string } },
    ctx: Context,
    info: any
  ) {
    const cmtIndx = ctx.comments.findIndex(cmt => cmt.id === args.id);
    if (cmtIndx === -1) {
      throw new Error("Comment not found");
    }
    ctx.comments[cmtIndx].text = args.data.text;
    ctx.pubsub.publish(`comment ${ctx.comments[cmtIndx].post}`, {
      comment: {
        mutation: "UPDATED",
        data: ctx.comments[cmtIndx]
      }
    });
    return ctx.comments[cmtIndx];
  },
  deleteComment(parent: any, args: { id: string }, ctx: Context, info: any) {
    const commentIndx = ctx.comments.findIndex(cmt => cmt.id === args.id);
    if (commentIndx === -1) {
      throw new Error("No comment with that id");
    }
    const [deletedComment] = ctx.comments.splice(commentIndx, 1);
    ctx.pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment
      }
    });
    return deletedComment;
  }
};

export default Mutation;
