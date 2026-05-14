import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { FindUserByUsernameService } from './find-user-by-username.service';

describe('FindUserByUsernameService', () => {
  let service: FindUserByUsernameService;

  const userMockRepository = {
    findByUsername: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FindUserByUsernameService,
        {
          provide: IUserRepository,
          useValue: userMockRepository,
        },
      ],
    }).compile();

    service = module.get(FindUserByUsernameService);
    jest.clearAllMocks();
  });

  it('should return public user', async () => {
    const stored = {
      id: 'uuid-1',
      username: 'joaosilva',
      email: 'joao@example.com',
      name: null,
      passwordHash: 'secret-hash',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    userMockRepository.findByUsername.mockResolvedValue(stored);

    const result = await service.execute('joaosilva');

    expect(userMockRepository.findByUsername).toHaveBeenCalledWith('joaosilva');
    expect(result).not.toHaveProperty('passwordHash');
    expect(result.username).toBe('joaosilva');
  });
});
