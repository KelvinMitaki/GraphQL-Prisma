import { Context } from "../db";

const Subscription = {
  comment: {
    subscribe(parent: any, args: { id: string }, ctx: Context, info: any) {
      return ctx.prisma.subscription.comment(
        {
          where: {
            node: {
              post: {
                id: args.id
              }
            }
          }
        },
        info
      );
    }
  },
  post: {
    subscribe(parent: any, args: any, ctx: Context, info: any) {
      return ctx.pubsub.asyncIterator(`post`);
    }
  }
};

export default Subscription;
