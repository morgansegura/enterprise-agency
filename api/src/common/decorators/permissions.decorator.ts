import { SetMetadata } from '@nestjs/common';
import { Permission } from '@/common/permissions';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Specify required permissions for a route. User must have ALL listed permissions.
 *
 * @example
 * @Permissions(Permission.PAGES_EDIT, Permission.PAGES_PUBLISH)
 */
export const Permissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
