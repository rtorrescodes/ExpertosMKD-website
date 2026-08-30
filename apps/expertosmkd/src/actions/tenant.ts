"use server";

import { prisma } from "@/lib/prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import crypto from "crypto";
import { sendTenantInvite } from "@/lib/email/mailer";

const createTenantSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  subdomain: z
    .string()
    .min(2, "Subdomain must be at least 2 characters")
    .regex(/^[a-z0-9]+$/, "Subdomain must contain only lowercase letters and numbers"),
  ownerEmail: z.string().email("Invalid email address"),
  features: z.object({
    crm: z.boolean().default(false),
    ecommerce: z.boolean().default(false),
  }),
});

export async function createTenant(formData: FormData) {
  try {
    const data = {
      name: formData.get("name") as string,
      subdomain: formData.get("subdomain") as string,
      ownerEmail: formData.get("ownerEmail") as string,
      features: {
        crm: formData.get("feature_crm") === "true",
        ecommerce: formData.get("feature_ecommerce") === "true",
      },
    };

    const validatedFields = createTenantSchema.safeParse(data);

    if (!validatedFields.success) {
      return {
        error: "Invalid fields",
        details: validatedFields.error.flatten().fieldErrors,
      };
    }

    const { name, subdomain, ownerEmail, features } = validatedFields.data;

    // Check if subdomain exists
    const existingSubdomain = await prisma.tenant.findUnique({
      where: { subdomain },
    });

    if (existingSubdomain) {
      return { error: "Subdomain already taken" };
    }

    // Perform atomic transaction to create Tenant, Owner User, and Verification Token
    await prisma.$transaction(async (tx) => {
      // 1. Create Tenant
      const tenant = await tx.tenant.create({
        data: {
          name,
          subdomain,
          featureFlags: features as any, // Storing features in the JSON featureFlags column
        },
      });

      // 2. Create Owner User (Password will be set by them later)
      const user = await tx.user.create({
        data: {
          email: ownerEmail,
          name: "Tenant Owner",
          password: "", // Empty for now, must be set via invite link
          role: "ADMIN",
          tenantId: tenant.id,
        },
      });

      // 3. Create Verification Token
      const token = crypto.randomBytes(32).toString("hex");
      await tx.verificationToken.create({
        data: {
          identifier: ownerEmail,
          token,
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });

      // 4. Send Invite Email
      await sendTenantInvite(ownerEmail, name, subdomain, token);
    });

    revalidatePath("/hub");
    return { success: true };
  } catch (error) {
    console.error("Failed to create tenant:", error);
    return { error: "Internal server error during tenant creation" };
  }
}
