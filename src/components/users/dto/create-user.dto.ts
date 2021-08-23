import { ObjectId } from 'mongoose';

export class CreateUserDto {
  readonly login: string;

  readonly password: ObjectId;
}
