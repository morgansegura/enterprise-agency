// Extend Express Request type with custom properties
declare namespace Express {
  interface Request {
    // From AuthGuard
    user?: {
      id: string;
      sessionId: string;
    };

    // From TenantMiddleware
    tenantId?: string;

    // From TenantMemberGuard
    tenantUser?: {
      id: string;
      tenantId: string;
      userId: string;
      role: string;
      permissions: Record<string, unknown>;
    };
  }
}
