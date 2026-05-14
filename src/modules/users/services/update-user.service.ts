import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { PublicUser, toPublicUser } from '../utils/public-user.util';

const BCRYPT_SALT_ROUNDS = 10;

function isPrismaUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code: string }).code === 'P2002'
  );
}

@Injectable()
export class UpdateUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, data: UpdateUserDto): Promise<PublicUser> {
    const payload: {
      username?: string;
      email?: string;
      name?: string | null;
      passwordHash?: string;
    } = {};

    if (data.username !== undefined) payload.username = data.username;
    if (data.email !== undefined) payload.email = data.email;
    if (data.name !== undefined) payload.name = data.name;
    if (data.password !== undefined) {
      payload.passwordHash = await bcrypt.hash(
        data.password,
        BCRYPT_SALT_ROUNDS,
      );
    }

    if (Object.keys(payload).length === 0) {
      throw new BadRequestException('Informe ao menos um campo para atualizar');
    }

    try {
      const user = await this.userRepository.update(id, payload);
      return toPublicUser(user);
    } catch (error) {
      if (isPrismaUniqueViolation(error)) {
        throw new ConflictException('E-mail ou nome de usuário já cadastrado');
      }
      throw error;
    }
  }
}
