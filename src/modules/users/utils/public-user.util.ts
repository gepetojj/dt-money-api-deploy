import type { StoredUser } from '../infra/repositories/user.repository.abstract';

export type PublicUser = Omit<StoredUser, 'passwordHash'>;

export function toPublicUser(user: StoredUser): PublicUser {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}
