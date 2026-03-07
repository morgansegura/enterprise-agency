/**
 * Re-export from common service for backward compatibility.
 * Admin services should migrate to importing from @/common/services/audit-log.service.
 */
export { AuditLogService, AuditAction } from "@/common/services/audit-log.service";
