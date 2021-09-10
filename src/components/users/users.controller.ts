import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { Types } from 'mongoose';
import { ParseObjectIdPipe } from 'src/components/common/parse-object-id-pipe';

// user versions from nest
// https://docs.nestjs.com/techniques/versioning#versioning
// URI Versioning Type
@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersSerivce: UsersService) {}

  // add serialization
  // https://docs.nestjs.com/techniques/serialization
  // https://docs.nestjs.com/exception-filters
  // add all exeption filter
  @Get()
  async getById(@Query('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.usersSerivce.getById(id);
  }
}
