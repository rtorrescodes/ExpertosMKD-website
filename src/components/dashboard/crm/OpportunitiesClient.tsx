"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Plus, DollarSign, Building2, User as UserIcon, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { createOpportunity, updateOpportunityStage, updateOpportunity, deleteOpportunity } from "@/actions/crm";
import { useRouter } from "next/navigation";

const STAGES = [
  { id: "PROSPECT", title: "Prospecto" },
  { id: "QUALIFIED", title: "Calificado" },
  { id: "PROPOSAL", title: "Propuesta Enviada" },
  { id: "NEGOTIATION", title: "En Negociación" },
  { id: "WON", title: "Cerrado Ganado" },
  { id: "LOST", title: "Cerrado Perdido" }
];

export function OpportunitiesClient({ tenantSubdomain, opportunities, companies, people }: { tenantSubdomain?: string; opportunities: any[]; companies: any[]; people: any[] }) {
  const router = useRouter();
  const [boardData, setBoardData] = useState<Record<string, any[]>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    const newBoard: Record<string, any[]> = {};
    STAGES.forEach(s => { newBoard[s.id] = []; });
    opportunities.forEach(opp => {
      if (newBoard[opp.stage]) {
        newBoard[opp.stage].push(opp);
      } else {
        if(newBoard["PROSPECT"]) newBoard["PROSPECT"].push(opp); // Fallback
      }
    });
    setBoardData(newBoard);
  }, [opportunities]);

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    // Optimistic Update
    const newBoard = { ...boardData };
    const sourceList = [...newBoard[source.droppableId]];
    const destList = [...newBoard[destination.droppableId]];
    const [moved] = sourceList.splice(source.index, 1);
    
    moved.stage = destination.droppableId;
    destList.splice(destination.index, 0, moved);
    
    newBoard[source.droppableId] = sourceList;
    newBoard[destination.droppableId] = destList;
    setBoardData(newBoard);

    await updateOpportunityStage(draggableId, destination.droppableId);
    router.refresh();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const companyId = formData.get("companyId") as string;
    const personId = formData.get("personId") as string;

    let result;
    if (editingOpp) {
      result = await updateOpportunity(editingOpp.id, {
        name: formData.get("name") as string,
        amount: Number(formData.get("amount")) || undefined,
        companyId: companyId || undefined,
        personId: personId || undefined,
      });
    } else {
      result = await createOpportunity({
        name: formData.get("name") as string,
        amount: Number(formData.get("amount")) || undefined,
        stage: "PROSPECT",
        companyId: companyId || undefined,
        personId: personId || undefined,
      });
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
    router.refresh();
  };

  return (
    <div className="h-full flex flex-col">
      <div className="sm:flex sm:items-center pb-6">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-white">Oportunidades (Pipeline)</h1>
          <p className="mt-2 text-sm text-slate-300">Arrastra y suelta las oportunidades para avanzar en el embudo de ventas.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex items-center gap-4">
          <input 
            type="search" 
            placeholder="Buscar oportunidad..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500 rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500"
          />
          <button onClick={() => { setEditingOpp(null); setIsModalOpen(true); }} type="button" className="flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 px-3 py-2 text-center text-sm font-semibold text-white hover:from-cyan-400 hover:to-purple-500 hover:shadow-cyan-400/40">
            <Plus className="h-4 w-4" />
            Nueva Oportunidad
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex h-full min-h-[600px] gap-4 items-start pb-4">
          <DragDropContext onDragEnd={onDragEnd}>
            {STAGES.map((stage) => {
              const filteredData = boardData[stage.id]?.filter(opp => 
                opp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                (opp.company?.name && opp.company.name.toLowerCase().includes(searchTerm.toLowerCase()))
              ) || [];

              return (
              <div key={stage.id} className="flex-shrink-0 w-80 flex flex-col h-full max-h-full rounded-md bg-white/10">
                <div className="p-3 border-b border-white/10">
                  <h3 className="font-semibold text-sm text-slate-300 flex justify-between">
                    {stage.title}
                    <span className="bg-white/20 text-slate-400 rounded-full px-2 py-0.5 text-xs">
                      {filteredData.length}
                    </span>
                  </h3>
                </div>
                
                <Droppable droppableId={stage.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto p-2 space-y-2 ${snapshot.isDraggingOver ? "bg-white/20" : ""}`}
                    >
                      {filteredData.map((opp, index) => (
                        <Draggable key={opp.id} draggableId={opp.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              onClick={() => { setEditingOpp(opp); setIsModalOpen(true); }}
                              className={`glass-card border-white/5 p-3 rounded shadow-sm border border-white/10 text-sm cursor-pointer ${snapshot.isDragging ? "shadow-lg ring-1 ring-black" : "hover:border-cyan-500/50"}`}
                            >
                              <div className="font-medium text-white">{opp.name}</div>
                              <div className="text-slate-400 font-semibold mt-1">
                                {opp.amount ? `$${Number(opp.amount).toLocaleString()}` : "-"}
                              </div>
                              
                              {(opp.company || opp.person) && (
                                <div className="mt-3 flex flex-col gap-1 text-xs text-slate-400">
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
                              <div className="mt-3 text-xs text-slate-500">
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
            )})}
          </DragDropContext>
        </div>
      </div>

      {isModalOpen && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-white/50 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <div className="relative transform overflow-hidden rounded-lg glass-card border-white/5 px-4 pb-4 pt-5 text-left shadow-xl sm:my-8 sm:w-full sm:max-w-md sm:p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold leading-6 text-white">{editingOpp ? "Editar Oportunidad" : "Nueva Oportunidad"}</h3>
                  {editingOpp && (
                    <button 
                      type="button" 
                      onClick={async () => {
                        if (confirm('¿Eliminar oportunidad?')) {
                          await deleteOpportunity(editingOpp.id);
                          setIsModalOpen(false);
                          router.refresh();
                        }
                      }} 
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Nombre del Negocio</label>
                    <input required type="text" name="name" defaultValue={editingOpp?.name} className="mt-1 block w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500" placeholder="Ej. Rediseño web" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Monto Esperado (USD)</label>
                    <div className="relative mt-1 rounded-md shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <DollarSign className="h-4 w-4 text-slate-500" />
                      </div>
                      <input type="number" defaultValue={editingOpp?.amount} className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500 block w-full rounded-md border p-2 pl-10 text-sm focus:outline-none focus:border-cyan-500" name="amount" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Empresa Relacionada</label>
                    <select name="companyId" defaultValue={editingOpp?.companyId || ""} className="mt-1 block w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500">
                      <option value="">-- Sin asignar --</option>
                      {companies.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300">Persona Contacto</label>
                    <select name="personId" defaultValue={editingOpp?.personId || ""} className="mt-1 block w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500">
                      <option value="">-- Sin asignar --</option>
                      {people.map((p) => <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>)}
                    </select>
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
                    <button disabled={isSubmitting} type="submit" className="inline-flex w-full justify-center rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-cyan-400 hover:to-purple-500 hover:shadow-cyan-400/40 sm:col-start-2 disabled:opacity-50">
                      {isSubmitting ? "Guardando..." : "Guardar"}
                    </button>
                    <button onClick={() => setIsModalOpen(false)} type="button" className="mt-3 inline-flex w-full justify-center rounded-md glass-card border-white/5 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-white/5 sm:col-start-1">
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
