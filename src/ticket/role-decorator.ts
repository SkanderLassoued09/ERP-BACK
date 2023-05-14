import { SetMetadata } from '@nestjs/common';
// import { Role } from './roles.enum';

export enum Role {
  ADMIN_MANAGER = 'ADMIN_MANAGER',
  ADMIN_TECH = 'ADMIN_TECH',
  MANAGER = 'MANAGER',
  TECH = 'TECH',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
