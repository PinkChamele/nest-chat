import { Module } from '@nestjs/common';
import { RoomsModule } from 'src/components/rooms/rooms.module';
import { RoomRenderController } from './room-render.controller';

@Module({
  imports: [RoomsModule],
  controllers: [RoomRenderController],
})
export class RoomRenderModule {}
