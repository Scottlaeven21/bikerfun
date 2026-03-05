import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export type AuditAction = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'sync' 
  | 'login' 
  | 'logout'
  | 'view'
  | 'export';

export type AuditResourceType = 
  | 'product' 
  | 'occasion' 
  | 'category' 
  | 'order' 
  | 'user'
  | 'settings'
  | 'products'
  | 'occasions'
  | 'orders'
  | 'system';

interface AuditLogData {
  userId?: string;
  userEmail: string;
  action: AuditAction;
  resourceType: AuditResourceType;
  resourceId?: string;
  details?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
}

export async function logAuditEvent(data: AuditLogData): Promise<void> {
  try {
    const supabase = createAdminClient();
    
    const { error } = await (supabase as any)
      .from('audit_logs')
      .insert({
        user_id: data.userId || null,
        user_email: data.userEmail,
        action: data.action,
        resource_type: data.resourceType,
        resource_id: data.resourceId || null,
        details: data.details || null,
        ip_address: data.ipAddress || null,
        user_agent: data.userAgent || null,
      });

    if (error) {
      console.error('Failed to log audit event:', error);
    }
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}

// Helper function for API routes
export async function createAuditLog(
  request: Request,
  action: string,
  resourceType: string,
  resourceId?: string,
  details?: any,
  status?: 'success' | 'failure',
  errorMessage?: string
): Promise<void> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const supabaseAdmin = createAdminClient();
    
    const auditDetails: any = {
      ...details,
    };
    
    if (status) {
      auditDetails.status = status;
    }
    
    if (errorMessage) {
      auditDetails.error = errorMessage;
    }
    
    await (supabaseAdmin as any)
      .from('audit_logs')
      .insert({
        user_id: user?.id || null,
        user_email: user?.email || 'system',
        action,
        resource_type: resourceType,
        resource_id: resourceId || null,
        details: auditDetails,
        ip_address: getClientIp(request),
        user_agent: getUserAgent(request),
      });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return 'unknown';
}

export function getUserAgent(request: Request): string {
  return request.headers.get('user-agent') || 'unknown';
}
