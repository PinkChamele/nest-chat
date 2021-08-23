import { User } from '../schemas/users.schema';

export type PublicUser = Omit<User, 'password'>;
