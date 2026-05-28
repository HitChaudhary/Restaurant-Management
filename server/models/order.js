import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  name:  { type: String, required: true },
  price: { type: Number, required: true },
  qty:   { type: Number, required: true, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema({
  tableNumber:   { type: String, required: true },
  items:         [itemSchema],
  subtotal:      { type: Number, required: true },
  tax:           { type: Number, default: 0 },
  totalAmount:   { type: Number, default: 0 },
  status:        { type: String, enum: ['In-Progress', 'Completed'], default: 'In-Progress' },
  paymentMethod: { type: String, enum: ['Cash', 'UPI', 'Card'], default: 'Cash' },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
