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
            <div key={col.id} className="w-80 bg-gray-100/50 border border-gray-200 rounded-lg flex flex-col max-h-full">
              <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-100 rounded-t-lg">
                <h3 className="font-semibold text-gray-700 text-sm">{col.title}</h3>
                <span className="text-xs bg-white px-2 py-0.5 rounded-full text-gray-500 font-medium">
                  {tasks.filter((t: any) => t.status === col.id).length}
                </span>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex-1 p-3 overflow-y-auto min-h-[150px] transition-colors ${snapshot.isDraggingOver ? 'bg-gray-200/50' : ''}`}
                  >
                    {tasks.filter((t: any) => t.status === col.id).map((task: any, index: number) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`p-3 mb-3 bg-white border rounded-md shadow-sm select-none transition-shadow ${snapshot.isDragging ? 'shadow-lg border-blue-400' : 'border-gray-200 hover:border-gray-300'}`}
                          >
                            <h4 className="text-sm font-medium text-gray-900">{task.title}</h4>
                            {task.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>}
                            
                            <div className="mt-3 flex justify-between items-center">
                              {task.assignedTo ? (
                                <div className="h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold" title={task.assignedTo.name}>
                                  {task.assignedTo.name?.charAt(0).toUpperCase()}
                                </div>
                              ) : (
                                <div className="h-6 w-6 rounded-full border border-dashed border-gray-300 text-gray-400 flex items-center justify-center" title="Sin asignar">
                                  <UserIcon className="w-3 h-3" />
                                </div>
                              )}
                              
                              {(task.startDate || task.dueDate) && (
                                <div className="text-[10px] text-gray-400 font-medium">
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
                        <textarea
                          autoFocus
                          placeholder="Título de la tarea..."
                          className="w-full text-sm border-gray-300 rounded-md p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                          <button onClick={() => { setIsAdding(null); setNewTaskTitle(""); }} className="text-xs text-gray-500 hover:text-gray-700">Cancelar</button>
                          <button onClick={() => handleCreateTask(col.id)} className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 font-medium">Guardar</button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setIsAdding(col.id)}
                        className="w-full mt-2 flex items-center gap-1 text-gray-500 hover:text-gray-800 text-sm font-medium py-1 px-2 rounded-md hover:bg-gray-200 transition-colors"
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
