import { ObjectId } from 'mongoose';

export default class CreateUserDto {
  readonly login: string;

  readonly password: ObjectId;
}
