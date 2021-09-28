import { Controller, Get, Query } from '@nestjs/common';
import { Types } from 'mongoose';
import ParseObjectIdPipe from 'src/components/common/pipes/parse-object-id-pipe';
import UsersService from './users.service';

@Controller({
  path: 'users',
  version: '1',
})
export default class UsersController {
  constructor(private readonly usersSerivce: UsersService) {}

  @Get()
  async getById(@Query('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.usersSerivce.getById(id);
  }
}
