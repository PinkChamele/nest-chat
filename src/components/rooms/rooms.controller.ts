import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Types, UpdateWriteOpResult } from 'mongoose';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './schemas/rooms.schema';
import { RoomsService } from './rooms.service';
import { ParseObjectIdPipe } from 'src/components/common/parse-object-id-pipe';
import { AddUserDto } from './dto/add-user.dto';

@Controller('v1/rooms')
export class RoomsController {
  constructor(private readonly roomsSerivce: RoomsService) {}

  @Post()
  async create(@Body() createRoomDto: CreateRoomDto): Promise<Room> {
    return this.roomsSerivce.create(createRoomDto);
  }

  @Post('addUser')
  async addUser(@Body() addUserDto: AddUserDto): Promise<UpdateWriteOpResult> {
    return await this.roomsSerivce.addUser(
      addUserDto.roomId,
      addUserDto.userId,
    );
  }

  @Get('getAll')
  async getAll(): Promise<Room[]> {
    return this.roomsSerivce.getAll();
  }

  @Get()
  async getById(
    @Query('id', ParseObjectIdPipe) roomId: Types.ObjectId,
  ): Promise<Room> {
    return this.roomsSerivce.getById(roomId);
  }

  @Get('getAllByUser')
  async getByUser(@Query('userId', ParseObjectIdPipe) userId): Promise<Room[]> {
    return this.roomsSerivce.getAllByUser(userId);
  }
}
