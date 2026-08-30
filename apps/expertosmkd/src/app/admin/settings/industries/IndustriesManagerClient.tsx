'use client'

import { useState } from 'react'
import { Plus, Edit2, Trash2, X, Briefcase, AlertTriangle, ArrowRight } from 'lucide-react'
import { createIndustry, updateIndustry, deleteIndustry } from '@/actions/industry-actions'
import { useRouter } from 'next/navigation'

export function IndustriesManagerClient({ initialIndustries }: { initialIndustries: any[] }) {
  const router = useRouter()
  const [industries, setIndustries] = useState(initialIndustries)
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [newName, setNewName] = useState('')
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const [deleteData, setDeleteData] = useState<{ id: string, name: string, count: number } | null>(null)
  const [fallbackId, setFallbackId] = useState<string>('')
  
  const [loading, setLoading] = useState(false)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const res = await createIndustry(newName)
    if (res.success && res.industry) {
      setIndustries(prev => [...prev, { ...res.industry, _count: { leads: 0 } }].sort((a, b) => a.name.localeCompare(b.name)))
      setIsCreateOpen(false)
      setNewName('')
      router.refresh()
    } else {
      alert(res.error)
    }
    setLoading(false)
  }

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return
    setLoading(true)
    const res = await updateIndustry(id, editName)
    if (res.success && res.industry) {
      setIndustries(prev => prev.map(ind => ind.id === id ? { ...ind, name: res.industry.name } : ind))
      setEditingId(null)
      setEditName('')
      router.refresh()
    } else {
      alert(res.error)
    }
    setLoading(false)
  }

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!deleteData) return
    setLoading(true)
    
    // Si elegimos "none", pasamos undefined para que los deje en null
    const fallback = fallbackId === 'none' || fallbackId === '' ? undefined : fallbackId
    
    const res = await deleteIndustry(deleteData.id, fallback)
    if (res.success) {
      setIndustries(prev => prev.filter(ind => ind.id !== deleteData.id))
      setDeleteData(null)
      setFallbackId('')
      router.refresh()
    } else {
      alert(res.error)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-cyan-500" />
          Giros y Categorías
        </h2>
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-medium rounded-lg transition-colors shadow-lg shadow-cyan-500/20"
        >
          <Plus className="w-4 h-4" /> Agregar Giro
        </button>
      </div>

      <div className="glass-card rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-[#0b101e] text-xs uppercase tracking-wider text-slate-500 border-b border-white/5">
            <tr>
              <th className="px-6 py-4 font-bold">Giro / Industria</th>
              <th className="px-6 py-4 font-bold text-center">Prospectos Vinculados</th>
              <th className="px-6 py-4 font-bold text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-slate-900/20">
            {industries.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                  No hay giros registrados.
                </td>
              </tr>
            ) : (
              industries.map(ind => (
                <tr key={ind.id} className="hover:bg-white/[0.04] transition-colors">
                  <td className="px-6 py-4">
                    {editingId === ind.id ? (
                      <input 
                        autoFocus
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleUpdate(ind.id)}
                        className="bg-[#050810] border border-cyan-500/50 rounded-md px-3 py-1.5 text-sm text-white focus:outline-none w-full max-w-xs"
                      />
                    ) : (
                      <span className="font-medium text-white">{ind.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-slate-800 border border-white/10 text-xs font-medium text-slate-300">
                      {ind._count?.leads || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {editingId === ind.id ? (
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setEditingId(null)} className="text-slate-400 hover:text-white px-2 py-1 text-xs">Cancelar</button>
                        <button onClick={() => handleUpdate(ind.id)} className="text-cyan-400 hover:text-cyan-300 font-medium px-2 py-1 text-xs">Guardar</button>
                      </div>
                    ) : (
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => { setEditingId(ind.id); setEditName(ind.name); }}
                          className="text-slate-500 hover:text-cyan-400 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => setDeleteData({ id: ind.id, name: ind.name, count: ind._count?.leads || 0 })}
                          className="text-slate-500 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Agregar */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0b101e] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h3 className="text-lg font-bold text-white">Nuevo Giro</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreate} className="p-6">
              <label className="block text-xs font-semibold text-slate-400 mb-2">Nombre del Giro (ej. Restaurantes)</label>
              <input 
                required 
                autoFocus
                value={newName} 
                onChange={e => setNewName(e.target.value)} 
                className="w-full bg-[#050810] border border-white/10 rounded-lg px-4 py-3 text-sm text-slate-200 focus:border-cyan-500 outline-none" 
              />
              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-slate-400 hover:text-white transition">Cancelar</button>
                <button type="submit" disabled={loading || !newName.trim()} className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition disabled:opacity-50">
                  {loading ? 'Guardando...' : 'Crear Giro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Eliminar */}
      {deleteData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0b101e] border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-fade-in">
            <div className="p-6">
              <div className="flex items-center gap-3 text-red-400 mb-4">
                <AlertTriangle className="w-6 h-6" />
                <h3 className="text-lg font-bold">Eliminar Giro</h3>
              </div>
              <p className="text-slate-300 text-sm mb-6">
                Estás a punto de eliminar el giro <span className="font-bold text-white">"{deleteData.name}"</span>.
              </p>

              {deleteData.count > 0 && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 mb-6">
                  <p className="text-red-400 text-sm font-medium mb-3">
                    Hay {deleteData.count} prospecto(s) vinculados a este giro. ¿Qué deseas hacer con ellos?
                  </p>
                  <form id="delete-industry-form" onSubmit={handleDelete} className="space-y-4">
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="fallbackAction"
                        value="none"
                        checked={fallbackId === 'none' || fallbackId === ''}
                        onChange={() => setFallbackId('none')}
                        className="mt-1"
                      />
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-red-300 transition">Dejarlos sin Giro</p>
                        <p className="text-xs text-slate-500">Se eliminará el giro de su perfil pero seguirán en la base de datos.</p>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 cursor-pointer group">
                      <input 
                        type="radio" 
                        name="fallbackAction"
                        value="move"
                        checked={fallbackId !== 'none' && fallbackId !== ''}
                        onChange={() => {
                          const otherIndustries = industries.filter(i => i.id !== deleteData.id)
                          if (otherIndustries.length > 0) setFallbackId(otherIndustries[0].id)
                        }}
                        className="mt-1"
                      />
                      <div className="w-full">
                        <p className="text-sm font-medium text-white group-hover:text-red-300 transition flex items-center gap-2">
                          Mover a otro giro <ArrowRight className="w-3 h-3" />
                        </p>
                        {fallbackId !== 'none' && fallbackId !== '' && (
                          <div className="mt-2">
                            <select 
                              value={fallbackId}
                              onChange={e => setFallbackId(e.target.value)}
                              className="w-full bg-[#050810] border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-red-500"
                            >
                              {industries.filter(i => i.id !== deleteData.id).map(ind => (
                                <option key={ind.id} value={ind.id}>{ind.name}</option>
                              ))}
                            </select>
                          </div>
                        )}
                      </div>
                    </label>
                  </form>
                </div>
              )}

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => { setDeleteData(null); setFallbackId(''); }} className="px-4 py-2 text-slate-400 hover:text-white transition">Cancelar</button>
                <button 
                  form={deleteData.count > 0 ? "delete-industry-form" : undefined}
                  onClick={deleteData.count === 0 ? handleDelete : undefined}
                  type="submit" 
                  disabled={loading} 
                  className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition disabled:opacity-50"
                >
                  {loading ? 'Eliminando...' : 'Sí, Eliminar Definitivamente'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
