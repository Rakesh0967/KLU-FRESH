export const categories = [
  "Fruits & Vegetables", "Dairy", "Snacks", "Beverages",
  "Staples", "Personal Care", "Household", "Protein"
];

export const defaultProducts = [
  { id: 1, name: "Fresh Tomatoes", category: categories[0], qty: "1 kg", price: 45, original: 60, rating: 4.5, emoji: "🍅", stock: 20 },
  { id: 2, name: "Potatoes", category: categories[0], qty: "1 kg", price: 30, original: 35, rating: 4.2, emoji: "🥔", stock: 3 },
  { id: 3, name: "Bananas", category: categories[0], qty: "1 dozen", price: 50, original: 60, rating: 4.6, emoji: "🍌", stock: 15 },
  { id: 4, name: "Apples", category: categories[0], qty: "1 kg", price: 160, original: 200, rating: 4.7, emoji: "🍎", stock: 10 },
  { id: 5, name: "Broccoli", category: categories[0], qty: "500 g", price: 55, original: 70, rating: 4.1, emoji: "🥦", stock: 0 },
  { id: 6, name: "Toned Milk", category: categories[1], qty: "1 L", price: 58, original: 62, rating: 4.6, emoji: "🥛", stock: 25 },
  { id: 7, name: "Farm Eggs", category: categories[1], qty: "6 pcs", price: 48, original: 55, rating: 4.5, emoji: "🥚", stock: 12 },
  { id: 8, name: "Paneer", category: categories[1], qty: "200 g", price: 85, original: 100, rating: 4.4, emoji: "🧀", stock: 2 },
  { id: 9, name: "Brown Bread", category: categories[4], qty: "400 g", price: 42, original: 50, rating: 4.3, emoji: "🍞", stock: 18 },
  { id: 10, name: "Basmati Rice", category: categories[4], qty: "5 kg", price: 425, original: 500, rating: 4.7, emoji: "🍚", stock: 8 },
  { id: 11, name: "Cooking Oil", category: categories[4], qty: "1 L", price: 145, original: 165, rating: 4.3, emoji: "🫙", stock: 14 },
  { id: 12, name: "Digestive Biscuits", category: categories[2], qty: "250 g", price: 35, original: 40, rating: 4.4, emoji: "🍪", stock: 30 },
  { id: 13, name: "Potato Chips", category: categories[2], qty: "150 g", price: 30, original: 35, rating: 4.2, emoji: "🍟", stock: 22 },
  { id: 14, name: "Orange Juice", category: categories[3], qty: "1 L", price: 110, original: 130, rating: 4.5, emoji: "🧃", stock: 9 },
  { id: 15, name: "Herbal Shampoo", category: categories[5], qty: "340 ml", price: 210, original: 250, rating: 4.6, emoji: "🧴", stock: 6 },
  { id: 16, name: "Laundry Detergent", category: categories[6], qty: "1 kg", price: 135, original: 160, rating: 4.3, emoji: "🧺", stock: 11 },
  { id: 17, name: "Chicken Breast", category: categories[7], qty: "500 g", price: 250, original: 300, rating: 4.5, emoji: "🍗", stock: 7 },
  { id: 18, name: "Protein Powder", category: categories[7], qty: "1 kg", price: 1035, original: 1200, rating: 4.3, emoji: "🥣", stock: 11 },
  { id: 19, name: "Whey Protein", category: categories[7], qty: "1 kg", price: 1135, original: 1400, rating: 4.8, emoji: "💪", stock: 11 }
];

export const readStore = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const writeStore = (key, value) => localStorage.setItem(key, JSON.stringify(value));
export const money = value => `₹${Number(value || 0).toLocaleString("en-IN")}`;
