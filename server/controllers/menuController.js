import Dish from '../models/dish.js';

// GET /api/menu?section=restaurant  or  ?section=cafe  or  all
export const getAllDishes = async (req, res) => {
  try {
    const filter = {};
    if (req.query.section) filter.section = req.query.section;
    const dishes = await Dish.find(filter).sort({ category: 1, name: 1 });
    res.json({ success: true, dishes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/menu/add
export const addDish = async (req, res) => {
  try {
    const { name, price, category, type, spicyLevel, description, section } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ success: false, message: 'name, price and category are required' });
    }
    const dish = await Dish.create({ name, price, category, type, spicyLevel, description, section: section || 'restaurant' });
    res.status(201).json({ success: true, message: 'Dish added', dish });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/menu/:id
export const removeDish = async (req, res) => {
  try {
    await Dish.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Dish removed' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PATCH /api/menu/:id/toggle  — toggle availability
export const toggleAvailability = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    if (!dish) return res.status(404).json({ success: false, message: 'Dish not found' });
    dish.isAvailable = !dish.isAvailable;
    await dish.save();
    res.json({ success: true, dish });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
