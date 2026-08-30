"use client";

import { useState } from "react";
import { Package, Plus, AlertTriangle, ArrowUpRight, Archive, MapPin } from "lucide-react";
import { createInvItem, createInvMovement, createWarehouse } from "@/actions/inventory";
import { useRouter } from "next/navigation";

export function InventoryClient({ 
  items, 
  movements,
  warehouses
}: { 
  items: any[];
  movements: any[];
  warehouses: any[];
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
  
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Helper to calculate total stock for an item across all warehouses
  const getTotalStock = (item: any) => item.stocks?.reduce((acc: number, curr: any) => acc + curr.quantity, 0) || 0;

  // Metrics
  const lowStockItems = items.filter(i => getTotalStock(i) <= i.minStockAlert);
  const totalItems = items.length;
  const totalValue = items.reduce((acc, curr) => acc + (getTotalStock(curr) * Number(curr.unitCost)), 0);

  const filteredItems = items.filter(i => 
    i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (i.sku && i.sku.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createInvItem({
      name: formData.get("name") as string,
      sku: formData.get("sku") as string,
      minStockAlert: Number(formData.get("minStockAlert")),
      unitCost: Number(formData.get("unitCost"))
    });
    if (res.success) {
      setIsItemModalOpen(false);
      router.refresh();
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const handleCreateWarehouse = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createWarehouse({
      name: formData.get("name") as string,
      location: formData.get("location") as string,
      isDefault: formData.get("isDefault") === "on"
    });
    if (res.success) {
      setIsWarehouseModalOpen(false);
      router.refresh();
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const handleCreateMovement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const res = await createInvMovement({
      itemId: formData.get("itemId") as string,
      warehouseId: formData.get("warehouseId") as string,
      type: formData.get("type") as string,
      quantity: Number(formData.get("quantity")),
      reason: formData.get("reason") as string,
    });
    if (res.success) {
      setIsMoveModalOpen(false);
      router.refresh();
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const openMoveModal = (itemId?: string) => {
    setSelectedItemId(itemId || null);
    setIsMoveModalOpen(true);
  };

  return (
    <div className="space-y-6">
      
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        <div className="glass-card p-6 rounded-xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <MapPin className="w-5 h-5 text-purple-400" />
            <h3 className="text-sm font-semibold uppercase">Ubicaciones</h3>
          </div>
          <p className="text-3xl font-bold text-white">{warehouses.length}</p>
        </div>

        <div className="glass-card p-6 rounded-xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <Archive className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold uppercase">Catálogo de Art.</h3>
          </div>
          <p className="text-3xl font-bold text-white">{totalItems}</p>
        </div>

        <div className="glass-card p-6 rounded-xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <Package className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold uppercase">Valor Inventario</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-400">
            ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass-card p-6 rounded-xl border border-amber-500/20 bg-amber-500/5 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2 text-amber-500/80">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold uppercase">Stock Crítico</h3>
          </div>
          <p className="text-3xl font-bold text-amber-400">
            {lowStockItems.length}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="relative w-full sm:w-96">
          <input 
            type="search" 
            placeholder="Buscar por nombre o SKU..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#01040f] border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setIsWarehouseModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-white/10 transition-all border border-white/10"
          >
            <MapPin className="w-4 h-4" />
            Nuevo Almacén
          </button>
          <button 
            onClick={() => openMoveModal()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold text-white hover:bg-white/20 transition-all border border-white/10"
          >
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            Ajuste / Mover
          </button>
          <button 
            onClick={() => setIsItemModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white hover:from-cyan-400 hover:to-purple-500 transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            Nuevo Artículo
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Artículo / SKU</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Desglose por Almacén</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Stock Total</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Costo Uni.</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredItems.map((item) => {
                const stock = getTotalStock(item);
                const isLow = stock <= item.minStockAlert;
                
                return (
                  <tr key={item.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-white">{item.name}</div>
                      <div className="text-xs text-slate-500">{item.sku || 'Sin SKU'}</div>
                      {item.ecomVariantId && (
                        <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full mt-1 inline-block">Tienda Web</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.stocks?.map((st: any) => {
                        const wh = warehouses.find(w => w.id === st.warehouseId);
                        return (
                          <div key={st.id} className="text-xs text-slate-300 flex justify-between w-32 border-b border-white/5 pb-1 mb-1">
                            <span>{wh?.name || 'Desconocido'}:</span>
                            <span className="font-bold text-white">{st.quantity}</span>
                          </div>
                        )
                      })}
                      {(!item.stocks || item.stocks.length === 0) && (
                        <span className="text-xs text-slate-500">Sin existencias</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center align-top">
                      <span className={`text-lg font-bold px-3 py-1 rounded-full ${isLow ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                        {stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-sm text-white align-top">
                      ${Number(item.unitCost).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-right align-top">
                      <button 
                        onClick={() => openMoveModal(item.id)}
                        className="text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-3 py-1.5 rounded transition-colors text-xs font-bold"
                      >
                        Ajustar Stock
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    No se encontraron artículos en el almacén.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Warehouse Modal */}
      {isWarehouseModalOpen && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsWarehouseModalOpen(false)} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="mx-auto max-w-md w-full bg-[#0a1526] rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h2 className="text-lg font-semibold text-white">Nuevo Almacén / Sucursal</h2>
                <button onClick={() => setIsWarehouseModalOpen(false)} className="text-slate-400 hover:text-white">X</button>
              </div>
              <form onSubmit={handleCreateWarehouse} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Nombre de Ubicación</label>
                  <input type="text" required name="name" className="w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:border-cyan-500" placeholder="Ej. Matriz Monterrey" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Dirección (Opcional)</label>
                  <input type="text" name="location" className="w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:border-cyan-500" />
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <input type="checkbox" name="isDefault" id="isDefault" className="w-4 h-4 accent-cyan-500" />
                  <label htmlFor="isDefault" className="text-sm text-slate-300">
                    Almacén por defecto para Tienda Virtual
                  </label>
                </div>
                <div className="mt-6">
                  <button disabled={loading} type="submit" className="w-full flex justify-center items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
                    {loading ? "Guardando..." : "Registrar Almacén"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Item Modal */}
      {isItemModalOpen && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsItemModalOpen(false)} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="mx-auto max-w-md w-full bg-[#0a1526] rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h2 className="text-lg font-semibold text-white">Nuevo Artículo</h2>
                <button onClick={() => setIsItemModalOpen(false)} className="text-slate-400 hover:text-white">X</button>
              </div>
              <form onSubmit={handleCreateItem} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Nombre del Artículo</label>
                  <input type="text" required name="name" className="w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:border-cyan-500" placeholder="Ej. Empaques Medianos" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">SKU / Código</label>
                  <input type="text" name="sku" className="w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:border-cyan-500" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Alerta Mínima</label>
                    <input type="number" required defaultValue="5" name="minStockAlert" className="w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:border-cyan-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Costo Unit. Promedio</label>
                    <input type="number" step="0.01" required defaultValue="0" name="unitCost" className="w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:border-cyan-500" />
                  </div>
                </div>
                <div className="mt-6">
                  <button disabled={loading} type="submit" className="w-full flex justify-center items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
                    {loading ? "Guardando..." : "Guardar Artículo"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Move/Adjust Modal */}
      {isMoveModalOpen && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMoveModalOpen(false)} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="mx-auto max-w-md w-full bg-[#0a1526] rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h2 className="text-lg font-semibold text-white">Ajuste / Traslado de Kardex</h2>
                <button onClick={() => setIsMoveModalOpen(false)} className="text-slate-400 hover:text-white">X</button>
              </div>
              <form onSubmit={handleCreateMovement} className="p-6 space-y-4">
                
                {warehouses.length === 0 && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/50 rounded-lg text-rose-400 text-sm mb-4">
                    Atención: No has creado ningún almacén. Necesitas crear uno antes de registrar movimientos.
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Almacén Destino / Origen</label>
                  <select name="warehouseId" required className="w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:border-cyan-500">
                    {warehouses.map(w => <option key={w.id} value={w.id}>{w.name} {w.isDefault ? '(Default)' : ''}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Artículo</label>
                  <select name="itemId" required defaultValue={selectedItemId || ""} className="w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:border-cyan-500">
                    <option value="" disabled>Selecciona un artículo...</option>
                    {items.map(i => <option key={i.id} value={i.id}>{i.name} (Stock Total: {getTotalStock(i)})</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Tipo de Movimiento</label>
                    <select name="type" required className="w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:border-cyan-500">
                      <option value="IN">Entrada (+)</option>
                      <option value="OUT">Salida (-)</option>
                      <option value="ADJUSTMENT">Merma / Ajuste (-)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Cantidad</label>
                    <input type="number" required min="1" defaultValue="1" name="quantity" className="w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:border-cyan-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Razón / Referencia</label>
                  <input type="text" required name="reason" className="w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:border-cyan-500" placeholder="Ej. Conteo físico, Producto dañado..." />
                </div>
                <div className="mt-6">
                  <button disabled={loading || warehouses.length === 0} type="submit" className="w-full flex justify-center items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50">
                    {loading ? "Procesando..." : "Registrar Movimiento"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
