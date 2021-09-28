import { Types } from 'mongoose';

export default class AddUserDto {
  readonly userId: Types.ObjectId;

  readonly roomId: Types.ObjectId;
}
