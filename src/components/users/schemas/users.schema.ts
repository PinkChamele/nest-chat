import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  _id: Types.ObjectId;

  @Prop()
  email: string;

  @Prop()
  password: string;

  // timestamp
  // createdAt updatedAt
}

export const UserSchema = SchemaFactory.createForClass(User);
