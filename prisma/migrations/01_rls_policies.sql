-- prisma/migrations/01_rls_policies.sql

-- Habilitar RLS en todas las tablas
ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Session" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "AuditLog" ENABLE ROW LEVEL SECURITY;

-- Política para Tenant: solo visible para usuarios del tenant
CREATE POLICY tenant_isolation ON "Tenant"
  USING (id = current_setting('app.current_tenant_id')::text);

-- Política para User: usuarios solo ven su propio tenant
CREATE POLICY user_tenant_isolation ON "User"
  USING (tenant_id = current_setting('app.current_tenant_id')::text);

-- Política para AuditLog
CREATE POLICY audit_log_tenant_isolation ON "AuditLog"
  USING (tenant_id = current_setting('app.current_tenant_id')::text);

-- Política para SUPER_ADMIN: acceso a todo
CREATE POLICY super_admin_all ON "Tenant"
  USING (current_setting('app.current_user_role') = 'SUPER_ADMIN');

-- NOTA: Estas políticas requieren que el middleware establezca:
-- SET app.current_tenant_id = 'tenant-id'
-- SET app.current_user_role = 'SUPER_ADMIN' o 'OWNER'
