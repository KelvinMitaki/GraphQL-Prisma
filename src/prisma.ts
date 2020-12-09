import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
});

export { prisma };

// const createPostForUser = async (
//   data: { title: string; body: string; published: boolean },
//   authorId: string
// ) => {
//   const exists = await prisma.exists.User({ id: authorId });
//   if (!exists) {
//     throw new Error("User not found");
//   }
//   const post = await prisma.mutation.createPost(
//     { data: { ...data, author: { connect: { id: authorId } } } },
//     "{author{id name email posts{id title body published}}}"
//   );

//   return post;
// };
// createPostForUser(
//   {
//     title: "new post",
//     body: "this is a new post for a user",
//     published: false
//   },
//   "ckih58pi800dl08840dcy3mlc"
// )
//   .then(user => console.log(JSON.stringify(user, null, 2)))
//   .catch(err => console.log(err));

// const updatePostForUser = async (
//   data: { body: string; title: string },
//   postId: string
// ) => {
//   const postExists = await prisma.exists.Post({ id: postId });
//   if (!postExists) {
//     throw new Error("no post with that id");
//   }
//   const post = await prisma.mutation.updatePost(
//     { data, where: { id: postId } },
//     "{author{id name email posts{id title body}}}"
//   );
//   return post;
// };

// updatePostForUser(
//   { title: "second post", body: "this is the second post" },
//   "ckihb4ckx00o2088458lkibk"
// )
//   .then(data => console.log(JSON.stringify(data, null, 2)))
//   .catch(err => console.log(err.message));
