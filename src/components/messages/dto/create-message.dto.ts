import { Types } from 'mongoose';

export default class CreateMessageDto {
  readonly text: string;

  readonly author: Types.ObjectId;

  readonly room: Types.ObjectId;
}
