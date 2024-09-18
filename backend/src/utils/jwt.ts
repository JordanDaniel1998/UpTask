import jwt from "jsonwebtoken";
import { Types } from "mongoose";

type generateJWTProps = {
  id: Types.ObjectId;
};

export const generateJWT = (payload: generateJWTProps) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  return token;
};
