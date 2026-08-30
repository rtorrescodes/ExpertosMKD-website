"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function TenantHeader({ userName, userEmail }: { userName: string, userEmail: string }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-white/5 glass-card px-4 sm:gap-x-6 sm:px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          
          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/10" aria-hidden="true" />

          {/* Profile */}
          <div className="flex items-center gap-x-4">
            <span className="hidden lg:flex lg:items-center">
              <span className="ml-4 text-sm font-semibold leading-6 text-white" aria-hidden="true">
                {userName}
              </span>
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm font-semibold text-slate-300 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
