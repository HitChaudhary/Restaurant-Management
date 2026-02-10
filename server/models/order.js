import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    tableNumber: { type: String, required: true },
    items: [{
        name: String, 
        price: Number, 
        qty: Number
    }],
    subtotal: { type: Number, required: true },
    
    // --- New Billing Fields Added Below ---
    tax: { type: Number, default: 0 },         // To store the 5% GST
    totalAmount: { type: Number, default: 0 }, // To store (Subtotal + Tax - Discount)
    paymentMethod: { 
        type: String, 
        enum: ["Cash", "UPI", "Card", "None"], 
        default: "None" 
    },
    // ---------------------------------------

    status: { type: String, default: "In-Progress" }, // Fixed case sensitivity
    orderTime: { type: Date, default: Date.now }
}, { timestamps: true }); // Automatically tracks when order was created

const Order = mongoose.model("Order", orderSchema);

export default Order;