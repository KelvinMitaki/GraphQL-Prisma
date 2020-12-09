import { Prisma } from "prisma-binding";

const prisma = new Prisma({
  typeDefs: "src/generated/prisma.graphql",
  endpoint: "http://localhost:4466"
});
prisma.query
  .users({}, "{id name posts {id title}}")
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.log(err));
prisma.query
  .comments({}, "{id text author {id name}}")
  .then(data => console.log(JSON.stringify(data, null, 2)))
  .catch(err => console.log(err));
