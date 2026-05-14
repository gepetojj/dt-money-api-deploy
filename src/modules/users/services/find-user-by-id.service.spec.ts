import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { FindUserByIdService } from './find-user-by-id.service';

describe('FindUserByIdService', () => {
  let service: FindUserByIdService;

  const userMockRepository = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByIdService,
        {
          provide: IUserRepository,
          useValue: userMockRepository,
        },
      ],
    }).compile();

    service = module.get(FindUserByIdService);
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

    userMockRepository.findById.mockResolvedValue(stored);

    const result = await service.execute('uuid-1');

    expect(userMockRepository.findById).toHaveBeenCalledWith('uuid-1');
    expect(result).not.toHaveProperty('passwordHash');
    expect(result.id).toBe('uuid-1');
  });
});
