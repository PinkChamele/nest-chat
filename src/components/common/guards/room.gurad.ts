/* eslint-disable no-underscore-dangle */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import RoomsService from '../../rooms/rooms.service';
import { Room } from '../../rooms/schemas/rooms.schema';

function isRoomMember(request: any, room: Room): boolean {
  const userId = new Types.ObjectId(request.session.user._id);
  const includesUser = room?.users.some((user) => {
    return user._id.equals(userId);
  });

  if (includesUser) {
    return includesUser;
  }
  throw new ForbiddenException();
}

/* const doesIcludeUser = room?.users.some(function (user) {
  return user.equals(userId);
});

if (doesIcludeUser) {
  return doesIcludeUser;
} else {
  throw new ForbiddenException();
} */

@Injectable()
export default class RoomGuard implements CanActivate {
  constructor(private readonly roomsService: RoomsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return request.query.room
      ? isRoomMember(
          request,
          await this.roomsService.getUnpopulatedById(
            Types.ObjectId(request.query.room),
          ),
        )
      : true;
  }
}
