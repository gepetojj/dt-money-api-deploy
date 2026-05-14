import { CreateUserController } from './create-user.controller';
import { DeleteUserController } from './delete-user.controller';
import { FindUserByEmailController } from './find-user-by-email.controller';
import { FindUserByIdController } from './find-user-by-id.controller';
import { FindUserByUsernameController } from './find-user-by-username.controller';
import { UpdateUserController } from './update-user.controller';

/** Rotas literais (`by-email`, `by-username`) antes de `/:id` para não serem capturadas como ID. */
export const usersControllers = [
  FindUserByEmailController,
  FindUserByUsernameController,
  FindUserByIdController,
  CreateUserController,
  UpdateUserController,
  DeleteUserController,
];
