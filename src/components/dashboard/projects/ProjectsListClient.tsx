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
          <h1 className="text-base font-semibold leading-6 text-gray-900">Control de Proyectos</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gestiona las operaciones, tareas y el avance de tus proyectos.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
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
              className="relative flex flex-col justify-between rounded-lg border border-gray-300 bg-white p-6 shadow-sm hover:border-black transition-colors group"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{project.name}</h3>
                  <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${project.status === 'COMPLETED' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
                    {project.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">{project.description || "Sin descripción"}</p>
                
                {project.person && (
                  <p className="mt-3 text-xs text-gray-400">Cliente: {project.person.firstName} {project.person.lastName}</p>
                )}
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center text-xs text-gray-500 mb-1">
                  <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3"/> {completedTasks}/{totalTasks} Tareas</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-black h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-4">Crear Proyecto</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Nombre del Proyecto</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border rounded-md p-2 text-sm" placeholder="Ej. Rediseño Web Cliente X" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full border rounded-md p-2 text-sm" rows={3}></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">Cancelar</button>
              <button onClick={handleCreate} disabled={!name} className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md disabled:opacity-50">Crear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
