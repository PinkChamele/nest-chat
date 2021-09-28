import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import RoomsService from './rooms.service';
import RoomsController from './rooms.controller';
import { Room, RoomSchema } from './schemas/rooms.schema';

@Module({
  providers: [RoomsService],
  controllers: [RoomsController],
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  exports: [RoomsService],
})
export default class RoomsModule {}
