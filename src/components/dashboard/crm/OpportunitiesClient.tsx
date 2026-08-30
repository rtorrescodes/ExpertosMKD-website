"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { createOpportunity, updateOpportunityStage } from "@/actions/crm";
import { Plus, DollarSign, Building2, User as UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

const STAGES = [
  { id: "NEW", title: "Nuevos" },
  { id: "CONTACTED", title: "Contactados" },
  { id: "QUALIFIED", title: "Calificados" },
  { id: "PROPOSAL", title: "Propuesta" },
  { id: "WON", title: "Ganados" },
  { id: "LOST", title: "Perdidos" }
];

export function OpportunitiesClient({ opportunities, companies, people }: { opportunities: any[]; companies: any[]; people: any[] }) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Local state for optimistic UI drag and drop
  const [boardData, setBoardData] = useState<Record<string, any[]>>({});
  
  useEffect(() => {
    const newBoard: Record<string, any[]> = {};
    STAGES.forEach(s => { newBoard[s.id] = []; });
    opportunities.forEach(opp => {
      if (newBoard[opp.stage]) {
        newBoard[opp.stage].push(opp);
      } else {
        newBoard["NEW"].push(opp); // Fallback
      }
    });
    setBoardData(newBoard);
  }, [opportunities]);

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // Optimistic UI Update
    const sourceColumn = [...boardData[source.droppableId]];
    const destColumn = [...boardData[destination.droppableId]];
    
    const [movedItem] = sourceColumn.splice(source.index, 1);
    movedItem.stage = destination.droppableId;
    
    if (source.droppableId === destination.droppableId) {
      sourceColumn.splice(destination.index, 0, movedItem);
      setBoardData({ ...boardData, [source.droppableId]: sourceColumn });
    } else {
      destColumn.splice(destination.index, 0, movedItem);
      setBoardData({
        ...boardData,
        [source.droppableId]: sourceColumn,
        [destination.droppableId]: destColumn,
      });
      // Fire server action silently
      await updateOpportunityStage(draggableId, destination.droppableId);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    await createOpportunity({
      name: formData.get("name") as string,
      amount: formData.get("amount") ? Number(formData.get("amount")) : undefined,
      stage: "NEW", // Default stage
      companyId: formData.get("companyId") as string || undefined,
      personId: formData.get("personId") as string || undefined,
    });

    setIsSubmitting(false);
    setIsModalOpen(false);
    router.refresh();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="sm:flex sm:items-center pb-6">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Oportunidades (Pipeline)</h1>
          <p className="mt-2 text-sm text-gray-700">Arrastra y suelta las oportunidades para avanzar en el embudo de ventas.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button onClick={() => setIsModalOpen(true)} type="button" className="flex items-center gap-2 rounded-md bg-black px-3 py-2 text-center text-sm font-semibold text-white hover:bg-gray-800">
            <Plus className="h-4 w-4" />
            Nueva Oportunidad
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full min-h-[600px] gap-4 items-start pb-4">
          <DragDropContext onDragEnd={onDragEnd}>
            {STAGES.map((stage) => (
              <div key={stage.id} className="flex-shrink-0 w-80 flex flex-col h-full max-h-full rounded-md bg-gray-100">
                <div className="p-3 border-b border-gray-200">
                  <h3 className="font-semibold text-sm text-gray-700 flex justify-between">
                    {stage.title}
                    <span className="bg-gray-200 text-gray-600 rounded-full px-2 py-0.5 text-xs">
                      {boardData[stage.id]?.length || 0}
                    </span>
                  </h3>
                </div>
                
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto p-2 space-y-2 ${snapshot.isDraggingOver ? "bg-gray-200" : ""}`}
                    >
                      {boardData[stage.id]?.map((opp, index) => (
                        <Draggable key={opp.id} draggableId={opp.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-3 rounded shadow-sm border border-gray-200 text-sm ${snapshot.isDragging ? "shadow-lg ring-1 ring-black" : ""}`}
                            >
                              <div className="font-medium text-gray-900">{opp.name}</div>
                              <div className="text-gray-500 font-semibold mt-1">
                                {opp.amount ? `$${Number(opp.amount).toLocaleString()}` : "-"}
                              </div>
                              
                              {(opp.company || opp.person) && (
                                <div className="mt-3 flex flex-col gap-1 text-xs text-gray-500">
                                  {opp.company && (
                                    <div className="flex items-center gap-1">
                                      <Building2 className="h-3 w-3" /> {opp.company.name}
                                    </div>
                                  )}
                                  {opp.person && (
                                    <div className="flex items-center gap-1">
                                      <UserIcon className="h-3 w-3" /> {opp.person.firstName} {opp.person.lastName}
                                    </div>
                                  )}
                                </div>
                              )}
                              <div className="mt-3 text-xs text-gray-400">
                                {format(new Date(opp.createdAt), "MMM d")}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </DragDropContext>
        </div>
      </div>

      {isModalOpen && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">Nueva Oportunidad</h3>
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre del Negocio</label>
                    <input required type="text" name="name" className="mt-1 block w-full rounded-md border p-2 text-sm border-gray-300" placeholder="Ej. Rediseño web" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Monto Esperado (USD)</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <DollarSign className="h-4 w-4 text-gray-400" />
                      </div>
                      <input type="number" name="amount" className="block w-full rounded-md border p-2 pl-10 text-sm border-gray-300" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Empresa Relacionada</label>
                    <select name="companyId" className="mt-1 block w-full rounded-md border p-2 text-sm border-gray-300 bg-white">
                      <option value="">-- Sin asignar --</option>
                      {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Persona Contacto</label>
                    <select name="personId" className="mt-1 block w-full rounded-md border p-2 text-sm border-gray-300 bg-white">
                      <option value="">-- Sin asignar --</option>
                      {people.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                    </select>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button disabled={isSubmitting} type="submit" className="inline-flex w-full justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 sm:col-start-2 disabled:opacity-50">
                      {isSubmitting ? "Guardando..." : "Crear Oportunidad"}
                    </button>
                    <button onClick={() => setIsModalOpen(false)} type="button" className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50 sm:col-start-1">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
