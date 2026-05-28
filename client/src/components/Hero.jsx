import React, { useState } from 'react';
import { Utensils, Clock, Users, ArrowRight, Star } from 'lucide-react';

const Hero = () => {
  // Logic: In the future, this state will be updated via an API call to your Node.js backend
  const [todaysSpecial] = useState("Smoked Ribeye Steak");

  return (
    <section className="relative w-full h-[92vh] bg-[#121212] overflow-hidden flex items-center">

      {/* 1. Background Image Side */}
      <div className="absolute right-0 top-0 w-full lg:w-1/2 h-full z-0">
        <img
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=2000"
          alt="Fine Dining Table"
          className="w-full h-full object-cover opacity-60 lg:opacity-100"
        />
        {/* Gradient overlay: Blends the image into the dark background */}
        <div className="absolute inset-0 bg-gradient-to from-[#121212] via-[#121212]/40 lg:via-transparent to-transparent"></div>
      </div>

      {/* 2. Main Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 w-full grid lg:grid-cols-2">

        <div className="max-w-xl">
          {/* Subheading with Stars */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={14} className="fill-[#ef4444] text-[#ef4444]" />
              ))}
            </div>
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">
              The Best Steakhouse in Town
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-7xl font-black text-white leading-tight mb-6">
            Taste the <br />
            <span className="text-[#ef4444]">Extraordinary.</span>
          </h1>

          {/* Description */}
          <p className="text-gray-300 text-lg mb-10 leading-relaxed">
            Experience an unforgettable journey of flavors. From farm-to-table
            freshness to our chef's signature spices, every bite tells a story
            at <span className="text-white font-bold">Nilkanth Kitchen.</span>
          </p>

          {/* Call to Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-12">
            <button className="bg-[#ef4444] hover:bg-red-600 text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl shadow-red-900/20 flex items-center gap-2 group">
              Reserve A Table
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border border-white/20 hover:bg-white/10 hover:border-white/40 text-white px-8 py-4 rounded-full font-bold transition-all flex items-center gap-2">
              Online Order
            </button>
          </div>

          {/* Quick Info Bar */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3">
              <Clock className="text-[#ef4444]" size={20} />
              <div>
                <p className="text-white text-xs font-bold uppercase">Opening Hours</p>
                <p className="text-gray-500 text-[11px]">11:00 AM - 11:00 PM</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Utensils className="text-[#ef4444]" size={20} />
              <div>
                <p className="text-white text-xs font-bold uppercase">Today's Special</p>
                <p className="text-gray-500 text-[11px]">{todaysSpecial}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Floating Rating Badge */}
      <div className="absolute bottom-10 right-10 hidden lg:block bg-white p-4 rounded-2xl shadow-2xl animate-bounce">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#ef4444]/10 rounded-full flex items-center justify-center text-[#ef4444]">
            <Users size={24} />
          </div>
          <div>
            <p className="text-black font-black text-sm">4.9/5 Rating</p>
            <p className="text-gray-500 text-[10px]">Based on 2,000+ Diners</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;