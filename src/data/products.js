/**
 * Product catalog — single source of truth for all products in the app.
 *
 * Each product has:
 *   id          — unique identifier used for React keys and Gemini matching
 *   name        — full display name shown in the UI
 *   brand       — manufacturer (helps Gemini match brand-specific queries)
 *   category    — broad category for grouping / filtering
 *   price       — price in INR (₹)
 *   description — short spec summary that Gemini reads to understand the product
 */

const products = [
    // ── Phones ────────────────────────────────────────────────────────────────
    {
      id: 1,
      name: "Samsung Galaxy S24",
      brand: "Samsung",
      category: "Phone",
      price: 74999,
      description:
        "6.2-inch Dynamic AMOLED display, Snapdragon 8 Gen 3, 50 MP triple camera, 4000 mAh battery, 8 GB RAM.",
    },
    {
      id: 2,
      name: "Redmi Note 13 Pro",
      brand: "Xiaomi",
      category: "Phone",
      price: 26999,
      description:
        "6.67-inch AMOLED, 200 MP main camera, Snapdragon 7s Gen 2, 5100 mAh battery, 67 W fast charging.",
    },
    {
      id: 3,
      name: "iPhone 15",
      brand: "Apple",
      category: "Phone",
      price: 79999,
      description:
        "6.1-inch Super Retina XDR, A16 Bionic chip, 48 MP main camera, USB-C, all-day battery life.",
    },
    {
      id: 4,
      name: "OnePlus Nord CE 4",
      brand: "OnePlus",
      category: "Phone",
      price: 24999,
      description:
        "6.7-inch AMOLED 120 Hz, Snapdragon 7s Gen 2, 50 MP camera, 5500 mAh battery, 100 W SuperVOOC charging.",
    },
    {
      id: 5,
      name: "Vivo V30e",
      brand: "Vivo",
      category: "Phone",
      price: 22999,
      description:
        "6.78-inch AMOLED, Snapdragon 695, 50 MP Sony IMX camera, 5000 mAh battery, 44 W fast charging.",
    },
  
    // ── Laptops ───────────────────────────────────────────────────────────────
    {
      id: 6,
      name: "ASUS ROG Strix G15",
      brand: "ASUS",
      category: "Laptop",
      price: 89999,
      description:
        "15.6-inch 144 Hz FHD, AMD Ryzen 9, NVIDIA RTX 4060 8 GB, 16 GB DDR5 RAM, 512 GB NVMe SSD, gaming laptop.",
    },
    {
      id: 7,
      name: "Lenovo IdeaPad Slim 5",
      brand: "Lenovo",
      category: "Laptop",
      price: 52999,
      description:
        "15.6-inch FHD IPS, AMD Ryzen 5 7530U, Radeon integrated graphics, 16 GB RAM, 512 GB SSD, lightweight everyday laptop.",
    },
    {
      id: 8,
      name: "HP Pavilion 15",
      brand: "HP",
      category: "Laptop",
      price: 47999,
      description:
        "15.6-inch FHD, Intel Core i5-12th Gen, Intel Iris Xe graphics, 8 GB RAM, 512 GB SSD, thin and light.",
    },
    {
      id: 9,
      name: "MacBook Air M2",
      brand: "Apple",
      category: "Laptop",
      price: 114999,
      description:
        "13.6-inch Liquid Retina, Apple M2 chip, 8 GB unified memory, 256 GB SSD, fanless design, 18-hour battery.",
    },
    {
      id: 10,
      name: "Acer Nitro 5",
      brand: "Acer",
      category: "Laptop",
      price: 67999,
      description:
        "15.6-inch 144 Hz IPS, Intel Core i7-12th Gen, NVIDIA RTX 3050 Ti, 16 GB RAM, 512 GB SSD, budget gaming laptop.",
    },
  
    // ── Headphones ────────────────────────────────────────────────────────────
    {
      id: 11,
      name: "Sony WH-1000XM5",
      brand: "Sony",
      category: "Headphones",
      price: 29999,
      description:
        "Over-ear wireless, industry-leading ANC, 30-hour battery, multipoint Bluetooth, Hi-Res Audio.",
    },
    {
      id: 12,
      name: "boAt Rockerz 550",
      brand: "boAt",
      category: "Headphones",
      price: 1499,
      description:
        "Over-ear wireless Bluetooth 5.0, 20-hour playback, foldable design, 40 mm drivers, budget-friendly.",
    },
    {
      id: 13,
      name: "JBL Tune 770NC",
      brand: "JBL",
      category: "Headphones",
      price: 6999,
      description:
        "Over-ear wireless, Adaptive ANC, 44-hour battery, multipoint connection, Pure Bass sound.",
    },
    {
      id: 14,
      name: "Jabra Evolve2 30",
      brand: "Jabra",
      category: "Headphones",
      price: 8499,
      description:
        "On-ear wired USB headset, dual-mic noise cancellation, optimised for MS Teams and UC platforms.",
    },
  
    // ── Smartwatches ──────────────────────────────────────────────────────────
    {
      id: 15,
      name: "Apple Watch Series 9",
      brand: "Apple",
      category: "Smartwatch",
      price: 41900,
      description:
        "45 mm Retina LTPO OLED, S9 chip, ECG, blood oxygen, crash detection, 18-hour battery, watchOS 10.",
    },
    {
      id: 16,
      name: "Samsung Galaxy Watch 6",
      brand: "Samsung",
      category: "Smartwatch",
      price: 26999,
      description:
        "44 mm AMOLED, advanced sleep coaching, BioActive sensor, body composition, 40-hour battery.",
    },
    {
      id: 17,
      name: "Amazfit GTR 4",
      brand: "Amazfit",
      category: "Smartwatch",
      price: 12999,
      description:
        "46 mm AMOLED, GPS, Alexa built-in, 150+ sports modes, 14-day battery life, blood oxygen monitoring.",
    },
    {
      id: 18,
      name: "Noise ColorFit Pro 5",
      brand: "Noise",
      category: "Smartwatch",
      price: 3499,
      description:
        "1.85-inch AMOLED, Bluetooth calling, 7-day battery, 100+ sports modes, SpO2 and heart rate monitor, budget.",
    },
  
    // ── Tablets ───────────────────────────────────────────────────────────────
    {
      id: 19,
      name: "iPad Air (M1)",
      brand: "Apple",
      category: "Tablet",
      price: 59900,
      description:
        "10.9-inch Liquid Retina, Apple M1 chip, 64 GB storage, USB-C, Touch ID, all-day battery.",
    },
    {
      id: 20,
      name: "Samsung Galaxy Tab S9 FE",
      brand: "Samsung",
      category: "Tablet",
      price: 37999,
      description:
        "10.9-inch TFT LCD, Exynos 1380, 8 GB RAM, 128 GB storage, S Pen included, IP68 water resistance.",
    },
  ];
  
  export default products;