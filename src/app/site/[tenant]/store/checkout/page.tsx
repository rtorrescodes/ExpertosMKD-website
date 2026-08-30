"use client";

import { useState } from "react";
import { useStoreCart } from "../StoreCartProvider";
import { createOrder } from "@/actions/ecommerce";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

import { use } from "react";

export default function CheckoutPage(props: { params: Promise<{ tenant: string }> }) {
  const { tenant } = use(props.params);
  const { items, total, clearCart } = useStoreCart();
  
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setIsSubmitting(true);
    setErrorMsg("");

    const res = await createOrder({
      tenantSubdomain: tenant,
      customerName,
      customerEmail,
      cartItems: items.map(i => ({ variantId: i.variantId, quantity: i.quantity }))
    });

    setIsSubmitting(false);

    if (res.success) {
      setSuccessOrderId(res.orderId);
      clearCart();
    } else {
      setErrorMsg(res.error);
    }
  };

  if (successOrderId) {
    return (
      <div className="max-w-xl mx-auto mt-24 text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">¡Gracias por tu compra!</h1>
        <p className="text-gray-600 mb-8">
          Tu orden <strong>#{successOrderId}</strong> ha sido procesada con éxito.<br/>
          Te enviaremos los detalles y actualizaciones a <strong>{customerEmail}</strong>.
        </p>
        <Link href={`/site/${tenant}/store`} className="px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800">
          Volver a la Tienda
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-24">
        <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
        <Link href={`/site/${tenant}/store`} className="text-blue-600 font-medium hover:underline">Continuar comprando</Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
      {/* Resumen del Carrito */}
      <div className="md:w-1/2">
        <h2 className="text-2xl font-bold mb-6">Resumen del Pedido</h2>
        <div className="bg-gray-50 rounded-2xl p-6">
          <ul className="divide-y divide-gray-200">
            {items.map(item => (
              <li key={item.variantId} className="py-4 flex justify-between">
                <div>
                  <p className="font-medium text-gray-900">{item.title}</p>
                  <p className="text-sm text-gray-500">Cant: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
              </li>
            ))}
          </ul>
          <div className="pt-6 mt-6 border-t border-gray-200 flex justify-between items-center text-xl font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Formulario de Checkout */}
      <div className="md:w-1/2">
        <h2 className="text-2xl font-bold mb-6">Tus Datos</h2>
        <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-2xl p-8">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre Completo</label>
            <input required type="text" value={customerName} onChange={e => setCustomerName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-black focus:ring-black" />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Correo Electrónico</label>
            <input required type="email" value={customerEmail} onChange={e => setCustomerEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border focus:border-black focus:ring-black" />
          </div>

          <div className="pt-4 border-t border-gray-100">
            <h3 className="font-medium text-gray-900 mb-4">Método de Pago</h3>
            <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg text-sm text-blue-800">
              Esta es una tienda de prueba (SaaS Demo). No se realizarán cargos reales en tu tarjeta.
            </div>
          </div>

          {errorMsg && <p className="text-red-600 text-sm">{errorMsg}</p>}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-black text-white rounded-xl py-4 font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? "Procesando..." : "Completar Pedido"}
          </button>
        </form>
      </div>
    </div>
  );
}
