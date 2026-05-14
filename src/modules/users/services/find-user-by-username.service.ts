import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { PublicUser, toPublicUser } from '../utils/public-user.util';

@Injectable()
export class FindUserByUsernameService {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(username: string): Promise<PublicUser> {
    const user = await this.userRepository.findByUsername(username);
    return toPublicUser(user);
  }
}
