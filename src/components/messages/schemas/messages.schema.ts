import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema({ timestamps: true })
export class Message {
  @Prop()
  text: string;

  @Prop({ ref: 'user' })
  author: Types.ObjectId;

  @Prop({ ref: 'room' })
  room: Types.ObjectId;

  @Prop({ type: Date })
  date: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
