"use server";

import { prisma } from "@/lib/prisma/client";
import bcrypt from "bcrypt";
import { z } from "zod";

const setPasswordSchema = z.object({
  token: z.string(),
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export async function setPasswordFromToken(formData: FormData) {
  try {
    const data = Object.fromEntries(formData.entries());
    const validated = setPasswordSchema.safeParse(data);

    if (!validated.success) {
      return {
        error: "Invalid fields",
        details: validated.error.flatten().fieldErrors,
      };
    }

    const { token, email, password } = validated.data;

    // 1. Verify token
    const verification = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: email,
          token: token,
        },
      },
    });

    if (!verification) {
      return { error: "Invalid or expired token." };
    }

    if (verification.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { identifier_token: { identifier: email, token } } });
      return { error: "Token has expired." };
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Update User
    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      }),
      prisma.verificationToken.delete({
        where: { identifier_token: { identifier: email, token } },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error("Set password error:", error);
    return { error: "Internal server error" };
  }
}
