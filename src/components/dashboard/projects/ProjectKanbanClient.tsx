"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, User as UserIcon } from "lucide-react";
import { createTask, updateTaskStatus } from "@/actions/projects";

const COLUMNS = [
  { id: "TODO", title: "Por Hacer" },
  { id: "IN_PROGRESS", title: "En Progreso" },
  { id: "REVIEW", title: "En Revisión" },
  { id: "DONE", title: "Completado" }
];

export function ProjectKanbanClient({ project, tenantUsers }: { project: any, tenantUsers: any[] }) {
  const [tasks, setTasks] = useState(project.tasks);
  const [isAdding, setIsAdding] = useState<string | null>(null);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optimistic UI update
    const newStatus = destination.droppableId;
    const updatedTasks = tasks.map((t: any) => t.id === draggableId ? { ...t, status: newStatus } : t);
    setTasks(updatedTasks);

    // Backend update
    await updateTaskStatus(draggableId, newStatus);
  };

  const handleCreateTask = async (status: string) => {
    if (!newTaskTitle.trim()) return;
    
    // Quick assign for MVP (Optional, could add a dropdown)
    const res = await createTask({
      projectId: project.id,
      title: newTaskTitle,
      status: status
    });

    if (res.success) {
      setTasks([...tasks, res.task]);
      setNewTaskTitle("");
      setIsAdding(null);
    }
  };

  return (
    <div className="h-full w-full overflow-x-auto pb-4">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 h-full min-w-max items-start">
          {COLUMNS.map((col) => (
            <div key={col.id} className="w-80 bg-white/10/50 border border-white/10 rounded-lg flex flex-col max-h-full">
              <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/10 rounded-t-lg">
                <h3 className="font-semibold text-slate-300 text-sm">{col.title}</h3>
                <span className="text-xs glass-card border-white/5 px-2 py-0.5 rounded-full text-slate-400 font-medium">
                  {tasks.filter((t: any) => t.status === col.id).length}
                </span>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-3 overflow-y-auto min-h-[150px] transition-colors ${snapshot.isDraggingOver ? 'bg-white/20/50' : ''}`}
                  >
                    {tasks.filter((t: any) => t.status === col.id).map((task: any, index: number) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 mb-3 glass-card border-white/5 border rounded-md shadow-sm select-none transition-shadow ${snapshot.isDragging ? 'shadow-lg border-blue-400' : 'border-white/10 hover:border-white/10'}`}
                          >
                            <h4 className="text-sm font-medium text-white">{task.title}</h4>
                            {task.description && <p className="text-xs text-slate-400 mt-1 line-clamp-2">{task.description}</p>}
                            
                            <div className="mt-3 flex justify-between items-center">
                              {task.assignedTo ? (
                                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold" title={task.assignedTo.name}>
                                  {task.assignedTo.name?.charAt(0).toUpperCase()}
                                </div>
                              ) : (
                                <div className="h-6 w-6 rounded-full border border-dashed border-white/10 text-slate-500 flex items-center justify-center" title="Sin asignar">
                                  <UserIcon className="w-3 h-3" />
                                </div>
                              )}
                              
                              {(task.startDate || task.dueDate) && (
                                <div className="text-[10px] text-slate-500 font-medium">
                                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString('es-MX', {day: 'numeric', month: 'short'}) : 'Sin fecha'}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                    
                    {isAdding === col.id ? (
                      <div className="mt-2">
                        <textarea className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500"
                          autoFocus
                          placeholder="Título de la tarea..."
                          className="w-full text-sm border-white/10 rounded-md p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                          rows={2}
                          value={newTaskTitle}
                          onChange={(e) => setNewTaskTitle(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleCreateTask(col.id);
                            }
                          }}
                        />
                        <div className="flex justify-end gap-2 mt-2">
                          <button onClick={() => { setIsAdding(null); setNewTaskTitle(""); }} className="text-xs text-slate-400 hover:text-slate-300">Cancelar</button>
                          <button onClick={() => handleCreateTask(col.id)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 font-medium">Guardar</button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsAdding(col.id)}
                        className="w-full mt-2 flex items-center gap-1 text-slate-400 hover:text-slate-200 text-sm font-medium py-1 px-2 rounded-md hover:bg-white/20 transition-colors"
                      >
                        <Plus className="w-4 h-4" /> Añadir tarea
                      </button>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
