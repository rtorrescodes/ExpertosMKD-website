"use client";

import { useState } from "react";
import { Plus, Wallet, ArrowDownToLine, ArrowUpFromLine, Search, CheckCircle, Clock } from "lucide-react";
import { createTransaction, updateTransactionStatus } from "@/actions/erp";
import { useRouter } from "next/navigation";

export function ErpDashboardClient({ 
  transactions, 
  accounts 
}: { 
  transactions: any[];
  accounts: any[];
}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Calculate metrics
  const totalIncome = transactions.filter(t => t.type === "INCOME").reduce((acc, curr) => acc + Number(curr.amount), 0);
  const totalExpense = transactions.filter(t => t.type === "EXPENSE").reduce((acc, curr) => acc + Number(curr.amount), 0);
  const pendingReceivables = transactions.filter(t => t.type === "INCOME" && t.status === "PENDING").reduce((acc, curr) => acc + Number(curr.amount), 0);
  
  const balance = totalIncome - totalExpense;

  const filteredTransactions = transactions.filter(t => 
    (t.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    const res = await createTransaction({
      accountId: formData.get("accountId") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
      category: formData.get("category") as string,
      amount: Number(formData.get("amount")),
      description: formData.get("description") as string,
    });

    if (res.success) {
      setIsModalOpen(false);
      router.refresh();
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  const handleMarkAsPaid = async (id: string) => {
    setLoading(true);
    const res = await updateTransactionStatus(id, "PAID");
    if (res.success) {
      router.refresh();
    } else {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-6 rounded-xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <Wallet className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-semibold uppercase">Balance General</h3>
          </div>
          <p className="text-3xl font-bold text-white">
            ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass-card p-6 rounded-xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <ArrowDownToLine className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-semibold uppercase">Ingresos Totales</h3>
          </div>
          <p className="text-3xl font-bold text-emerald-400">
            ${totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass-card p-6 rounded-xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <ArrowUpFromLine className="w-5 h-5 text-rose-400" />
            <h3 className="text-sm font-semibold uppercase">Egresos Totales</h3>
          </div>
          <p className="text-3xl font-bold text-rose-400">
            ${totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass-card p-6 rounded-xl border border-amber-500/20 bg-amber-500/5 flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-2 text-amber-500/80">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-semibold uppercase">Por Cobrar</h3>
          </div>
          <p className="text-3xl font-bold text-amber-400">
            ${pendingReceivables.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="search" 
            placeholder="Buscar transacciones..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#01040f] border border-white/10 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 text-sm font-semibold text-white hover:from-cyan-400 hover:to-purple-500 transition-all shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          Registrar Movimiento
        </button>
      </div>

      {/* Transactions Table */}
      <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/10">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-300 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Monto</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-300 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-300 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                    {new Date(tx.date).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-medium">
                    {tx.description}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    <span className="bg-white/10 px-2 py-1 rounded text-xs">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-right font-bold">
                    <span className={tx.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}>
                      {tx.type === 'INCOME' ? '+' : '-'}${Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-center">
                    {tx.status === 'PAID' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full text-xs font-bold">
                        <CheckCircle className="w-3 h-3" /> Pagado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-500/10 px-2 py-1 rounded-full text-xs font-bold">
                        <Clock className="w-3 h-3" /> Pendiente
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-right">
                    {tx.status === 'PENDING' && (
                      <button 
                        onClick={() => handleMarkAsPaid(tx.id)}
                        disabled={loading}
                        className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded hover:bg-cyan-500/20 transition-colors"
                      >
                        Marcar Pagado
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredTransactions.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    No hay transacciones registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="relative z-50">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <div className="mx-auto max-w-md w-full bg-[#0a1526] rounded-xl shadow-2xl border border-white/10 overflow-hidden flex flex-col">
              
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <h2 className="text-lg font-semibold text-white">Registrar Movimiento</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  X
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4">
                {accounts.length > 0 ? (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Cuenta</label>
                    <select name="accountId" required className="w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500">
                      {accounts.map((a: any) => (
                        <option key={a.id} value={a.id}>{a.name} ({a.currency})</option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div className="p-3 bg-rose-500/20 border border-rose-500/50 rounded-lg text-rose-400 text-sm">
                    No tienes cuentas creadas. El sistema creará una automáticamente.
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Tipo</label>
                    <select name="type" required className="w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500">
                      <option value="EXPENSE">Egreso (Gasto)</option>
                      <option value="INCOME">Ingreso (Venta)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">Estado</label>
                    <select name="status" required className="w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500">
                      <option value="PAID">Pagado / Cobrado</option>
                      <option value="PENDING">Pendiente</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Categoría</label>
                  <select name="category" required className="w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500">
                    <option value="PURCHASES">Compras Generales</option>
                    <option value="SOFTWARE">Software / Suscripciones</option>
                    <option value="PAYROLL">Nómina / Servicios</option>
                    <option value="SALES">Ventas Varias</option>
                    <option value="TAXES">Impuestos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Monto</label>
                  <input type="number" step="0.01" required name="amount" className="w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500" placeholder="Ej. 1500.00" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Descripción</label>
                  <input type="text" required name="description" className="w-full bg-[#01040f] border-white/10 text-white rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500" placeholder="Ej. Pago de hosting mensual" />
                </div>

                <div className="mt-6">
                  <button disabled={loading} type="submit" className="w-full flex justify-center items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 px-4 py-2 text-sm font-semibold text-white hover:from-cyan-400 hover:to-purple-500 transition-all disabled:opacity-50">
                    {loading ? "Guardando..." : "Registrar"}
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
