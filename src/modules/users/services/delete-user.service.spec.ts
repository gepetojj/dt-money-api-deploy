import { Test, TestingModule } from '@nestjs/testing';
import { IUserRepository } from '../infra/repositories/user.repository.abstract';
import { DeleteUserService } from './delete-user.service';

describe('DeleteUserService', () => {
  let service: DeleteUserService;

  const userMockRepository = {
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteUserService,
        {
          provide: IUserRepository,
          useValue: userMockRepository,
        },
      ],
    }).compile();

    service = module.get(DeleteUserService);
    jest.clearAllMocks();
  });

  it('should call repository delete', async () => {
    userMockRepository.delete.mockResolvedValue(undefined);

    await service.execute('uuid-1');

    expect(userMockRepository.delete).toHaveBeenCalledWith('uuid-1');
    expect(userMockRepository.delete).toHaveBeenCalledTimes(1);
  });
});
