/* eslint-disable no-underscore-dangle */
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Types } from 'mongoose';
import { Socket } from 'socket.io';
import ParseObjectIdPipe from 'src/components/common/pipes/parse-object-id-pipe';
import CreateMessageDto from './dto/create-message.dto';
import MessagesService from './messages.service';

@WebSocketGateway()
export default class MessagesGateway {
  constructor(private readonly messagesSerivce: MessagesService) {}

  @WebSocketServer()
  server;

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @MessageBody() message: CreateMessageDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    try {
      const newMessage = await this.messagesSerivce.create({
        ...message,
        room: message.room,
      });

      this.server.emit(
        'message',
        await this.messagesSerivce.getById(newMessage._id),
      );
    } catch (exception) {
      client.emit('error');
    }
  }

  @SubscribeMessage('getAllMessages')
  async getAllMessages(
    @MessageBody('room', ParseObjectIdPipe) room: Types.ObjectId,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const messages = await this.messagesSerivce.getAllByRoomId(room);
    client.emit('allMessages', messages);
  }
}
