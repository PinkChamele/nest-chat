import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/components/common/parse-object-id-pipe';

@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersSerivce: UsersService) {}

  @Get()
  async getById(@Query('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.usersSerivce.getById(id);
  }
}
