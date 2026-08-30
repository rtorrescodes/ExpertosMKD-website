"use client";

import { useMemo } from "react";
import { format, addDays, differenceInDays, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

export function ProjectGanttClient({ project }: { project: any }) {
  const tasks = project.tasks;

  // Calculate timeline bounds
  const { minDate, maxDate, totalDays, datesArray } = useMemo(() => {
    if (tasks.length === 0) {
      const today = startOfDay(new Date());
      return { minDate: today, maxDate: addDays(today, 14), totalDays: 14, datesArray: Array.from({length: 14}).map((_, i) => addDays(today, i)) };
    }

    let min = new Date("2100-01-01");
    let max = new Date("1970-01-01");

    tasks.forEach((t: any) => {
      const s = t.startDate ? new Date(t.startDate) : new Date();
      const d = t.dueDate ? new Date(t.dueDate) : addDays(s, 1);
      if (s < min) min = s;
      if (d > max) max = d;
    });

    // Add padding (3 days before, 7 days after)
    min = startOfDay(addDays(min, -3));
    max = startOfDay(addDays(max, 7));

    const totalDays = differenceInDays(max, min) + 1;
    const datesArray = Array.from({ length: totalDays }).map((_, i) => addDays(min, i));

    return { minDate: min, maxDate: max, totalDays, datesArray };
  }, [tasks]);

  const getTaskGridPosition = (task: any) => {
    const s = task.startDate ? startOfDay(new Date(task.startDate)) : startOfDay(new Date());
    const d = task.dueDate ? startOfDay(new Date(task.dueDate)) : addDays(s, 1);
    
    // Convert to grid 1-based index
    const startCol = differenceInDays(s, minDate) + 1;
    const endCol = differenceInDays(d, minDate) + 2; // +2 because grid-column-end is exclusive

    // Prevent bounds issues
    const safeStart = Math.max(1, startCol);
    const safeEnd = Math.min(totalDays + 1, Math.max(safeStart + 1, endCol));

    return { gridColumn: `${safeStart} / ${safeEnd}` };
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case "TODO": return "bg-gray-400";
      case "IN_PROGRESS": return "bg-blue-500";
      case "REVIEW": return "bg-yellow-500";
      case "DONE": return "bg-green-500";
      default: return "bg-gray-400";
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col h-[600px] overflow-hidden">
      
      {/* Legend */}
      <div className="p-4 border-b border-gray-200 flex gap-4 text-xs font-medium text-gray-600 bg-gray-50">
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-400"></span> Por Hacer</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500"></span> En Progreso</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-yellow-500"></span> En Revisión</div>
        <div className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-500"></span> Completado</div>
      </div>

      <div className="flex-1 flex overflow-auto">
        
        {/* Left Pane (Task List Sticky) */}
        <div className="w-64 flex-shrink-0 border-r border-gray-200 bg-white sticky left-0 z-20 flex flex-col">
          <div className="h-12 border-b border-gray-200 bg-gray-50 flex items-center px-4 font-semibold text-sm text-gray-700">
            Tareas
          </div>
          <div className="flex-1 overflow-y-hidden">
            {tasks.map((task: any) => (
              <div key={task.id} className="h-12 border-b border-gray-100 flex items-center px-4 text-sm text-gray-900 truncate hover:bg-gray-50" title={task.title}>
                {task.title}
              </div>
            ))}
            {tasks.length === 0 && <div className="p-4 text-sm text-gray-500">No hay tareas. Crea una desde la vista Kanban.</div>}
          </div>
        </div>

        {/* Right Pane (Gantt Grid) */}
        <div className="flex-1 relative">
          
          {/* Header (Dates) */}
          <div 
            className="h-12 border-b border-gray-200 bg-gray-50 sticky top-0 z-10 grid" 
            style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(40px, 1fr))` }}
          >
            {datesArray.map((d, i) => (
              <div key={i} className="flex flex-col items-center justify-center border-r border-gray-200/50 text-xs text-gray-500">
                <span className="font-semibold text-gray-800">{format(d, "d")}</span>
                <span className="text-[10px]">{format(d, "MMM", {locale: es})}</span>
              </div>
            ))}
          </div>

          {/* Grid Area */}
          <div className="relative">
            {/* Background vertical lines */}
            <div 
              className="absolute inset-0 grid pointer-events-none" 
              style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(40px, 1fr))` }}
            >
              {datesArray.map((_, i) => (
                <div key={i} className="border-r border-gray-100 h-full"></div>
              ))}
            </div>

            {/* Task Bars */}
            {tasks.map((task: any) => (
              <div 
                key={task.id} 
                className="h-12 border-b border-transparent flex items-center group relative grid"
                style={{ gridTemplateColumns: `repeat(${totalDays}, minmax(40px, 1fr))` }}
              >
                <div 
                  className={`h-6 rounded-md shadow-sm ${getStatusColor(task.status)} flex items-center px-2 z-10 transition-transform hover:scale-y-110 cursor-pointer`}
                  style={getTaskGridPosition(task)}
                  title={`${task.title}\nInicio: ${task.startDate ? new Date(task.startDate).toLocaleDateString() : 'Sin fecha'}\nFin: ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Sin fecha'}`}
                >
                  <span className="text-[10px] text-white font-medium truncate mix-blend-screen">{task.assignedTo?.name || ""}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
