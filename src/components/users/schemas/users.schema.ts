import { Document, Types } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Exclude } from 'class-transformer';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  _id: Types.ObjectId;

  @Prop({ unique: true })
  email: string;

  @Exclude()
  @Prop({ select: false })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
