import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateWriteOpResult } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room, RoomDocument } from './schemas/rooms.schema';

@Injectable()
export class RoomsService {
  constructor(@InjectModel(Room.name) private roomModel: Model<RoomDocument>) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const newRoom = new this.roomModel(createRoomDto);
    return newRoom.save();
  }

  async getById(roomId: Types.ObjectId): Promise<Room> {
    return this.roomModel.findById(roomId).populate('users').lean().exec();
  }

  async getUnpopulatedById(roomId: Types.ObjectId): Promise<Room> {
    return this.roomModel.findById(roomId).lean().exec();
  }

  async addUser(roomId, userId): Promise<UpdateWriteOpResult> {
    /* const room = await this.roomModel.findById(roomId);

    room.users.push(userId);
    return room.save(); */
    return await this.roomModel.updateOne(
      { _id: roomId },
      { $addToSet: { users: userId } },
    );
  }

  async getAllByUser(userId): Promise<Room[]> {
    return this.roomModel
      .find({ users: userId })
      .populate('users', { password: -1 })
      .lean()
      .exec();
  }

  async getAll(): Promise<Room[]> {
    return this.roomModel
      .find()
      .populate('users', { password: -1 })
      .lean()
      .exec();
  }
}
