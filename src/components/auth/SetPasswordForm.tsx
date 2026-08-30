"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { setPasswordFromToken } from "@/actions/auth";

export function SetPasswordForm({
  token,
  email,
}: {
  token: string;
  email: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await setPasswordFromToken(formData);

    if (result?.error) {
      setError(result.error);
      setIsSubmitting(false);
    } else if (result?.success) {
      router.push("/login?verified=true");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900 text-center mb-6">
          Set Your Password
        </h3>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <input type="hidden" name="token" value={token} />
      <input type="hidden" name="email" value={email} />

      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          New Password
        </label>
        <div className="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <div className="mt-1">
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            minLength={8}
            className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : "Save Password"}
        </button>
      </div>
    </form>
  );
}
