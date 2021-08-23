import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesGateway } from './messages.gateway';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { Message, MessageSchema } from './schemas/messages.schema';

@Module({
  providers: [MessagesService, MessagesGateway],
  imports: [
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }]),
  ],
})
export class MessagesModule {}
