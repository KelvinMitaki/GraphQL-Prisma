import { Context, users } from "../db";

const User = {
  posts(parent: typeof users[0], args: any, ctx: Context, info: any) {
    return ctx.posts.filter(pst => pst.author === parent.id);
  },
  comments(parent: typeof users[0], args: any, ctx: Context, info: any) {
    return ctx.comments.filter(cmt => cmt.author === parent.id);
  }
};

export default User;
