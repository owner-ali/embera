import { PrismaClient, Role, GalleryCategory, OrderType, PaymentMethod, PaymentStatus, OrderStatus, ReservationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Real, freely-licensed food/restaurant photography (Unsplash).
// Swap any of these from /admin/menu or /admin/gallery once you have your own shots.
const img = {
  pizza: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&q=80",
  burger: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&q=80",
  pasta: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&q=80",
  steak: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=1200&q=80",
  dessert: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&q=80",
  cocktail: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=1200&q=80",
  starter: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=1200&q=80",
  interior: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1600&q=80",
  chef: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1600&q=80",
  kitchen: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1600&q=80",
  table: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1600&q=80",
  wine: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=1200&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1200&q=80",
};

async function main() {
  console.log("Seeding EMBERA database...");

  // ---------- Admin users ----------
  const superAdminPassword = await bcrypt.hash("Embera@Admin123", 10);
  await prisma.user.upsert({
    where: { email: "admin@embera.com" },
    update: {},
    create: {
      name: "Ali Hassan",
      email: "admin@embera.com",
      passwordHash: superAdminPassword,
      role: Role.SUPER_ADMIN,
    },
  });

  const managerPassword = await bcrypt.hash("Embera@Manager123", 10);
  await prisma.user.upsert({
    where: { email: "manager@embera.com" },
    update: {},
    create: {
      name: "Sara Khan",
      email: "manager@embera.com",
      passwordHash: managerPassword,
      role: Role.MANAGER,
      permissions: {
        create: [
          { key: "DASHBOARD" }, { key: "ORDERS" }, { key: "MENU" },
          { key: "RESERVATIONS" }, { key: "CUSTOMERS" }, { key: "REVIEWS" },
          { key: "GALLERY" }, { key: "MESSAGES" }, { key: "ANALYTICS" },
        ],
      },
    },
  });

  // ---------- Categories ----------
  const categoryData = [
    { name: "Starters", slug: "starters", description: "Small plates to begin the experience.", imageUrl: img.starter, sortOrder: 1 },
    { name: "Pizza", slug: "pizza", description: "Wood-fired, blistered, and built to share.", imageUrl: img.pizza, sortOrder: 2 },
    { name: "Burgers", slug: "burgers", description: "Char-grilled and stacked with intent.", imageUrl: img.burger, sortOrder: 3 },
    { name: "Pasta", slug: "pasta", description: "Hand-rolled, slow-sauced, always fresh.", imageUrl: img.pasta, sortOrder: 4 },
    { name: "Steak", slug: "steak", description: "Fire-seared cuts finished tableside.", imageUrl: img.steak, sortOrder: 5 },
    { name: "Desserts", slug: "desserts", description: "A sweet, deliberate finish.", imageUrl: img.dessert, sortOrder: 6 },
    { name: "Drinks", slug: "drinks", description: "Crafted cocktails and fine pours.", imageUrl: img.cocktail, sortOrder: 7 },
  ];

  const categories: Record<string, string> = {};
  for (const c of categoryData) {
    const created = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
    categories[c.slug] = created.id;
  }

  // ---------- Dishes ----------
  const dishes = [
    {
      name: "Fire Pizza",
      slug: "fire-pizza",
      description: "Charred wood-fired crust, San Marzano tomato, fior di latte, calabrian chili oil, and torn basil.",
      price: 18.5, imageUrl: img.pizza, categorySlug: "pizza",
      isSpicy: true, isFeatured: true, calories: 780, rating: 4.8, ratingCount: 214,
      allergens: ["Gluten", "Dairy"], ingredients: ["San Marzano tomato", "Fior di latte", "Calabrian chili", "Basil", "Wood-fired dough"],
    },
    {
      name: "Embera Burger",
      slug: "embera-burger",
      description: "Double smash patty, aged cheddar, caramelized onion, ember sauce, brioche bun, hand-cut fries.",
      price: 16.0, imageUrl: img.burger, categorySlug: "burgers",
      isFeatured: true, calories: 920, rating: 4.9, ratingCount: 341,
      allergens: ["Gluten", "Dairy", "Egg"], ingredients: ["Beef patty", "Aged cheddar", "Caramelized onion", "Ember sauce", "Brioche bun"],
    },
    {
      name: "Truffle Pasta",
      slug: "truffle-pasta",
      description: "Hand-rolled tagliatelle, black truffle cream, parmesan reggiano, cracked pepper.",
      price: 22.0, imageUrl: img.pasta, categorySlug: "pasta",
      isVegetarian: true, isFeatured: true, calories: 640, rating: 4.7, ratingCount: 189,
      allergens: ["Gluten", "Dairy", "Egg"], ingredients: ["Tagliatelle", "Black truffle", "Cream", "Parmesan reggiano"],
    },
    {
      name: "Grilled Steak",
      slug: "grilled-steak",
      description: "10oz dry-aged ribeye, charred over open flame, herb butter, roasted bone marrow jus.",
      price: 38.0, imageUrl: img.steak, categorySlug: "steak",
      isFeatured: true, calories: 890, rating: 4.9, ratingCount: 267,
      allergens: ["Dairy"], ingredients: ["Dry-aged ribeye", "Herb butter", "Bone marrow jus"],
    },
    {
      name: "Red Velvet",
      slug: "red-velvet",
      description: "Layered red velvet cake, whipped cream cheese frosting, cocoa nib crunch.",
      price: 11.0, imageUrl: img.dessert, categorySlug: "desserts",
      isVegetarian: true, isFeatured: true, calories: 520, rating: 4.8, ratingCount: 156,
      allergens: ["Gluten", "Dairy", "Egg"], ingredients: ["Red velvet sponge", "Cream cheese frosting", "Cocoa nibs"],
    },
    {
      name: "Signature Mojito",
      slug: "signature-mojito",
      description: "White rum, torched lime, mint, demerara, soda — finished with a smoked orange peel.",
      price: 13.0, imageUrl: img.cocktail, categorySlug: "drinks",
      isVegetarian: true, isFeatured: true, calories: 210, rating: 4.7, ratingCount: 98,
      allergens: [], ingredients: ["White rum", "Lime", "Mint", "Demerara sugar", "Soda"],
    },
    {
      name: "Charred Octopus",
      slug: "charred-octopus",
      description: "Ember-grilled octopus, smoked paprika, crispy potato, salsa verde.",
      price: 19.0, imageUrl: img.starter, categorySlug: "starters",
      calories: 410, rating: 4.6, ratingCount: 88,
      allergens: ["Shellfish"], ingredients: ["Octopus", "Smoked paprika", "Potato", "Salsa verde"],
    },
    {
      name: "Burrata & Heirloom",
      slug: "burrata-heirloom",
      description: "Creamy burrata, heirloom tomato, basil oil, aged balsamic, sourdough crisp.",
      price: 15.0, imageUrl: img.salad, categorySlug: "starters",
      isVegetarian: true, calories: 380, rating: 4.7, ratingCount: 112,
      allergens: ["Dairy", "Gluten"], ingredients: ["Burrata", "Heirloom tomato", "Basil oil", "Balsamic"],
    },
    {
      name: "Diavola Pizza",
      slug: "diavola-pizza",
      description: "Spicy soppressata, tomato, mozzarella, chili honey drizzle.",
      price: 19.5, imageUrl: img.pizza, categorySlug: "pizza",
      isSpicy: true, calories: 820, rating: 4.6, ratingCount: 134,
      allergens: ["Gluten", "Dairy"], ingredients: ["Soppressata", "Tomato", "Mozzarella", "Chili honey"],
    },
    {
      name: "Smoked Old Fashioned",
      slug: "smoked-old-fashioned",
      description: "Bourbon, demerara, aromatic bitters, applewood smoke finish.",
      price: 15.0, imageUrl: img.wine, categorySlug: "drinks",
      calories: 190, rating: 4.8, ratingCount: 121,
      allergens: [], ingredients: ["Bourbon", "Demerara", "Bitters"],
    },
  ];

  for (const d of dishes) {
    const { categorySlug, ingredients, ...rest } = d;
    await prisma.dish.upsert({
      where: { slug: d.slug },
      update: {},
      create: {
        ...rest,
        categoryId: categories[categorySlug],
        ingredients: { create: ingredients.map((name) => ({ name })) },
      },
    });
  }

  // ---------- Tables ----------
  for (let i = 1; i <= 14; i++) {
    await prisma.restaurantTable.upsert({
      where: { label: `T${i}` },
      update: {},
      create: { label: `T${i}`, capacity: i % 4 === 0 ? 8 : i % 3 === 0 ? 6 : i % 2 === 0 ? 4 : 2 },
    });
  }

  // ---------- Gallery ----------
  const galleryData: { url: string; alt: string; category: GalleryCategory; isFeatured?: boolean }[] = [
    { url: img.interior, alt: "EMBERA dining room at dusk", category: GalleryCategory.INTERIOR, isFeatured: true },
    { url: img.chef, alt: "Head chef plating a signature dish", category: GalleryCategory.CHEF, isFeatured: true },
    { url: img.kitchen, alt: "Open kitchen fire station", category: GalleryCategory.KITCHEN },
    { url: img.table, alt: "Table set for private dining", category: GalleryCategory.INTERIOR },
    { url: img.pizza, alt: "Fire Pizza fresh from the oven", category: GalleryCategory.FOOD, isFeatured: true },
    { url: img.steak, alt: "Grilled Steak, tableside sear", category: GalleryCategory.FOOD },
    { url: img.cocktail, alt: "Signature Mojito being poured", category: GalleryCategory.FOOD },
    { url: img.dessert, alt: "Red Velvet dessert plating", category: GalleryCategory.FOOD },
    { url: img.table, alt: "Private chef's table event", category: GalleryCategory.EVENTS },
  ];
  for (const g of galleryData) {
    await prisma.galleryImage.create({ data: g });
  }

  // ---------- Site settings (CMS) ----------
  const settings: Record<string, string> = {
    restaurantName: "EMBERA",
    tagline: "Crafted for the Extraordinary.",
    heroHeading: "Taste the Extraordinary.",
    heroSubtitle: "Where fire, flavor and creativity meet.",
    aboutText:
      "EMBERA began with a single wood-fired oven and a belief that a plate could feel like a moment. Fifteen years later, that same fire still anchors every dish we send out.",
    phone: "+1 (212) 555-0148",
    email: "reservations@embera.com",
    address: "214 Ember Lane, New York, NY 10012",
    openingHours: "Mon–Thu 5pm–11pm · Fri–Sun 12pm–1am",
    instagram: "https://instagram.com/embera.restaurant",
    facebook: "https://facebook.com/embera.restaurant",
    seoTitle: "EMBERA — Crafted for the Extraordinary.",
    seoDescription: "A premium fire-driven dining experience in the heart of New York. Reserve your table or order online.",
  };
  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({ where: { key }, update: { value }, create: { key, value } });
  }

  // ---------- Demo customer + order + reservation + review ----------
  const customerPassword = await bcrypt.hash("Customer@123", 10);
  const customer = await prisma.customer.upsert({
    where: { email: "guest@example.com" },
    update: {},
    create: { name: "Jordan Lee", email: "guest@example.com", phone: "+1 555 0110", passwordHash: customerPassword },
  });

  const fireP = await prisma.dish.findUnique({ where: { slug: "fire-pizza" } });
  const burger = await prisma.dish.findUnique({ where: { slug: "embera-burger" } });

  if (fireP && burger) {
    const subtotal = Number(fireP.price) + Number(burger.price);
    const tax = +(subtotal * 0.08).toFixed(2);
    const total = +(subtotal + tax).toFixed(2);

    await prisma.order.create({
      data: {
        orderNumber: "EMB-DEMO0001",
        customerId: customer.id,
        orderType: OrderType.DELIVERY,
        address: "88 Bond St, Apt 4B",
        city: "New York",
        paymentMethod: PaymentMethod.CARD,
        paymentStatus: PaymentStatus.PAID,
        status: OrderStatus.PREPARING,
        subtotal, tax, deliveryFee: 4.99, total: +(total + 4.99).toFixed(2),
        estimatedTime: new Date(Date.now() + 35 * 60 * 1000),
        items: {
          create: [
            { dishId: fireP.id, quantity: 1, unitPrice: fireP.price },
            { dishId: burger.id, quantity: 1, unitPrice: burger.price },
          ],
        },
      },
    });
  }

  await prisma.reservation.create({
    data: {
      customerId: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone ?? "",
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      time: "19:30",
      guests: 4,
      status: ReservationStatus.CONFIRMED,
    },
  });

  if (fireP) {
    await prisma.review.create({
      data: {
        customerId: customer.id,
        rating: 5,
        comment: "The Fire Pizza alone is worth the trip. Char, smoke, perfect crust.",
        dishId: fireP.id,
        isApproved: true,
        isFeatured: true,
      },
    });
  }

  console.log("Seed complete.");
  console.log("Admin login:    admin@embera.com / Embera@Admin123");
  console.log("Manager login:  manager@embera.com / Embera@Manager123");
  console.log("Customer login: guest@example.com / Customer@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
