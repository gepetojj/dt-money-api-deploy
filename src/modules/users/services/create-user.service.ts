import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
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
export class CreateUserService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: CreateUserDto): Promise<PublicUser> {
    const passwordHash = await bcrypt.hash(data.password, BCRYPT_SALT_ROUNDS);
    try {
      const user = await this.userRepository.create({
        username: data.username,
        email: data.email,
        name: data.name,
        passwordHash,
      });
      return toPublicUser(user);
    } catch (error) {
      if (isPrismaUniqueViolation(error)) {
        throw new ConflictException('E-mail ou nome de usuário já cadastrado');
      }
      throw error;
    }
  }
}
