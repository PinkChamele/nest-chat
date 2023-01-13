/* eslint-disable no-underscore-dangle */
import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { Types } from 'mongoose';
import ParseObjectIdPipe from 'src/components/common/pipes/parse-object-id-pipe';
import CreateRoomDto from './dto/create-room.dto';
import { Room } from './schemas/rooms.schema';
import RoomsService from './rooms.service';
import JoinRoomDto from './dto/add-user.dto';
import { User } from '../users/schemas/users.schema';
import LoginGuard from '../common/guards/login.gurad';

@Controller({
  path: 'rooms',
  version: '1',
})
export default class RoomsController {
  constructor(private readonly roomsSerivce: RoomsService) {}

  @Post()
  @UseGuards(LoginGuard)
  async create(
    @Body() createRoomDto: CreateRoomDto,
    @Session() { user }: { user: User },
  ): Promise<Room[]> {
    const room = await this.roomsSerivce.create(createRoomDto);

    await this.roomsSerivce.addUser(room._id, user._id);

    return this.roomsSerivce.getAllByUser(new Types.ObjectId(user._id));
  }

  @Post('join')
  @UseGuards(LoginGuard)
  async join(
    @Body() joinRoomDto: JoinRoomDto,
    @Session() { user }: { user: User },
  ): Promise<Room[]> {
    await this.roomsSerivce.addUser(joinRoomDto.roomId, user._id);

    return this.roomsSerivce.getAllByUser(new Types.ObjectId(user._id));
  }

  @Get('getAll')
  @UseGuards()
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
  async getByUser(@Session() { user }: { user: User }): Promise<Room[]> {
    return this.roomsSerivce.getAllByUser(new Types.ObjectId(user._id));
  }
}
