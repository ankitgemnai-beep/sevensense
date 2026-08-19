import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// Accepts roles like 'admin', 'moderator', 'support'
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
