"use client";

import { useState } from "react";
import { UsersTable } from "./UsersTable";
import { InviteUserModal } from "./InviteUserModal";
import { updateUserRole, removeUser } from "@/actions/tenant-users";
import { useRouter } from "next/navigation";

export function UsersView({
  users,
  currentUserRole,
}: {
  users: any[];
  currentUserRole: string;
}) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const canManage = currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  const handleUpdateRole = async (userId: string, newRole: string) => {
    const res = await updateUserRole(userId, newRole);
    if (res.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
  };

  const handleRemoveUser = async (userId: string) => {
    const res = await removeUser(userId);
    if (res.error) {
      alert(res.error);
    } else {
      router.refresh();
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-white">
            Usuarios
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Una lista de todos los usuarios en tu organización incluyendo su nombre, rol y estado.
          </p>
        </div>
        {canManage && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button
              onClick={() => setIsModalOpen(true)}
              type="button"
              className="block rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:from-cyan-400 hover:to-purple-500 hover:shadow-cyan-400/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Invitar Usuario
            </button>
          </div>
        )}
      </div>

      <UsersTable 
        users={users} 
        currentUserRole={currentUserRole}
        onUpdateRole={handleUpdateRole}
        onRemoveUser={handleRemoveUser}
      />

      <InviteUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
