import mongoose, { Document, Schema, Types } from "mongoose";

export interface IToken extends Document {
  token: string;
  user: Types.ObjectId;
  createdAt: Date;
}

export const TokenSchema: Schema = new Schema({
  token: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    expires: "10m",
  },
});

const Token = mongoose.model<IToken>("Token", TokenSchema);
export default Token;
