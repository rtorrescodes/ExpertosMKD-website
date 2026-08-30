"use client";

import { useState } from "react";
import { Plus, Package, ShoppingBag, ExternalLink } from "lucide-react";
import { createProduct } from "@/actions/ecommerce";
import { useRouter } from "next/navigation";

export function EcomDashboardClient({ tenantSubdomain, products, orders }: { tenantSubdomain: string, products: any[], orders: any[] }) {
  const router = useRouter();
  const [tab, setTab] = useState("PRODUCTS");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);

  const handleCreateProduct = async () => {
    const res = await createProduct({ title, description, price: Number(price), inventoryQuantity: Number(stock) });
    if (res.success) {
      setIsModalOpen(false);
      setTitle("");
      setDescription("");
      setPrice(0);
      setStock(0);
      router.refresh();
    } else {
      alert(res.error);
    }
  };

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Tienda Virtual</h1>
          <p className="mt-2 text-sm text-gray-700">
            Gestiona tu catálogo de productos y las órdenes recibidas.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 flex gap-2">
          <a
            href={`/site/${tenantSubdomain}/store`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-md bg-white border border-gray-300 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Ver Tienda <ExternalLink className="h-4 w-4" />
          </a>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
          >
            <Plus className="h-4 w-4" />
            Añadir Producto
          </button>
        </div>
      </div>

      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setTab("PRODUCTS")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2 ${tab === "PRODUCTS" ? "border-black text-black" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
          >
            <Package className="w-4 h-4" /> Catálogo
          </button>
          <button
            onClick={() => setTab("ORDERS")}
            className={`whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium flex items-center gap-2 ${tab === "ORDERS" ? "border-black text-black" : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"}`}
          >
            <ShoppingBag className="w-4 h-4" /> Órdenes
            <span className="bg-gray-100 text-gray-900 ml-2 rounded-full py-0.5 px-2.5 text-xs font-medium">{orders.length}</span>
          </button>
        </nav>
      </div>

      <div className="mt-8">
        {tab === "PRODUCTS" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {products.map(p => (
              <div key={p.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="h-32 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400">
                    <Package className="w-8 h-8" />
                  </div>
                  <h3 className="font-semibold text-gray-900 truncate">{p.title}</h3>
                  <p className="text-xs text-gray-500 truncate">{p.handle}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
                  <span className="font-bold">${p.variants[0]?.price}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.variants[0]?.inventoryQuantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    Stock: {p.variants[0]?.inventoryQuantity}
                  </span>
                </div>
              </div>
            ))}
            {products.length === 0 && <p className="text-gray-500 text-sm col-span-4">No hay productos en el catálogo.</p>}
          </div>
        )}

        {tab === "ORDERS" && (
          <div className="overflow-hidden bg-white shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900">Orden</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Cliente</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Estatus</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900">#{o.displayId}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{o.customerName}<br/><span className="text-xs text-gray-400">{o.customerEmail}</span></td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${o.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-900">${o.total}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-bold mb-4">Añadir Producto</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Título</label>
                <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full border rounded-md p-2 text-sm" placeholder="Ej. Taza Celeritas" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Precio Base</label>
                  <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="mt-1 w-full border rounded-md p-2 text-sm" />
                </div>
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">Stock Inicial</label>
                  <input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="mt-1 w-full border rounded-md p-2 text-sm" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full border rounded-md p-2 text-sm" rows={3}></textarea>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md">Cancelar</button>
              <button onClick={handleCreateProduct} disabled={!title} className="px-4 py-2 text-sm font-medium text-white bg-black hover:bg-gray-800 rounded-md disabled:opacity-50">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
