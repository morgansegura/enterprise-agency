declare namespace Express {
  interface Request {
    // From JwtAuthGuard (via JWT strategy validate())
    user?: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
      isSuperAdmin: boolean;
      emailVerified: boolean;
    };

    // From TenantMiddleware
    tenantId?: string;

    // From TenantAccessGuard
    tenantUser?: {
      id: string;
      tenantId: string;
      userId: string;
      role: string;
      permissions: unknown;
    };

    // From TierGuard / FeatureGuard
    tenant?: {
      id: string;
      tier?: string;
      businessName?: string;
      enabledFeatures?: unknown;
    };
  }
}
