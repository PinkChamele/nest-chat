import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Types } from 'mongoose';
import { Socket } from 'socket.io';
import { ParseObjectIdPipe } from 'src/components/common/parse-object-id-pipe';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessagesService } from './messages.service';

@WebSocketGateway()
export class MessagesGateway {
  constructor(private readonly messagesSerivce: MessagesService) {}

  @WebSocketServer()
  server;

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() message: CreateMessageDto): Promise<void> {
    const newMessage = await this.messagesSerivce.create({
      ...message,
      room: new Types.ObjectId(message.room),
    });
    this.server.emit(
      'message',
      await this.messagesSerivce.getById(newMessage._id),
    );
    // add try catch and send error
    /* this.server.emit(
      'errorMessage',
    ); */
  }

  @SubscribeMessage('getAllMessages')
  async getAllMessages(
    @MessageBody('room', ParseObjectIdPipe) room: Types.ObjectId,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const messages = await this.messagesSerivce.getAllByRoomId(room);
    this.server.to(client.id).emit('allMessages', messages);
  }
}
