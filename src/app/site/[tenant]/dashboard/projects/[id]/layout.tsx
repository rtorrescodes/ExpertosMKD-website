import { prisma } from "@/lib/prisma/client";
import { notFound } from "next/navigation";
import Link from "next/link";
import { KanbanSquare, BarChartHorizontal } from "lucide-react";

export default async function ProjectLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { tenant: string, id: string };
}) {
  const project = await prisma.prjProject.findUnique({
    where: { id: id },
  });

  if (!project) notFound();

  return (
    <div className="flex flex-col h-full">
      {/* Project Header Navigation */}
      <div className="pb-4 border-b border-white/10 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white leading-tight">{project.name}</h1>
          <p className="text-sm text-slate-400 mt-1">{project.description}</p>
        </div>
        
        <div className="flex gap-2">
          <Link href={`/site/${tenant}/dashboard/projects/${project.id}/kanban`} className="flex items-center gap-2 px-3 py-1.5 rounded-md glass-card border-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5">
            <KanbanSquare className="w-4 h-4" /> Kanban
          </Link>
          <Link href={`/site/${tenant}/dashboard/projects/${project.id}/gantt`} className="flex items-center gap-2 px-3 py-1.5 rounded-md glass-card border-white/5 border border-white/10 text-sm font-medium text-slate-300 hover:bg-white/5">
            <BarChartHorizontal className="w-4 h-4" /> Gantt
          </Link>
        </div>
      </div>

      {/* Main Content (Kanban or Gantt) */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}
