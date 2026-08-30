const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  let tenant = await prisma.tenant.findUnique({ where: { subdomain: 'qa-demo' } });
  
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: 'QA Demo Studio',
        subdomain: 'qa-demo',
        featureFlags: {
          crm: true,
          quotes: true,
          appointments: true,
          projects: true,
          ecommerce: true
        }
      }
    });
  } else {
    tenant = await prisma.tenant.update({
      where: { subdomain: 'qa-demo' },
      data: {
        featureFlags: {
          crm: true,
          quotes: true,
          appointments: true,
          projects: true,
          ecommerce: true
        }
      }
    });
  }

  let user = await prisma.user.findUnique({ where: { email: 'qa@demo.com' } });
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'QA Tester',
        email: 'qa@demo.com',
        password: hashedPassword,
        tenantId: tenant.id,
        role: 'ADMIN'
      }
    });
  } else {
    await prisma.user.update({
      where: { email: 'qa@demo.com' },
      data: { password: hashedPassword, tenantId: tenant.id, role: 'ADMIN' }
    });
  }
  console.log('QA Tenant & User Ready: qa@demo.com / password123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
