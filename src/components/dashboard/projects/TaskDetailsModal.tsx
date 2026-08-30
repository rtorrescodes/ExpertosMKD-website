"use client";

import { useState, useEffect } from "react";
import { X, Trash2, Calendar, User, Clock, AlertCircle } from "lucide-react";

export function TaskDetailsModal({ 
  task, 
  tenantUsers, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete 
}: { 
  task: any; 
  tenantUsers: any[]; 
  isOpen: boolean; 
  onClose: () => void;
  onSave: (taskId: string, data: any) => Promise<void>;
  onDelete: (taskId: string) => Promise<void>;
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    assignedToId: "",
    startDate: "",
    dueDate: "",
  });
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        priority: task.priority || "MEDIUM",
        assignedToId: task.assignedToId || "",
        startDate: task.startDate ? new Date(task.startDate).toISOString().split('T')[0] : "",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "",
      });
    }
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return;
    setLoading(true);
    await onSave(task.id, formData);
    setLoading(false);
    onClose();
  };

  const handleDelete = async () => {
    if (confirm("¿Estás seguro de eliminar esta tarea permanentemente?")) {
      setLoading(true);
      await onDelete(task.id);
      setLoading(false);
      onClose();
    }
  };

  if (!isOpen || !task) return null;

  return (
    <div className="relative z-50">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4 pointer-events-none">
        <div className="mx-auto max-w-2xl w-full bg-[#0a1526] rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[90vh] pointer-events-auto">
          
          {/* Header */}
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <h2 className="text-lg font-semibold text-white">
              Detalles de la Tarea
            </h2>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Título</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full bg-[#01040f] border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                placeholder="Nombre de la tarea"
              />
            </div>

            {/* Grid 2 cols for properties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Assignee */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1">
                  <User className="w-4 h-4" /> Asignado a
                </label>
                <select
                  name="assignedToId"
                  value={formData.assignedToId}
                  onChange={handleChange}
                  className="w-full bg-[#01040f] border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="">Sin asignar</option>
                  {tenantUsers.map(u => (
                    <option key={u.id} value={u.id}>{u.name || u.email}</option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1">
                  <AlertCircle className="w-4 h-4" /> Prioridad
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full bg-[#01040f] border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="LOW">Baja</option>
                  <option value="MEDIUM">Media</option>
                  <option value="HIGH">Alta</option>
                  <option value="URGENT">Urgente</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1">
                  <Calendar className="w-4 h-4" /> Fecha Inicio
                </label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full bg-[#01040f] border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-cyan-500 [color-scheme:dark]"
                />
              </div>

              {/* Due Date */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-400 mb-1">
                  <Clock className="w-4 h-4" /> Fecha Límite
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full bg-[#01040f] border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-cyan-500 [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full bg-[#01040f] border border-white/10 rounded-md px-3 py-2 text-white focus:outline-none focus:border-cyan-500"
                placeholder="Añade detalles a esta tarea..."
              />
            </div>
            
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm font-medium px-3 py-2 rounded-md hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4" /> Eliminar
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 rounded-md border border-white/10 text-white hover:bg-white/10 transition-colors text-sm font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-500 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
