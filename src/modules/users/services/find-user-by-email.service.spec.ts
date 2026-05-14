import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { FindUserByEmailService } from './find-user-by-email.service';

describe('FindUserByEmailService', () => {
  let service: FindUserByEmailService;

  const userMockRepository = {
    findByEmail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByEmailService,
        {
          provide: IUserRepository,
          useValue: userMockRepository,
        },
      ],
    }).compile();

    service = module.get(FindUserByEmailService);
    jest.clearAllMocks();
  });

  it('should return public user', async () => {
    const stored = {
      id: 'uuid-1',
      username: 'user',
      email: 'user@example.com',
      name: null,
      passwordHash: 'secret-hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userMockRepository.findByEmail.mockResolvedValue(stored);

    const result = await service.execute('user@example.com');

    expect(userMockRepository.findByEmail).toHaveBeenCalledWith(
      'user@example.com',
    );
    expect(result).not.toHaveProperty('passwordHash');
    expect(result.email).toBe('user@example.com');
  });
});
