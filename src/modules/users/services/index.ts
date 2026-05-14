import { CreateUserService } from './create-user.service';
import { DeleteUserService } from './delete-user.service';
import { FindUserByEmailService } from './find-user-by-email.service';
import { FindUserByIdService } from './find-user-by-id.service';
import { FindUserByUsernameService } from './find-user-by-username.service';
import { UpdateUserService } from './update-user.service';

export const userServices = [
  CreateUserService,
  UpdateUserService,
  FindUserByIdService,
  FindUserByEmailService,
  FindUserByUsernameService,
  DeleteUserService,
];
