import { Context } from "../db";
import { comments, posts, users } from "../db";

const Comment = {
  author(parent: typeof comments[0], args: any, ctx: Context, info: any) {
    return ctx.users.find(usr => usr.id === parent.author);
  },
  post(parent: typeof comments[0], args: any, ctx: Context, info: any) {
    return ctx.posts.find(pst => pst.id === parent.post);
  }
};

export default Comment;
