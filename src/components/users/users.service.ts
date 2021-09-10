import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/users.schema';
import * as bcrypt from 'bcrypt';
import { PublicUser } from './types/public-user.class';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // empty line after var
    const newUser = new this.userModel(createUserDto);
    newUser.password = await bcrypt.hash(newUser.password, 13);
    // empty line before return
    return newUser.save();
  }

  async getById(userId: Types.ObjectId): Promise<User> {
    return this.userModel.findById(userId).lean().exec();
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email }).lean().exec();
  }

  // no arguments types
  async updatePasswordByEmail(email, password): Promise<PublicUser> {
    const passwordHash = await bcrypt.hash(password, 13);
    // different style
    return this.userModel
      .findOneAndUpdate({ email }, { password: passwordHash })
      .lean()
      .exec();
  }
}
