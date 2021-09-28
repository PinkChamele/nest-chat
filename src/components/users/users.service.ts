import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import CreateUserDto from './dto/create-user.dto';
import { User, UserDocument } from './schemas/users.schema';
import { PublicUser } from './types/public-user.class';

@Injectable()
export default class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.UserModel(createUserDto);

    newUser.password = await bcrypt.hash(newUser.password, 13);

    return newUser.save();
  }

  async getById(userId: Types.ObjectId): Promise<User> {
    return this.UserModel.findById(userId).lean().exec();
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.UserModel.findOne({ email }).lean().exec();
  }

  async findOneByEmailWithPassword(email: string): Promise<User> {
    return this.UserModel.findOne({ email }, 'email password').lean().exec();
  }

  async updatePasswordByEmail(
    email: string,
    password: string,
  ): Promise<PublicUser> {
    const passwordHash = await bcrypt.hash(password, 13);

    return this.UserModel.findOneAndUpdate(
      { email },
      { password: passwordHash },
    )
      .lean()
      .exec();
  }
}
