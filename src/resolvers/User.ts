import { Context, users } from "../db";
import getUserId from "../utils/getUserId";

const User = {
  email: {
    fragment: "fragment userId on User { id }",
    async resolve(parent: any, args: any, ctx: Context, info: any) {
      const userId = getUserId(ctx.request, false);
      if (parent.id && userId && parent.id === userId) {
        return parent.email;
      }
      return null;
    }
  },
  posts: {
    fragment: "fragment userId on User { id }",
    async resolve(parent: any, args: any, ctx: Context, info: any) {
      const userId = getUserId(ctx.request, false);
      if (userId && userId === parent.id) {
        return ctx.prisma.query.posts({ where: { author: { id: parent.id } } });
      }
      return ctx.prisma.query.posts({
        where: { author: { id: parent.id }, published: true }
      });
    }
  }
};

export default User;
