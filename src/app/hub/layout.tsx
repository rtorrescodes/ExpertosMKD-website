import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Users, Settings, LogOut } from "lucide-react";

export default async function HubLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "SUPERADMIN") {
    redirect("/admin/login");
  }

  return (
    <html lang="es">
      <body className="antialiased min-h-screen bg-gray-50 text-gray-900">
        <div className="flex h-screen bg-gray-50">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
            <div className="p-6">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Celeritas Hub
              </h1>
              <p className="text-sm text-gray-500 mt-1">Global Admin</p>
            </div>

            <nav className="flex-1 px-4 space-y-1">
              <Link
                href="/hub"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-900 rounded-md bg-gray-100"
              >
                <LayoutDashboard className="mr-3 h-5 w-5 text-gray-500" />
                Tenants
              </Link>
              <Link
                href="/hub/users"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
              >
                <Users className="mr-3 h-5 w-5 text-gray-400" />
                Global Users
              </Link>
              <Link
                href="/hub/settings"
                className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50"
              >
                <Settings className="mr-3 h-5 w-5 text-gray-400" />
                Settings
              </Link>
            </nav>

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">
                    {session.user.name || "Admin"}
                  </p>
                  <p className="text-xs font-medium text-gray-500">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
