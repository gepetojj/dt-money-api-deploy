import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { PublicUser, toPublicUser } from '../utils/public-user.util';

@Injectable()
export class FindUserByEmailService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string): Promise<PublicUser> {
    const user = await this.userRepository.findByEmail(email);
    return toPublicUser(user);
  }
}
