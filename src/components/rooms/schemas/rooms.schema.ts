import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/components/users/schemas/users.schema';

export type RoomDocument = Room & Document;

@Schema()
export class Room {
  _id: Types.ObjectId;

  @Prop()
  name: string;

  @Prop({ type: [Types.ObjectId], ref: 'User' })
  users: User[];
}

export const RoomSchema = SchemaFactory.createForClass(Room);
