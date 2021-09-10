import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { RoomsService } from '../rooms.service';

@Injectable()
export class RoomGuard implements CanActivate {
  constructor(private readonly roomsService: RoomsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(
      request,
      await this.roomsService.getUnpopulatedById(
        new Types.ObjectId(request.query.room),
      ),
    );
  }
}

// argument types
function validateRequest(request: any, room): boolean {
  const userId = new Types.ObjectId(request.session.user._id);
  const doesIcludeUser = room
    ? room.users.some(function (user) {
        return user.equals(userId);
      })
    : true;

  if (doesIcludeUser) {
    return true;
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
