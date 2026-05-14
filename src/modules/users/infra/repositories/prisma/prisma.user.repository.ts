import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma.service';
import {
  CreateUserRepositoryInput,
  IUserRepository,
  StoredUser,
  UpdateUserRepositoryInput,
} from '../user.repository.abstract';

@Injectable()
export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateUserRepositoryInput): Promise<StoredUser> {
    const user = await this.prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        name: data.name ?? null,
        passwordHash: data.passwordHash,
      },
    });
    return user;
  }

  async update(
    id: string,
    data: UpdateUserRepositoryInput,
  ): Promise<StoredUser> {
    await this.ensureExists(id);
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        ...(data.username !== undefined && { username: data.username }),
        ...(data.email !== undefined && { email: data.email }),
        ...(data.name !== undefined && { name: data.name }),
        ...(data.passwordHash !== undefined && {
          passwordHash: data.passwordHash,
        }),
      },
    });
    return user;
  }

  async findById(id: string): Promise<StoredUser> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async findByEmail(email: string): Promise<StoredUser> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async findByUsername(username: string): Promise<StoredUser> {
    const user = await this.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    return user;
  }

  async delete(id: string): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.user.delete({ where: { id } });
  }

  private async ensureExists(id: string): Promise<void> {
    const count = await this.prisma.user.count({ where: { id } });
    if (count === 0) {
      throw new NotFoundException('Usuário não encontrado');
    }
  }
}
