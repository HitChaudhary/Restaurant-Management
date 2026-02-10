import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, ArrowUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1e1e1e] text-white pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand & Bio */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black tracking-tighter">
              NILKANTH <span className="text-[#ef4444]">KITCHEN.</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Experience the art of fine dining where every plate tells a story of passion, 
              tradition, and extraordinary flavors.
            </p>
            <div className="flex gap-4">
              {[Facebook, Instagram, Twitter].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#ef4444] hover:border-[#ef4444] transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><a href="#" className="hover:text-[#ef4444] transition-colors">Our Menu</a></li>
              <li><a href="#" className="hover:text-[#ef4444] transition-colors">Book a Table</a></li>
              <li><a href="#" className="hover:text-[#ef4444] transition-colors">Online Order</a></li>
              <li><a href="#" className="hover:text-[#ef4444] transition-colors">Admin Dashboard</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-[#ef4444] shrink-0" />
                <span>123 Gourmet Avenue, <br />Foodie City, FC 56789</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#ef4444] shrink-0" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-[#ef4444] shrink-0" />
                <span>hello@nilkanthkitchen.com</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-lg font-bold mb-6">Newsletter</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to get special offers and menu updates.</p>
            <div className="relative">
              <input 
                type="email" 
                placeholder="Your Email" 
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-full px-6 py-3 text-sm focus:outline-none focus:border-[#ef4444]"
              />
              <button className="absolute right-1 top-1 bg-[#ef4444] p-2 rounded-full hover:bg-red-600 transition-colors">
                <ArrowUp size={18} />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-xs font-medium uppercase tracking-widest">
          <p>© 2026 Nilkanth Kitchen. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;