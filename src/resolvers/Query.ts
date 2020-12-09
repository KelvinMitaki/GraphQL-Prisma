import { comments, Context, posts, users } from "../db";

const Query = {
  users(parent: any, args: { query?: string }, ctx: Context, info: any) {
    // if (!args.query) {
    //   return users;
    // }
    // return ctx.users.filter(usr =>
    //   usr.name.toLowerCase().includes(args.query!.toLowerCase())
    // );
    return ctx.prisma.query.users(undefined, info);
  },
  posts(parent: any, args: { query?: string }, ctx: Context, info: any) {
    if (!args.query) {
      return posts;
    }
    return ctx.posts.filter(
      pst =>
        pst.title.toLowerCase().includes(args.query!.toLowerCase()) ||
        pst.body.toLowerCase().includes(args.query!.toLowerCase())
    );
  },
  comments(parent: any, args: { query?: string }, ctx: Context, info: any) {
    if (!args.query) {
      return comments;
    }
    return ctx.comments.filter(
      cmt =>
        cmt.text.toLowerCase().includes(args.query!.toLowerCase()) ||
        cmt.author.toLowerCase().includes(args.query!.toLowerCase())
    );
  },
  me() {
    return {
      id: "123098",
      name: "kevin",
      email: "kevin@gmail.com",
      age: 21
    };
  },
  post() {
    return {
      id: "jkhkj132",
      title: "First blog",
      body: "This is the first blog",
      published: true
    };
  }
};

export default Query;
