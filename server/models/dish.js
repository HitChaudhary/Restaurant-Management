import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  price:       { type: Number, required: true, min: 0 },
  category:    { type: String, required: true, index: true },
  type:        { type: String, enum: ['Veg', 'Non-Veg'], default: 'Veg' },
  spicyLevel:  { type: Number, min: 0, max: 5, default: 1 },
  description: { type: String, default: '' },
  isAvailable: { type: Boolean, default: true },
  // Distinguish restaurant vs cafe menu items
  section:     { type: String, enum: ['restaurant', 'cafe'], default: 'restaurant' },
}, { timestamps: true });

export default mongoose.model('Dish', dishSchema);
