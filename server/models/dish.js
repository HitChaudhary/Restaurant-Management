import mongoose from "mongoose";

const dishSchema = new mongoose.Schema({
    // name of the dish (e.g., Paneer Butter Masala)
    name: { 
        type: String, 
        required: [true, "Dish name is required"],
        trim: true 
    },
    // price in INR
    price: { 
        type: Number, 
        required: [true, "Price is required"],
        min: 0 
    },
    // category (e.g., Punjabi, Rice, Breads)
    category: { 
        type: String, 
        required: true,
        index: true // Makes searching by category faster
    },
    // Veg or Non-Veg
    type: { 
        type: String, 
        required: true,
        enum: ['Veg', 'Non-Veg'] // Restricts input to these two values
    },
    // spicy level (0 to 4)
    spicyLevel: { 
        type: Number, 
        default: 0,
        min: 0,
        max: 4 
    },
    // Add this to check if dish is currently available in kitchen
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true // Automatically adds createdAt and updatedAt
});

const Dish = mongoose.model('Dish', dishSchema);

export default Dish;