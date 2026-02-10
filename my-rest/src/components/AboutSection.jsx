import React from 'react';
import { CheckCircle } from 'lucide-react';
import aboutimg from '../assets/aboutimg.jpg'

const About = () => {
  const features = [
    "Premium quality ingredients sourced daily",
    "Expert chefs with 15+ years of experience",
    "Clean and hygienic kitchen environment",
    "Signature spices and secret family recipes"
  ];

  return (
    <section className="bg-[#121212] pb-24 px-8 pt-44">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        
        {/* Left Side: Image with a decorative border */}
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-full h-full border-2 border-[#ef4444] rounded-2xl z-0"></div>
          <img 
            src={aboutimg} 
            alt="Our Kitchen Excellence" 
            className="relative z-10 rounded-2xl shadow-2xl w-full h-[500px] object-cover hover:grayscale-[20%]"
          />
          {/* Experience Badge */}
          <div className="absolute -bottom-6 -right-6 bg-[#ef4444] p-6 rounded-xl z-20 hidden md:block">
            <p className="text-4xl font-black text-white text-center">25+</p>
            <p className="text-white text-xs uppercase font-bold">Years of Legacy</p>
          </div>
        </div>

        {/* Right Side: Content */}
        <div>
          <h2 className="text-[#ef4444] font-bold uppercase tracking-widest text-sm mb-4">Our Story</h2>
          <h3 className="text-5xl font-black text-white mb-6 leading-tight">
            Crafting Culinary <br /> Masterpieces Since 1998
          </h3>
          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            At <span className="text-white font-bold">Nilkanth Kitchen</span>, we believe that cooking is an art form. 
            What started as a small family passion project has grown into the city's 
            premier destination for food lovers who crave authenticity and innovation.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-10">
            {features.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle size={20} className="text-[#ef4444]" />
                <span className="text-gray-300 text-sm font-medium">{item}</span>
              </div>
            ))}
          </div>

          <button className="bg-transparent border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444] hover:text-white px-8 py-4 rounded-full font-bold transition-all">
            Learn More About Us
          </button>
        </div>

      </div>
    </section>
  );
};

export default About;