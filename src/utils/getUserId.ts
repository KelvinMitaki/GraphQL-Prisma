import { ContextParameters } from "graphql-yoga/dist/types";
import jwt from "jsonwebtoken";

const getUserId = (req: ContextParameters, requireAuth: boolean = true) => {
  const authHeader = req.request.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    const verified = jwt.verify(token, "jkshkjhdskjhdskewyoiuoiqw") as {
      id: string;
    };
    return verified.id;
  }
  if (requireAuth) {
    throw new Error("auth required");
  }
};

export default getUserId;
