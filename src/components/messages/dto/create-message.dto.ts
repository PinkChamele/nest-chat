import { Types } from 'mongoose';

export class CreateMessageDto {
  readonly text: string;

  readonly author: Types.ObjectId;

  readonly room: Types.ObjectId;

  readonly date: Date;
}
