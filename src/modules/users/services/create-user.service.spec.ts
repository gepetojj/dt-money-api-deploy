import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/create-user.dto';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { CreateUserService } from './create-user.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

describe('CreateUserService', () => {
  let service: CreateUserService;

  const userMockRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateUserService,
        {
          provide: IUserRepository,
          useValue: userMockRepository,
        },
      ],
    }).compile();

    service = module.get(CreateUserService);
    jest.clearAllMocks();
  });

  it('should hash password and create user', async () => {
    const dto: CreateUserDto = {
      username: 'joaosilva',
      email: 'joao@example.com',
      name: 'João',
      password: 'secret123',
    };

    const stored = {
      id: 'uuid-1',
      username: dto.username,
      email: dto.email,
      name: dto.name ?? null,
      passwordHash: 'hashed-password',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userMockRepository.create.mockResolvedValue(stored);

    const result = await service.execute(dto);

    expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
    expect(userMockRepository.create).toHaveBeenCalledWith({
      username: dto.username,
      email: dto.email,
      name: dto.name,
      passwordHash: 'hashed-password',
    });
    expect(result).toEqual({
      id: stored.id,
      username: stored.username,
      email: stored.email,
      name: stored.name,
      createdAt: stored.createdAt,
      updatedAt: stored.updatedAt,
    });
    expect(result).not.toHaveProperty('passwordHash');
  });

  it('should throw ConflictException on unique constraint violation', async () => {
    const dto: CreateUserDto = {
      username: 'dup',
      email: 'dup@example.com',
      password: 'secret1234',
    };

    userMockRepository.create.mockRejectedValue({ code: 'P2002' });

    await expect(service.execute(dto)).rejects.toBeInstanceOf(
      ConflictException,
    );
  });
});
