import { SetPasswordForm } from "@/components/auth/SetPasswordForm";
import { prisma } from "@/lib/prisma/client";

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: { token?: string; email?: string };
}) {
  const token = searchParams.token;
  const email = searchParams.email;

  if (!token || !email) {
    return (
      <div className="text-center text-red-600 p-4">
        Invalid verification link. Missing token or email.
      </div>
    );
  }

  // Pre-validate token so we don't even show the form if it's invalid
  const verification = await prisma.verificationToken.findUnique({
    where: {
      identifier_token: {
        identifier: email,
        token: token,
      },
    },
  });

  if (!verification || verification.expires < new Date()) {
    return (
      <div className="text-center text-red-600 p-4">
        This invitation link has expired or is invalid. Please contact support.
      </div>
    );
  }

  return <SetPasswordForm token={token} email={email} />;
}
