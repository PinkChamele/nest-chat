import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateMessageDto } from './dto/create-message.dto';
import { Message, MessageDocument } from './schemas/messages.schema';

@Injectable()
export class MessagesService {
  constructor(
    @InjectModel(Message.name) private messageModel: Model<MessageDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<MessageDocument> {
    const newMessage = new this.messageModel(createMessageDto);
    return newMessage.save();
  }

  async getById(messageId: Types.ObjectId): Promise<Message> {
    return this.messageModel.findById(messageId).lean().exec();
  }

  async getAllByRoomId(room: Types.ObjectId): Promise<Message[]> {
    return this.messageModel.find({ room }).lean().exec();
  }
}
