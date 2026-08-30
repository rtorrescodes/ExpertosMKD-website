"use client";

import { useState } from "react";
import { Package, Minus, Plus } from "lucide-react";
import { useStoreCart } from "../../StoreCartProvider";

export function ProductPageClient({ product }: { product: any }) {
  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useStoreCart();

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    
    addItem({
      variantId: selectedVariant.id,
      title: `${product.title} ${selectedVariant.title !== 'Default' ? `(${selectedVariant.title})` : ''}`,
      price: Number(selectedVariant.price),
      quantity
    });
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-12 max-w-5xl mx-auto">
      {/* Image Gallery */}
      <div className="md:w-1/2">
        <div className="aspect-[4/5] bg-white/10 rounded-3xl overflow-hidden flex items-center justify-center">
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
          ) : (
            <Package className="w-24 h-24 text-gray-300" />
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="md:w-1/2 flex flex-col pt-8">
        <h1 className="text-4xl font-bold text-white mb-2">{product.title}</h1>
        <p className="text-2xl text-slate-400 mb-8">${Number(selectedVariant?.price || 0).toFixed(2)}</p>

        {product.description && (
          <div className="prose prose-sm text-slate-400 mb-8">
            <p>{product.description}</p>
          </div>
        )}

        {/* Variants Selector */}
        {product.variants.length > 1 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium text-white mb-3">Variante</h3>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v: any) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${selectedVariant?.id === v.id ? 'border-black bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 text-white' : 'border-white/10 text-slate-300 hover:border-gray-400'}`}
                >
                  {v.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="mb-8 flex items-center gap-4">
          <div className="flex items-center border border-white/10 rounded-md">
            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 text-slate-400 hover:text-white">
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center font-medium text-sm">{quantity}</span>
            <button onClick={() => setQuantity(quantity + 1)} className="p-2 text-slate-400 hover:text-white">
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <span className="text-sm text-slate-400">
            {selectedVariant?.inventoryQuantity} disponibles en stock
          </span>
        </div>

        <button 
          onClick={handleAddToCart}
          disabled={!selectedVariant || selectedVariant.inventoryQuantity < 1}
          className={`w-full py-4 rounded-xl text-lg font-semibold transition-all ${added ? 'bg-green-500 text-white' : 'bg-gradient-to-r from-cyan-500 to-purple-600 shadow-lg shadow-cyan-500/20 text-white hover:from-cyan-400 hover:to-purple-500 hover:shadow-cyan-400/40 disabled:bg-gray-300'}`}
        >
          {added ? '¡Añadido al Carrito!' : (selectedVariant?.inventoryQuantity < 1 ? 'Agotado' : 'Añadir al Carrito')}
        </button>
      </div>
    </div>
  );
}
