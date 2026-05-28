/**
 * SEED FILE — run once to populate DB
 * Usage:  npm run seed
 *
 * Seeds:
 *  - Restaurant menu dishes
 *  - Cafe menu dishes
 *  - 5 sample completed restaurant orders
 *  - 3 sample completed cafe orders
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Dish from './models/dish.js';
import Order from './models/order.js';
import CafeOrder from './models/cafeOrder.js';

dotenv.config();

const RESTAURANT_DISHES = [
  // Breakfast
  { name: 'Aloo Paratha',   price: 80,  category: 'Breakfast', type: 'Veg', spicyLevel: 1, section: 'restaurant' },
  { name: 'Gobi Paratha',   price: 70,  category: 'Breakfast', type: 'Veg', spicyLevel: 1, section: 'restaurant' },
  { name: 'Paneer Paratha', price: 100, category: 'Breakfast', type: 'Veg', spicyLevel: 1, section: 'restaurant' },
  { name: 'Veg. Paratha',   price: 70,  category: 'Breakfast', type: 'Veg', spicyLevel: 1, section: 'restaurant' },
  { name: 'Sev Usal',       price: 50,  category: 'Breakfast', type: 'Veg', spicyLevel: 3, section: 'restaurant' },
  { name: 'Bataka Pauva',   price: 40,  category: 'Breakfast', type: 'Veg', spicyLevel: 1, section: 'restaurant' },
  // Punjabi
  { name: 'Paneer Mutter',        price: 145, category: 'Punjabi', type: 'Veg', spicyLevel: 2, section: 'restaurant' },
  { name: 'Paneer Palak',         price: 140, category: 'Punjabi', type: 'Veg', spicyLevel: 1, section: 'restaurant' },
  { name: 'Paneer Handi Masala',  price: 150, category: 'Punjabi', type: 'Veg', spicyLevel: 2, section: 'restaurant' },
  { name: 'Paneer Tawa Masala',   price: 160, category: 'Punjabi', type: 'Veg', spicyLevel: 3, section: 'restaurant' },
  { name: 'Paneer Tikka Masala',  price: 165, category: 'Punjabi', type: 'Veg', spicyLevel: 3, section: 'restaurant' },
  { name: 'Paneer Butter Masala', price: 180, category: 'Punjabi', type: 'Veg', spicyLevel: 2, section: 'restaurant' },
  { name: 'Paneer Bhurji',        price: 190, category: 'Punjabi', type: 'Veg', spicyLevel: 3, section: 'restaurant' },
  { name: 'Paneer Kadai',         price: 150, category: 'Punjabi', type: 'Veg', spicyLevel: 3, section: 'restaurant' },
  { name: 'Paneer Shahi Korma',   price: 200, category: 'Punjabi', type: 'Veg', spicyLevel: 1, section: 'restaurant' },
  { name: 'Paneer Angara',        price: 190, category: 'Punjabi', type: 'Veg', spicyLevel: 4, section: 'restaurant' },
  // Veg Main
  { name: 'Veg. Kadai',    price: 140, category: 'Veg Main', type: 'Veg', spicyLevel: 2, section: 'restaurant' },
  { name: 'Veg. Jalfrezi', price: 150, category: 'Veg Main', type: 'Veg', spicyLevel: 3, section: 'restaurant' },
  { name: 'Bengan Bharta', price: 120, category: 'Veg Main', type: 'Veg', spicyLevel: 2, section: 'restaurant' },
  { name: 'Bhindi Masala', price: 130, category: 'Veg Main', type: 'Veg', spicyLevel: 2, section: 'restaurant' },
  { name: 'Aloo Mutter',   price: 110, category: 'Veg Main', type: 'Veg', spicyLevel: 1, section: 'restaurant' },
  // Dal
  { name: 'Dal Fry',        price: 90,  category: 'Dal', type: 'Veg', spicyLevel: 1, section: 'restaurant' },
  { name: 'Butter Dal Fry', price: 120, category: 'Dal', type: 'Veg', spicyLevel: 1, section: 'restaurant' },
  { name: 'Dal Tadka',      price: 120, category: 'Dal', type: 'Veg', spicyLevel: 2, section: 'restaurant' },
  // Kofta
  { name: 'Malai Kofta',        price: 170, category: 'Kofta', type: 'Veg', spicyLevel: 1, section: 'restaurant' },
  { name: 'Kaju Kofta',         price: 180, category: 'Kofta', type: 'Veg', spicyLevel: 2, section: 'restaurant' },
  { name: 'Paneer Kofta',       price: 180, category: 'Kofta', type: 'Veg', spicyLevel: 2, section: 'restaurant' },
  { name: 'Kashmir Korma',      price: 200, category: 'Kofta', type: 'Veg', spicyLevel: 0, section: 'restaurant' },
  // Rice
  { name: 'Veg. Biriyani',      price: 120, category: 'Rice', type: 'Veg', spicyLevel: 2, section: 'restaurant' },
  { name: 'Hyderabadi Biriyani',price: 130, category: 'Rice', type: 'Veg', spicyLevel: 3, section: 'restaurant' },
  { name: 'Veg. Pulav',         price: 110, category: 'Rice', type: 'Veg', spicyLevel: 1, section: 'restaurant' },
  { name: 'Jeera Rice',         price: 80,  category: 'Rice', type: 'Veg', spicyLevel: 0, section: 'restaurant' },
  { name: 'Plain Rice',         price: 60,  category: 'Rice', type: 'Veg', spicyLevel: 0, section: 'restaurant' },
  // Breads
  { name: 'Tawa Chapati',         price: 12, category: 'Breads', type: 'Veg', spicyLevel: 0, section: 'restaurant' },
  { name: 'Butter Chapati (Ghee)',price: 15, category: 'Breads', type: 'Veg', spicyLevel: 0, section: 'restaurant' },
  { name: 'Plain Paratha',        price: 25, category: 'Breads', type: 'Veg', spicyLevel: 0, section: 'restaurant' },
  { name: 'Butter Paratha',       price: 28, category: 'Breads', type: 'Veg', spicyLevel: 0, section: 'restaurant' },
  // Sides
  { name: 'Green Salad',    price: 50, category: 'Sides', type: 'Veg', spicyLevel: 0, section: 'restaurant' },
  { name: 'Kachumber Salad',price: 30, category: 'Sides', type: 'Veg', spicyLevel: 1, section: 'restaurant' },
  { name: 'Boondi Raita',   price: 90, category: 'Sides', type: 'Veg', spicyLevel: 1, section: 'restaurant' },
  { name: 'Masala Papad',   price: 35, category: 'Sides', type: 'Veg', spicyLevel: 2, section: 'restaurant' },
  { name: 'Fry Papad',      price: 30, category: 'Sides', type: 'Veg', spicyLevel: 0, section: 'restaurant' },
  // Drinks
  { name: 'Sp. Tea',            price: 25, category: 'Drinks', type: 'Veg', spicyLevel: 0, section: 'restaurant' },
  { name: 'Coffee',             price: 25, category: 'Drinks', type: 'Veg', spicyLevel: 0, section: 'restaurant' },
  { name: 'Milk Glass (250 Ml)',price: 25, category: 'Drinks', type: 'Veg', spicyLevel: 0, section: 'restaurant' },
  // Thali
  { name: 'Sp. Gujarati Thali', price: 120, category: 'Thali', type: 'Veg', spicyLevel: 1,
    description: '2 Sabji, Dal, Rice, Chapati, Papad', section: 'restaurant' },
];

const CAFE_DISHES = [
  { name: 'Espresso',        price: 120, category: 'Coffee',    section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Latte',           price: 150, category: 'Coffee',    section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Cappuccino',      price: 160, category: 'Coffee',    section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Americano',       price: 130, category: 'Coffee',    section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Mocha',           price: 170, category: 'Coffee',    section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Flat White',      price: 165, category: 'Coffee',    section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Cold Brew',       price: 180, category: 'Coffee',    section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Masala Chai',     price: 90,  category: 'Tea',       section: 'cafe', type: 'Veg', spicyLevel: 1 },
  { name: 'Earl Grey',       price: 110, category: 'Tea',       section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Green Tea',       price: 100, category: 'Tea',       section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Iced Peach Tea',  price: 150, category: 'Tea',       section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Matcha Latte',    price: 210, category: 'Tea',       section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Hot Chocolate',   price: 190, category: 'Beverages', section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Lemonade',        price: 120, category: 'Beverages', section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Classic Croissant',price:180, category: 'Bakery',    section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Pain au Chocolat',price: 200, category: 'Bakery',    section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Bagel Cream Cheese',price:190,category: 'Bakery',    section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Club Sandwich',   price: 250, category: 'Food',      section: 'cafe', type: 'Veg', spicyLevel: 1 },
  { name: 'Paneer Wrap',     price: 220, category: 'Food',      section: 'cafe', type: 'Veg', spicyLevel: 2 },
  { name: 'Garlic Bread',    price: 150, category: 'Food',      section: 'cafe', type: 'Veg', spicyLevel: 1 },
  { name: 'Avocado Toast',   price: 320, category: 'Breakfast', section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Pancakes',        price: 280, category: 'Breakfast', section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Blueberry Muffin',price: 140, category: 'Desserts',  section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Chocolate Brownie',price:160, category: 'Desserts',  section: 'cafe', type: 'Veg', spicyLevel: 0 },
  { name: 'Cheesecake Slice',price: 220, category: 'Desserts',  section: 'cafe', type: 'Veg', spicyLevel: 0 },
];

// Sample orders for demo data
const SAMPLE_REST_ORDERS = [
  { tableNumber: '1', items: [{ name: 'Paneer Butter Masala', price: 180, qty: 2 }, { name: 'Tawa Chapati', price: 12, qty: 4 }], subtotal: 408, tax: 20.4, totalAmount: 428, paymentMethod: 'Cash', status: 'Completed' },
  { tableNumber: '3', items: [{ name: 'Dal Fry', price: 90, qty: 1 }, { name: 'Jeera Rice', price: 80, qty: 2 }, { name: 'Fry Papad', price: 30, qty: 2 }], subtotal: 310, tax: 15.5, totalAmount: 326, paymentMethod: 'UPI', status: 'Completed' },
  { tableNumber: '5', items: [{ name: 'Sp. Gujarati Thali', price: 120, qty: 3 }], subtotal: 360, tax: 18, totalAmount: 378, paymentMethod: 'UPI', status: 'Completed' },
  { tableNumber: '2', items: [{ name: 'Malai Kofta', price: 170, qty: 1 }, { name: 'Butter Paratha', price: 28, qty: 3 }, { name: 'Boondi Raita', price: 90, qty: 1 }], subtotal: 344, tax: 17.2, totalAmount: 361, paymentMethod: 'Card', status: 'Completed' },
  { tableNumber: '7', items: [{ name: 'Veg. Biriyani', price: 120, qty: 2 }, { name: 'Green Salad', price: 50, qty: 1 }], subtotal: 290, tax: 14.5, totalAmount: 305, paymentMethod: 'Cash', status: 'Completed' },
];

const SAMPLE_CAFE_ORDERS = [
  { orderToken: 'C-001', items: [{ name: 'Cappuccino', price: 160, qty: 2 }, { name: 'Classic Croissant', price: 180, qty: 2 }], subtotal: 680, totalAmount: 714, paymentMethod: 'UPI', paymentStatus: 'Paid', status: 'Completed' },
  { orderToken: 'C-002', items: [{ name: 'Matcha Latte', price: 210, qty: 1 }, { name: 'Blueberry Muffin', price: 140, qty: 2 }], subtotal: 490, totalAmount: 515, paymentMethod: 'Card', paymentStatus: 'Paid', status: 'Completed' },
  { orderToken: 'C-003', items: [{ name: 'Masala Chai', price: 90, qty: 3 }, { name: 'Garlic Bread', price: 150, qty: 1 }], subtotal: 420, totalAmount: 441, paymentMethod: 'Cash', paymentStatus: 'Paid', status: 'Completed' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing
    await Dish.deleteMany({});
    await Order.deleteMany({});
    await CafeOrder.deleteMany({});
    console.log('🗑  Cleared existing data');

    // Insert
    await Dish.insertMany([...RESTAURANT_DISHES, ...CAFE_DISHES]);
    console.log(`🍽  Seeded ${RESTAURANT_DISHES.length} restaurant dishes + ${CAFE_DISHES.length} cafe dishes`);

    await Order.insertMany(SAMPLE_REST_ORDERS);
    console.log(`📋  Seeded ${SAMPLE_REST_ORDERS.length} sample restaurant orders`);

    await CafeOrder.insertMany(SAMPLE_CAFE_ORDERS);
    console.log(`☕  Seeded ${SAMPLE_CAFE_ORDERS.length} sample cafe orders`);

    console.log('\n✅ Seed complete! You can now run the server.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
}

seed();
