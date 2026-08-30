"use client";

import { useState } from "react";
import { Plus, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { createProject } from "@/actions/projects";
import { useRouter } from "next/navigation";

export function ProjectsListClient({ tenantSubdomain, projects }: { tenantSubdomain: string, projects: any[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  
  const handleCreate = async () => {
    const res = await createProject({ name, description });
    if (res.success) {
      setIsModalOpen(false);
      setName("");
      setDescription("");
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-white">Control de Proyectos</h1>
          <p className="mt-2 text-sm text-slate-300">
            Gestiona las operaciones, tareas y el avance de tus proyectos.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-cyan-400 hover:to-purple-500 hover:shadow-cyan-400/40"
          >
            <Plus className="h-4 w-4" />
            Nuevo Proyecto
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const totalTasks = project.tasks.length;
          const completedTasks = project.tasks.filter((t: any) => t.status === "DONE").length;
          const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
          
          return (
            <Link 
              key={project.id} 
              href={`/site/${tenantSubdomain}/dashboard/projects/${project.id}/kanban`}
              className="relative flex flex-col justify-between rounded-lg border border-white/10 glass-card border-white/5 p-6 shadow-sm hover:border-cyan-400 transition-colors group"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-white group-hover:text-blue-600 transition-colors">{project.name}</h3>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${project.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2 min-h-[40px]">{project.description || "Sin descripción"}</p>
                
                {project.person && (
                  <p className="mt-3 text-xs text-slate-500">Cliente: {project.person.firstName} {project.person.lastName}</p>
                )}
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3"/> {completedTasks}/{totalTasks} Tareas</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2">
                  <div className="bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20/50 p-4">
          <div className="glass-card border-white/5 rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-4">Crear Proyecto</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300">Nombre del Proyecto</label>
                <input type="text" className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border rounded-md p-2 text-sm" placeholder="Ej. Rediseño Web Cliente X" />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Descripción</label>
                <textarea className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full border rounded-md p-2 text-sm" rows={3}></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 rounded-md">Cancelar</button>
              <button onClick={handleCreate} disabled={!name} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-purple-500 hover:shadow-cyan-400/40 rounded-md disabled:opacity-50">Crear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
