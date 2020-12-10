import { Context, users } from "../db";
import getUserId from "../utils/getUserId";

const User = {
  async email(parent: any, args: any, ctx: Context, info: any) {
    const userId = getUserId(ctx.request, false);
    if (parent.id && userId && parent.id === userId) {
      return parent.email;
    }
    if (userId && !parent.id) {
      const user = await ctx.prisma.query.user({ where: { id: userId } });
      if (user.email === parent.email) {
        return parent.email;
      }
      return null;
    }
    return null;
  }
};

export default User;
