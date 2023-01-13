/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import {
  Controller,
  Get,
  Render,
  Session,
  UseGuards,
  Query,
  Post,
  Body,
  Res,
} from '@nestjs/common';
import { Types } from 'mongoose';
import LoginGuard from 'src/components/common/guards/login.gurad';
import JoinRoomDto from 'src/components/rooms/dto/add-user.dto';
import CreateRoomDto from 'src/components/rooms/dto/create-room.dto';
import RoomGuard from 'src/components/common/guards/room.gurad';
import RoomsService from 'src/components/rooms/rooms.service';
import { User } from 'src/components/users/schemas/users.schema';

@Controller('room-render')
export default class RoomRenderController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get()
  @Render('index')
  @UseGuards(LoginGuard, RoomGuard)
  async root(@Session() { user }: { user: User }, @Query('room') currentRoom) {
    const rooms = await this.roomsService.getAllByUser(
      new Types.ObjectId(user._id),
    );

    return {
      rooms,
      options: {
        currentRoom: currentRoom ?? rooms[0]?._id ?? null,
      },
    };
  }

  @Get('join-room')
  @Render('join-room')
  @UseGuards(LoginGuard)
  async joinRoom(@Session() { user }: { user: User }) {
    const rooms = await this.roomsService.getAll();
    return {
      rooms,
      userId: user._id,
    };
  }

  // @Post('addUser')
  // @UseGuards(LoginGuard)
  // async addUser(@Body() addUserDto: JoinRoomDto, @Res() res) {
  //   await this.roomsService.addUser(addUserDto.roomId, addUserDto.userId);
  //   res.redirect(`/room-render/?room=${addUserDto.roomId}`);
  // }

  @Get('create-room-form')
  @Render('create-room')
  @UseGuards(LoginGuard)
  async createRoomForm() {}

  @Post('create-room')
  @UseGuards(LoginGuard)
  async createRoom(
    @Body() createRoomDto: CreateRoomDto,
    @Res() res,
    @Session() { user }: { user: User },
  ) {
    const createdRoom = await this.roomsService.create(createRoomDto);
    await this.roomsService.addUser(createdRoom._id, user._id);
    res.redirect(`/room-render/?room=${createdRoom._id}`);
  }
}
