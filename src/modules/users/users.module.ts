import { Module } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma.service';
import { PrismaUserRepository } from './infra/repositories/prisma/prisma.user.repository';
import { IUserRepository } from './infra/repositories/user.repository.abstract';
import { userServices } from './services';
import { usersControllers } from './controllers';

@Module({
  controllers: [...usersControllers],
  providers: [
    PrismaService,
    {
      provide: IUserRepository,
      useClass: PrismaUserRepository,
    },
    ...userServices,
  ],
})
export class UsersModule {}
