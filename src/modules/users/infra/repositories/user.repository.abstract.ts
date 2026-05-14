export type StoredUser = {
  id: string;
  username: string;
  email: string;
  name: string | null;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserRepositoryInput = {
  username: string;
  email: string;
  name?: string | null;
  passwordHash: string;
};

export type UpdateUserRepositoryInput = {
  username?: string;
  email?: string;
  name?: string | null;
  passwordHash?: string;
};

export abstract class IUserRepository {
  abstract create(data: CreateUserRepositoryInput): Promise<StoredUser>;
  abstract update(
    id: string,
    data: UpdateUserRepositoryInput,
  ): Promise<StoredUser>;
  abstract findById(id: string): Promise<StoredUser>;
  abstract findByEmail(email: string): Promise<StoredUser>;
  abstract findByUsername(username: string): Promise<StoredUser>;
  abstract delete(id: string): Promise<void>;
}
