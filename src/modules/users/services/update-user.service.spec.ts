import { BadRequestException, ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { UpdateUserService } from './update-user.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockResolvedValue('new-hash'),
}));

describe('UpdateUserService', () => {
  let service: UpdateUserService;

  const userMockRepository = {
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateUserService,
        {
          provide: IUserRepository,
          useValue: userMockRepository,
        },
      ],
    }).compile();

    service = module.get(UpdateUserService);
    jest.clearAllMocks();
  });

  it('should update user and omit password hash from response', async () => {
    const id = 'uuid-1';
    const dto: UpdateUserDto = { name: 'Novo nome' };

    const stored = {
      id,
      username: 'user',
      email: 'user@example.com',
      name: 'Novo nome',
      passwordHash: 'hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userMockRepository.update.mockResolvedValue(stored);

    const result = await service.execute(id, dto);

    expect(userMockRepository.update).toHaveBeenCalledWith(id, {
      name: 'Novo nome',
    });
    expect(result).not.toHaveProperty('passwordHash');
    expect(result.name).toBe('Novo nome');
  });

  it('should hash password when provided', async () => {
    const id = 'uuid-1';
    const dto: UpdateUserDto = { password: 'novaSenha12' };

    const stored = {
      id,
      username: 'user',
      email: 'user@example.com',
      name: null,
      passwordHash: 'new-hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userMockRepository.update.mockResolvedValue(stored);

    await service.execute(id, dto);

    expect(bcrypt.hash).toHaveBeenCalledWith('novaSenha12', 10);
    expect(userMockRepository.update).toHaveBeenCalledWith(id, {
      passwordHash: 'new-hash',
    });
  });

  it('should throw BadRequestException when no fields to update', async () => {
    await expect(service.execute('uuid-1', {})).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(userMockRepository.update).not.toHaveBeenCalled();
  });

  it('should throw ConflictException on unique constraint violation', async () => {
    userMockRepository.update.mockRejectedValue({ code: 'P2002' });

    await expect(
      service.execute('uuid-1', { email: 'taken@example.com' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });
});
