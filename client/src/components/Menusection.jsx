import React, { useState } from 'react';
import { ShoppingCart, Star, Flame } from 'lucide-react';

const Menu = () => {
  const [filter, setFilter] = useState('All');

  const dishes = [
    { 
      id: 1, 
      name: 'Signature Pepperoni Pizza', 
      price: '$18', 
      cat: 'Main', 
      img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800',
      tag: 'Best Seller'
    },
    { 
      id: 2, 
      name: 'Paneer Butter Masala', 
      price: '$16', 
      cat: 'Main', 
      img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800',
      tag: 'Chef Choice'
    },
    { 
      id: 3, 
      name: 'Fragrant Jeera Rice', 
      price: '$10', 
      cat: 'Main', 
      img: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&q=80&w=800'
    },
    { 
      id: 4, 
      name: 'Sizzling Chocolate Brownie', 
      price: '$12', 
      cat: 'Dessert', 
      img: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&q=80&w=800'
    },
    { 
      id: 5, 
      name: 'Artisan Vanilla Bean Ice Cream', 
      price: '$8', 
      cat: 'Ice Cream', 
      img: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&q=80&w=800'
    },
  ];

  const categories = ['All', 'Main', 'Dessert', 'Ice Cream'];

  return (
    <section className="bg-[#0a0a0a] py-24 px-8 text-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#ef4444] font-bold uppercase tracking-[0.3em] text-xs mb-3">Menu Selection</p>
          <h2 className="text-5xl font-black">Our Most Loved Dishes</h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-2 rounded-full border-2 transition-all font-bold ${
                filter === cat 
                ? 'bg-[#ef4444] border-[#ef4444] text-white shadow-lg shadow-red-900/20' 
                : 'border-white/5 text-gray-400 hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dish Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {dishes.filter(d => filter === 'All' || d.cat === filter).map(dish => (
            <div key={dish.id} className="bg-[#161616] rounded-[2.5rem] overflow-hidden border border-white/5 group hover:border-[#ef4444]/40 transition-all duration-500">
              
              {/* Image Container */}
              <div className="h-72 overflow-hidden relative">
                {dish.tag && (
                  <span className="absolute top-4 left-4 z-20 bg-[#ef4444] text-white text-[10px] font-black uppercase px-3 py-1 rounded-lg flex items-center gap-1">
                    <Flame size={12} /> {dish.tag}
                  </span>
                )}
                <img 
                  src={dish.img} 
                  alt={dish.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" 
                />
              </div>

              {/* Content Container */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <h4 className="text-2xl font-bold group-hover:text-[#ef4444] transition-colors">{dish.name}</h4>
                  <span className="text-2xl font-black text-white">{dish.price}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-8">
                  <div className="flex text-[#ef4444]">
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                  <span className="text-gray-500 text-xs">(100+ Reviews)</span>
                </div>

                <button className="w-full bg-white text-black py-4 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-[#ef4444] hover:text-white transition-all transform active:scale-95">
                  <ShoppingCart size={20} /> Add to Order
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Menu;