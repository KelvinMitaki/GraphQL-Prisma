import { ContextParameters } from "graphql-yoga/dist/types";
import jwt from "jsonwebtoken";

const getUserId = (req: ContextParameters) => {
  const authHeader = req.request.headers.authorization;
  if (!authHeader) {
    throw new Error("auth required");
  }
  const token = authHeader.split(" ")[1];
  const verified = jwt.verify(token, "jkshkjhdskjhdskewyoiuoiqw") as {
    id: string;
  };
  return verified.id;
};
