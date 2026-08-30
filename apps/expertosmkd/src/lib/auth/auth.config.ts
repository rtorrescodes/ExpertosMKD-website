import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { prisma } from '../prisma/client';
import bcrypt from 'bcrypt';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Contraseña', type: 'password' },
        tenantId: { label: 'Tenant', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Credenciales requeridas');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { tenant: true }
        });

        if (!user || !user.password) {
          throw new Error('Usuario no encontrado');
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error('Contraseña incorrecta');
        }

        // Validar que el usuario pertenece al tenant desde donde intenta loguearse
        if (credentials.tenantId && user.tenant && user.tenant.subdomain !== credentials.tenantId) {
           throw new Error('Este usuario no pertenece a esta agencia');
        }

        // Si el usuario tiene tenant, verificar que el tenant esté activo
        if (user.tenant && user.tenant.status === 'SUSPENDED') {
          throw new Error('El tenant está suspendido');
        }

        return {
          id: user.id,
          email: user.email!,
          name: user.name,
          role: user.role,
          tenantId: user.tenantId
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.tenantId = user.tenantId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
        session.user.tenantId = (token.tenantId as string) || null;
      }
      return session;
    }
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Tipado extendido
declare module 'next-auth' {
  interface User {
    role: string;
    tenantId: string | null;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
      role: string;
      tenantId: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
    tenantId: string | null;
  }
}

