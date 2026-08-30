import { prisma } from '../prisma/client';

export async function getTenantBySubdomain(subdomain: string) {
  try {
    const tenant = await prisma.tenant.findUnique({
      where: { subdomain }
    });
    return tenant;
  } catch (error) {
    console.error('Error fetching tenant by subdomain:', error);
    return null;
  }
}
