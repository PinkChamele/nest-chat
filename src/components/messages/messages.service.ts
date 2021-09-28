import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import CreateMessageDto from './dto/create-message.dto';
import { Message, MessageDocument } from './schemas/messages.schema';

@Injectable()
export default class MessagesService {
  constructor(
    @InjectModel(Message.name) private MessageModel: Model<MessageDocument>,
  ) {}

  async create(createMessageDto: CreateMessageDto): Promise<MessageDocument> {
    const newMessage = new this.MessageModel(createMessageDto);
    return newMessage.save();
  }

  async getById(messageId: Types.ObjectId): Promise<Message> {
    return this.MessageModel.findById(messageId).lean().exec();
  }

  async getAllByRoomId(room: Types.ObjectId): Promise<Message[]> {
    return this.MessageModel.find({ room }).lean().exec();
  }
}
