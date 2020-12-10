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
  }
};

export default User;
