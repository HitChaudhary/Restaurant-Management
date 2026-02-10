import Order from '../models/order.js';

// 1. Create a new order or update existing one
export const saveOrder = async (req, res) => {
    try {
        const { tableNumber, items, subtotal } = req.body;

        // Check if there is already an "In-Progress" order for this table
        let order = await Order.findOne({ tableNumber, status: "In-Progress" });

        if (order) {
            // Update existing order
            order.items = items;
            order.subtotal = subtotal;
            await order.save();
            
            return res.status(200).json({ 
                success: true, 
                message: "Order updated successfully", 
                order 
            });
        } else {
            // Create new order
            const newOrder = new Order({
                tableNumber,
                items,
                subtotal,
                status: "In-Progress"
            });
            await newOrder.save();
            
            return res.status(201).json({ 
                success: true, 
                message: "Order created successfully", 
                order: newOrder 
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Error saving order", 
            error: error.message 
        });
    }
};

// 2. Get all active orders (CRITICAL: Matches your frontend activeTables check)
export const getActiveOrders = async (req, res) => {
    try {
        // Only fetch orders that haven't been paid yet
        const activeOrders = await Order.find({ status: "In-Progress" });
        
        // Response format matches: if (data.success) setActiveTables(data.activeTables)
        res.status(200).json({ 
            success: true, 
            activeTables: activeOrders,
            message: "Active orders fetched successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Error fetching active orders", 
            error: error.message 
        });
    }
};

// 3. Finalize Bill & Print
export const finalizeOrder = async (req, res) => {
    try {
        const { tableNumber, tax, totalAmount, paymentMethod } = req.body;

        const updatedOrder = await Order.findOneAndUpdate(
            { tableNumber, status: "In-Progress" },
            { 
                tax, 
                totalAmount, 
                paymentMethod, 
                status: "Completed" 
            },
            { new: true }
        );

        if (!updatedOrder) {
            return res.status(404).json({ 
                success: false, 
                message: "Active order not found for this table" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Order finalized successfully", 
            order: updatedOrder 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            success: false, 
            message: "Error finalizing order", 
            error: error.message 
        });
    }
};