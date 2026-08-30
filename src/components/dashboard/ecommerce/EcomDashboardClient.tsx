"use client";
import { useState } from "react";
import { Plus, Package, ShoppingBag, ExternalLink, Trash2 } from "lucide-react";
import { createProduct, updateProduct, deleteProduct } from "@/actions/ecommerce";
import { useRouter } from "next/navigation";

export function EcomDashboardClient({ tenantSubdomain, products, orders }: { tenantSubdomain: string, products: any[], orders: any[] }) {
  const router = useRouter();
  const [tab, setTab] = useState("PRODUCTS");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredOrders = orders.filter(o => 
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.displayId.toString().includes(searchTerm)
  );

  const openModal = (product?: any) => {
    if (product) {
      setEditingProduct(product);
      setTitle(product.title);
      setDescription(product.description || "");
      setPrice(product.variants[0]?.price || 0);
      setStock(product.variants[0]?.inventoryQuantity || 0);
    } else {
      setEditingProduct(null);
      setTitle("");
      setDescription("");
      setPrice(0);
      setStock(0);
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async () => {
    let res;
    if (editingProduct) {
      res = await updateProduct(editingProduct.id, { title, description, price: Number(price), inventoryQuantity: Number(stock) });
    } else {
      res = await createProduct({ title, description, price: Number(price), inventoryQuantity: Number(stock) });
    }
    
    if (res.success) {
      setIsModalOpen(false);
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
      const res = await deleteProduct(id);
      if (res.success) {
        setIsModalOpen(false);
        router.refresh();
      } else {
        alert(res.error);
      }
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-white">Tienda Virtual</h1>
          <p className="mt-2 text-sm text-slate-300">
            Gestiona tu catálogo de productos y las órdenes recibidas.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 flex gap-2 items-center">
          <input 
            type="search" 
            placeholder="Buscar..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-slate-900/60 border-white/10 text-white placeholder-slate-500 rounded-md border p-2 text-sm focus:outline-none focus:border-cyan-500 mr-2"
          />
          <a
            href={`/site/${tenantSubdomain}/store`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md glass-card border-white/5 border border-white/10 px-3 py-2 text-sm font-semibold text-slate-300 shadow-sm hover:bg-white/5"
          >
            Ver Tienda <ExternalLink className="h-4 w-4" />
          </a>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 rounded-md bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:from-cyan-400 hover:to-purple-500 hover:shadow-cyan-400/40"
          >
            <Plus className="h-4 w-4" />
            Añadir Producto
          </button>
        </div>
      </div>

      <div className="mt-6 border-b border-white/10">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setTab("PRODUCTS")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2 ${tab === "PRODUCTS" ? "border-black text-white" : "border-transparent text-slate-400 hover:border-white/10 hover:text-slate-300"}`}
          >
            <Package className="w-4 h-4" /> Catálogo
          </button>
          <button
            onClick={() => setTab("ORDERS")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2 ${tab === "ORDERS" ? "border-black text-white" : "border-transparent text-slate-400 hover:border-white/10 hover:text-slate-300"}`}
          >
            <ShoppingBag className="w-4 h-4" /> Órdenes
            <span className="bg-white/10 text-white ml-2 rounded-full py-0.5 px-2.5 text-xs font-medium">{filteredOrders.length}</span>
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {tab === "PRODUCTS" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map(p => (
              <div key={p.id} onClick={() => openModal(p)} className="border border-white/10 rounded-lg p-4 glass-card border-white/5 shadow-sm flex flex-col justify-between cursor-pointer hover:border-cyan-500/50 transition-colors">
                <div>
                  <div className="h-32 bg-white/10 rounded-md mb-4 flex items-center justify-center text-slate-500">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-white truncate">{p.title}</h3>
                  <p className="text-xs text-slate-400 truncate">{p.handle}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                  <span className="font-bold">${p.variants[0]?.price}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.variants[0]?.inventoryQuantity > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}`}>
                    Stock: {p.variants[0]?.inventoryQuantity}
                  </span>
                </div>
              </div>
            ))}
            {filteredProducts.length === 0 && <p className="text-slate-400 text-sm col-span-4">No hay productos que coincidan con tu búsqueda.</p>}
          </div>
        )}

        {tab === "ORDERS" && (
          <div className="overflow-hidden glass-card border-white/5 shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-white/10">
              <thead className="bg-white/5">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white">Orden</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Cliente</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Estatus</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Total</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 glass-card border-white/5">
                {filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-white/5">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white">#{o.displayId}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400">{o.customerName}<br/><span className="text-xs text-slate-500">{o.customerEmail}</span></td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${o.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-white">${o.total}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass-card border-white/5 rounded-lg p-6 max-w-md w-full shadow-xl bg-[#0a1526]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">{editingProduct ? "Editar Producto" : "Añadir Producto"}</h3>
              {editingProduct && (
                <button onClick={() => handleDeleteProduct(editingProduct.id)} className="text-red-400 hover:text-red-300">
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300">Título</label>
                <input type="text" className="bg-[#01040f] border-white/10 text-white placeholder-slate-500 mt-1 w-full border rounded-md p-2 text-sm focus:outline-none focus:border-cyan-500" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ej. Taza Celeritas" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-300">Precio Base</label>
                  <input type="number" className="bg-[#01040f] border-white/10 text-white placeholder-slate-500 mt-1 w-full border rounded-md p-2 text-sm focus:outline-none focus:border-cyan-500" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-slate-300">Stock Inicial</label>
                  <input type="number" className="bg-[#01040f] border-white/10 text-white placeholder-slate-500 mt-1 w-full border rounded-md p-2 text-sm focus:outline-none focus:border-cyan-500" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300">Descripción</label>
                <textarea className="bg-[#01040f] border-white/10 text-white placeholder-slate-500 mt-1 w-full border rounded-md p-2 text-sm focus:outline-none focus:border-cyan-500" value={description} onChange={(e) => setDescription(e.target.value)} rows={3}></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 rounded-md">Cancelar</button>
              <button onClick={handleSaveProduct} disabled={!title} className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-purple-500 hover:shadow-cyan-400/40 rounded-md disabled:opacity-50">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
