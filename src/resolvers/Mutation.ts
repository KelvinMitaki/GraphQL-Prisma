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
  updatePost(
    parent: any,
    args: {
      id: string;
      data: { title?: string; body?: string; published?: boolean };
    },
    ctx: Context,
    info: any
  ) {
    const postIndx = ctx.posts.findIndex(pst => pst.id === args.id);
    if (postIndx === -1) {
      throw new Error("No post with that id");
    }
    const originalPost = ctx.posts[postIndx];
    ctx.posts[postIndx] = { ...ctx.posts[postIndx], ...args.data };
    if (typeof args.data.published === "boolean") {
      if (originalPost.published && !ctx.posts[postIndx].published) {
        ctx.pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost
          }
        });
      }
      if (!originalPost.published && ctx.posts[postIndx].published) {
        ctx.pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: ctx.posts[postIndx]
          }
        });
      }
    } else {
      ctx.pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: ctx.posts[postIndx]
        }
      });
    }
    return ctx.posts[postIndx];
  },
  deletePost(parent: any, args: { id: string }, ctx: Context, info: any) {
    const postIndx = ctx.posts.findIndex(pst => pst.id === args.id);
    if (postIndx === -1) {
      throw new Error("No post with that ID");
    }
    const [deletedPost] = ctx.posts.splice(postIndx, 1);
    ctx.comments = ctx.comments.filter(cmt => cmt.post !== args.id);
    ctx.pubsub.publish("post", {
      post: {
        mutation: "DELETED",
        data: deletedPost
      }
    });
    return deletedPost;
  },
  createComment(
    parent: any,
    args: { data: { text: string; author: string; post: string } },
    ctx: Context,
    info: any
  ) {
    const postExists = ctx.posts.some(
      pst => pst.id === args.data.post && pst.published
    );
    const authorExists = ctx.users.some(usr => usr.id === args.data.author);
    if (!postExists || !authorExists) {
      throw new Error("post or author doesnot exist");
    }
    const comment: typeof comments[0] = {
      id: v1(),
      ...args.data
    };
    ctx.comments.push(comment);
    ctx.pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment
      }
    });
    return comment;
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
