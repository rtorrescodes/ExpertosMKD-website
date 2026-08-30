"use client";

import { useState } from "react";
import { User, Mail, MoreVertical, Edit2, Trash2, Shield, User as UserIcon } from "lucide-react";
import { format } from "date-fns";

type SafeUser = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  emailVerified: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
};

export function UsersTable({
  users,
  currentUserRole,
  onUpdateRole,
  onRemoveUser
}: {
  users: SafeUser[];
  currentUserRole: string;
  onUpdateRole: (userId: string, newRole: string) => Promise<void>;
  onRemoveUser: (userId: string) => Promise<void>;
}) {
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const canManage = currentUserRole === "OWNER" || currentUserRole === "ADMIN";

  const filteredUsers = users.filter(u => 
    (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "OWNER":
        return "bg-purple-100 text-purple-800";
      case "ADMIN":
        return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
      default:
        return "bg-white/10 text-slate-200";
    }
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleUpdateRole = async (userId: string, currentRole: string, targetRole: string) => {
    setOpenDropdownId(null);
    if (currentRole === "OWNER") {
      alert("No se puede cambiar el rol de un OWNER.");
      return;
    }
    if (confirm(`¿Estás seguro de cambiar el rol a ${targetRole}?`)) {
      await onUpdateRole(userId, targetRole);
    }
  };

  const handleRemove = async (userId: string, currentRole: string) => {
    setOpenDropdownId(null);
    if (currentRole === "OWNER") {
      alert("No se puede eliminar a un OWNER.");
      return;
    }
    if (confirm("¿Estás seguro de remover a este usuario? Perderá acceso inmediatamente.")) {
      await onRemoveUser(userId);
    }
  };

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <div className="mb-4 flex justify-between items-center">
            <input 
              type="search" 
              placeholder="Buscar por nombre o correo..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500 rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500 w-full max-w-sm"
            />
          </div>
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">
                    Usuario
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                    Rol
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                    Estado
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">
                    Agregado
                  </th>
                  {canManage && (
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Acciones</span>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 glass-card border-white/5">
                {filteredUsers.map((person) => (
                  <tr key={person.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/50">
                            <span className="text-sm font-medium leading-none text-white">
                              {person.name ? person.name.charAt(0).toUpperCase() : person.email.charAt(0).toUpperCase()}
                            </span>
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-white">{person.name || "Sin nombre"}</div>
                          <div className="text-slate-400">{person.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400">
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getRoleBadgeColor(person.role)}`}>
                        {person.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400">
                      {person.emailVerified ? (
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          Verificado
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400">
                      -
                    </td>
                    {canManage && (
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <div className="relative inline-block text-left">
                          <button
                            type="button"
                            onClick={() => toggleDropdown(person.id)}
                            className="flex items-center p-2 text-slate-500 hover:text-slate-400"
                          >
                            <span className="sr-only">Abrir opciones</span>
                            <MoreVertical className="h-5 w-5" aria-hidden="true" />
                          </button>

                          {openDropdownId === person.id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenDropdownId(null)}
                              ></div>
                              <div className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md glass-card border-white/5 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  {person.role !== "OWNER" && (
                                    <>
                                      {person.role !== "ADMIN" && (
                                        <button
                                          onClick={() => handleUpdateRole(person.id, person.role, "ADMIN")}
                                          className="group flex w-full items-center px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
                                        >
                                          <Shield className="mr-3 h-4 w-4 text-slate-500 group-hover:text-slate-400" />
                                          Hacer Admin
                                        </button>
                                      )}
                                      {person.role !== "MEMBER" && (
                                        <button
                                          onClick={() => handleUpdateRole(person.id, person.role, "MEMBER")}
                                          className="group flex w-full items-center px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
                                        >
                                          <UserIcon className="mr-3 h-4 w-4 text-slate-500 group-hover:text-slate-400" />
                                          Hacer Miembro
                                        </button>
                                      )}
                                      <button
                                        onClick={() => handleRemove(person.id, person.role)}
                                        className="group flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                                      >
                                        <Trash2 className="mr-3 h-4 w-4 text-red-400 group-hover:text-red-500" />
                                        Remover Usuario
                                      </button>
                                    </>
                                  )}
                                  {person.role === "OWNER" && (
                                    <div className="px-4 py-2 text-xs text-slate-400">
                                      Opciones bloqueadas para el Owner
                                    </div>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
