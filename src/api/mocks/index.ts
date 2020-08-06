import { dns } from './dns';
import { ssl } from './ssl';
import { system } from './system';
import { Mocks } from './types';
import { user } from './user';
import { users } from './users';
import { web } from './web';

export const mocks: Mocks = {
  ...users,
  ...system,
  ...dns,
  ...ssl,
  ...web,
  ...user,
};
