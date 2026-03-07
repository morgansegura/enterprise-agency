import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '@/common/guards/roles.guard';
import { TenantRole } from '@/common/permissions';

/**
 * Restrict route to specific tenant roles.
 *
 * @example
 * @Roles(TenantRole.AGENCY_ADMIN, TenantRole.SUPERADMIN)
 */
export const Roles = (...roles: TenantRole[]) => SetMetadata(ROLES_KEY, roles);
