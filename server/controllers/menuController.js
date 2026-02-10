import Dish from "../models/dish.js";

export const addDish = async (req, res) => {
    try {
        console.log("Data received from frontend:", req.body); // Helpful for debugging

        const { name, price, category, type, spicyLevel, isAvailable } = req.body;

        // 2. Validate Inputs (Fixed Typo)
        if (!name || !price || !category || !type || !spicyLevel) {
            return res.json({ 
                success: false, 
                message: "Missing required field (Name, Price, Category, etc.)" 
            });
        }

        // 3. Create the Dish
        const newDish = await Dish.create({
            name,
            price,
            category,
            type,
            spicyLevel,
            isAvailable: isAvailable ?? true 
        });
        
        // 4. Send Success Message
        res.json({ success: true, message: "Item added successfully!" });

    } catch (error) {
        console.error("Error inside addDish:", error);
        res.json({ success: false, message: error.message });
    }
};



export const allDish = async (req, res) => {
    try {
        // Find all dishes and sort them so "Punjabi" items stay together, "Rice" together, etc.
        const dishes = await Dish.find({});

        res.json({ 
            success: true, 
            count: dishes.length, 
            data: dishes 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: "Failed to fetch menu: " + error.message 
        });
    }
}
export const removeDish = async (req, res) => {
    try {
        const { id } = req.params; // Expecting the ID in the URL

        const deletedDish = await Dish.findByIdAndDelete(id);

        if (!deletedDish) {
            return res.json({ success: false, message: "Item not found!" });
        }

        res.json({ 
            success: true, 
            message: "Item removed from menu successfully!" 
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};