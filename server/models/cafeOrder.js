import mongoose from 'mongoose';

const cafeItemSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  price: { type: Number, required: true },
  qty:   { type: Number, required: true, min: 1 },
}, { _id: false });

const cafeOrderSchema = new mongoose.Schema({
  orderToken:    { type: String, required: true },   // e.g. "C-001"
  items:         [cafeItemSchema],
  subtotal:      { type: Number, required: true },
  totalAmount:   { type: Number, default: 0 },
  status:        { type: String, enum: ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'], default: 'Pending' },
  paymentMethod: { type: String, enum: ['Cash', 'UPI', 'Card'], default: 'Cash' },
  paymentStatus: { type: String, enum: ['Unpaid', 'Paid'], default: 'Unpaid' },
}, { timestamps: true });

export default mongoose.model('CafeOrder', cafeOrderSchema);
