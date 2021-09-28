import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, UpdateWriteOpResult } from 'mongoose';
import CreateRoomDto from './dto/create-room.dto';
import { Room, RoomDocument } from './schemas/rooms.schema';

@Injectable()
export default class RoomsService {
  constructor(@InjectModel(Room.name) private RoomModel: Model<RoomDocument>) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    const newRoom = new this.RoomModel(createRoomDto);
    return newRoom.save();
  }

  async getById(roomId: Types.ObjectId): Promise<Room> {
    return this.RoomModel.findById(roomId).populate('users').lean().exec();
  }

  async getUnpopulatedById(roomId: Types.ObjectId): Promise<Room> {
    return this.RoomModel.findById(roomId).lean().exec();
  }

  async addUser(
    roomId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<UpdateWriteOpResult> {
    return this.RoomModel.updateOne(
      { _id: roomId },
      { $addToSet: { users: userId } },
    );
  }

  async getAllByUser(userId: Types.ObjectId): Promise<Room[]> {
    return this.RoomModel.aggregate([
      { $match: { users: userId } },
      {
        $lookup: {
          from: 'users',
          localField: 'users',
          foreignField: '_id',
          as: 'users',
        },
      },
    ]);
    /*
      .find({ users: { $in: [userId as any] } })
      .populate('users', { password: -1 })
      .lean()
      .exec();
    */
  }

  async getAll(): Promise<Room[]> {
    return this.RoomModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'users',
          foreignField: '_id',
          as: 'users',
        },
      },
    ]);
  }
}
