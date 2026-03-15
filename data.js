/* ── CONSTANTS ─────────────────────────────────────────────────────────────── */
const BAKERY_OPEN   = 8 * 60;   // 08:00 → 480 mins from midnight
const BAKERY_CLOSE  = 20 * 60;  // 20:00 → 1200 mins
const SLOT_CAPACITY = 10;       // max items per time window

/* ── MENU ITEMS ─────────────────────────────────────────────────────────────── */
const MENU_ITEMS = [
  { id:1,  name:"Almond Croissant",  category:"Pastries", price:4.50, prepTime:20,
    image:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80",
    description:"Flaky, buttery croissant layered with almond cream and toasted almond flakes.",
    ingredients:["Butter","Flour","Almond paste","Eggs","Sugar","Sliced almonds"] },

  { id:2,  name:"Blueberry Muffin",  category:"Muffins",  price:3.25, prepTime:15,
    image:"https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&q=80",
    description:"Moist golden muffin bursting with fresh blueberries and a crunchy sugar top.",
    ingredients:["Blueberries","Flour","Butter","Sugar","Buttermilk","Vanilla"] },

  { id:3,  name:"Lavender Cupcake",  category:"Cupcakes", price:4.00, prepTime:25,
    image:"https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80",
    description:"Delicate vanilla sponge infused with lavender, topped with silky honey buttercream.",
    ingredients:["Lavender","Vanilla","Flour","Butter","Honey","Cream"] },

  { id:4,  name:"Cinnamon Roll",     category:"Pastries", price:5.00, prepTime:30,
    image:"https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&q=80",
    description:"Soft pillowy roll swirled with cinnamon and brown sugar, glazed with cream cheese icing.",
    ingredients:["Flour","Cinnamon","Brown sugar","Cream cheese","Butter","Yeast"] },

  { id:5,  name:"Strawberry Tart",   category:"Cakes",    price:6.50, prepTime:40,
    image:"https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=600&q=80",
    description:"Crisp all-butter pastry shell filled with silky vanilla custard and fresh strawberries.",
    ingredients:["Strawberries","Custard","Butter","Flour","Vanilla","Sugar"] },

  { id:6,  name:"Chocolate Brownie", category:"Cookies",  price:3.75, prepTime:15,
    image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80",
    description:"Dense fudgy dark chocolate brownie with a crackly top and roasted walnuts.",
    ingredients:["Dark chocolate","Butter","Eggs","Sugar","Walnuts","Cocoa"] },

  { id:7,  name:"Matcha Latte",      category:"Drinks",   price:5.50, prepTime:5,
    image:"https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&q=80",
    description:"Ceremonial grade matcha whisked smooth with steamed oat milk and a touch of honey.",
    ingredients:["Matcha","Oat milk","Honey","Water"] },

  { id:8,  name:"Peach Danish",      category:"Pastries", price:4.75, prepTime:25,
    image:"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
    description:"Flaky laminated pastry filled with cream cheese and a fresh peach compote.",
    ingredients:["Peach","Cream cheese","Flour","Butter","Sugar","Vanilla"] },

  { id:9,  name:"Red Velvet Cake",   category:"Cakes",    price:7.00, prepTime:45,
    image:"https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&q=80",
    description:"Rich red velvet slice with velvety cream cheese frosting. A timeless classic.",
    ingredients:["Cocoa","Buttermilk","Cream cheese","Flour","Sugar","Vanilla"] },

  { id:10, name:"Hazelnut Macaron",  category:"Cookies",  price:2.50, prepTime:20,
    image:"https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&q=80",
    description:"Crisp meringue shells sandwiched with silky hazelnut chocolate ganache.",
    ingredients:["Almond flour","Hazelnut","Chocolate","Egg whites","Sugar","Cream"] },

  { id:11, name:"Vanilla Latte",     category:"Drinks",   price:4.75, prepTime:5,
    image:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
    description:"Double espresso with velvety steamed whole milk and house-made vanilla syrup.",
    ingredients:["Espresso","Whole milk","Vanilla syrup"] },

  { id:12, name:"Sourdough Loaf",    category:"Bread",    price:9.00, prepTime:60,
    image:"https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    description:"Artisan sourdough with open chewy crumb and blistered crust. Made with our 5-year wild starter.",
    ingredients:["Bread flour","Water","Salt","Wild yeast starter"] }
];

const CATEGORIES   = ["All","Pastries","Muffins","Cupcakes","Cakes","Cookies","Drinks","Bread"];
const FEATURED_IDS = [1, 3, 5, 9];

/* ── MOCK ORDER HISTORY (display only, no effect on capacity) ─────────────── */
const MOCK_ORDERS = [
  { id:"BK-2401", items:[{name:"Almond Croissant",qty:2,price:4.50},{name:"Matcha Latte",qty:1,price:5.50}],   total:14.50, pickupTime:"2:30 PM", date:"Yesterday", status:"Completed" },
  { id:"BK-2389", items:[{name:"Cinnamon Roll",qty:1,price:5.00},{name:"Vanilla Latte",qty:2,price:4.75}],      total:14.50, pickupTime:"1:00 PM", date:"2 days ago",  status:"Completed" }
];/* ── CONSTANTS ──────────────────────────────────────────────────────────────── */
const BAKERY_OPEN   = 8 * 60;   // 08:00 in minutes from midnight
const BAKERY_CLOSE  = 20 * 60;  // 20:00
const SLOT_INTERVAL = 10;       // minutes
const SLOT_CAPACITY = 10;       // max items per slot

/* ── MENU ITEMS ─────────────────────────────────────────────────────────────── */
const MENU_ITEMS = [
  { id:1,  name:"Almond Croissant",  category:"Pastries", price:4.50, prepTime:20,
    image:"https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80",
    description:"Flaky, buttery croissant layered with almond cream and toasted almond flakes. Baked golden every morning.",
    ingredients:["Butter","Flour","Almond paste","Eggs","Sugar","Sliced almonds"] },

  { id:2,  name:"Blueberry Muffin",  category:"Muffins",  price:3.25, prepTime:15,
    image:"https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&q=80",
    description:"Moist golden muffin bursting with fresh blueberries and a crunchy sugar top.",
    ingredients:["Blueberries","Flour","Butter","Sugar","Buttermilk","Vanilla"] },

  { id:3,  name:"Lavender Cupcake",  category:"Cupcakes", price:4.00, prepTime:25,
    image:"https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=600&q=80",
    description:"Delicate vanilla sponge infused with lavender, topped with silky honey buttercream.",
    ingredients:["Lavender","Vanilla","Flour","Butter","Honey","Cream"] },

  { id:4,  name:"Cinnamon Roll",     category:"Pastries", price:5.00, prepTime:30,
    image:"https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=600&q=80",
    description:"Soft pillowy roll swirled with cinnamon and brown sugar, glazed with cream cheese icing.",
    ingredients:["Flour","Cinnamon","Brown sugar","Cream cheese","Butter","Yeast"] },

  { id:5,  name:"Strawberry Tart",   category:"Cakes",    price:6.50, prepTime:40,
    image:"https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=600&q=80",
    description:"Crisp all-butter pastry shell filled with silky vanilla custard and fresh strawberries.",
    ingredients:["Strawberries","Custard","Butter","Flour","Vanilla","Sugar"] },

  { id:6,  name:"Chocolate Brownie", category:"Cookies",  price:3.75, prepTime:15,
    image:"https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&q=80",
    description:"Dense fudgy dark chocolate brownie with a crackly top and roasted walnuts.",
    ingredients:["Dark chocolate","Butter","Eggs","Sugar","Walnuts","Cocoa"] },

  { id:7,  name:"Matcha Latte",      category:"Drinks",   price:5.50, prepTime:5,
    image:"https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=600&q=80",
    description:"Ceremonial grade matcha whisked smooth with steamed oat milk and a touch of honey.",
    ingredients:["Matcha","Oat milk","Honey","Water"] },

  { id:8,  name:"Peach Danish",      category:"Pastries", price:4.75, prepTime:25,
    image:"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&q=80",
    description:"Flaky laminated pastry filled with cream cheese and a fresh peach compote.",
    ingredients:["Peach","Cream cheese","Flour","Butter","Sugar","Vanilla"] },

  { id:9,  name:"Red Velvet Cake",   category:"Cakes",    price:7.00, prepTime:45,
    image:"https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=600&q=80",
    description:"Rich red velvet slice with velvety cream cheese frosting. A timeless classic.",
    ingredients:["Cocoa","Buttermilk","Cream cheese","Flour","Sugar","Vanilla"] },

  { id:10, name:"Hazelnut Macaron",  category:"Cookies",  price:2.50, prepTime:20,
    image:"https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&q=80",
    description:"Crisp meringue shells sandwiched with silky hazelnut chocolate ganache.",
    ingredients:["Almond flour","Hazelnut","Chocolate","Egg whites","Sugar","Cream"] },

  { id:11, name:"Vanilla Latte",     category:"Drinks",   price:4.75, prepTime:5,
    image:"https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80",
    description:"Double espresso with velvety steamed whole milk and house-made vanilla syrup.",
    ingredients:["Espresso","Whole milk","Vanilla syrup"] },

  { id:12, name:"Sourdough Loaf",    category:"Bread",    price:9.00, prepTime:60,
    image:"https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&q=80",
    description:"Artisan sourdough with open chewy crumb and blistered crust. Made with our 5-year wild starter.",
    ingredients:["Bread flour","Water","Salt","Wild yeast starter"] }
];

const CATEGORIES   = ["All","Pastries","Muffins","Cupcakes","Cakes","Cookies","Drinks","Bread"];
const FEATURED_IDS = [1, 3, 5, 9];

/* ── MOCK CUSTOMER ORDERS (display only, no slot usage) ──────────────────── */
const MOCK_ORDERS = [
  { id:"BK-2401", items:[{name:"Almond Croissant",qty:2,price:4.50},{name:"Matcha Latte",qty:1,price:5.50}],   total:14.50, pickupTime:"2:30 PM", date:"Yesterday", status:"Completed" },
  { id:"BK-2389", items:[{name:"Cinnamon Roll",qty:1,price:5.00},{name:"Vanilla Latte",qty:2,price:4.75}],      total:14.50, pickupTime:"1:00 PM", date:"2 days ago",  status:"Completed" }
];

/* ── SLOT CAPACITY MAP — starts at 0, built from real confirmed orders ──────── */
// Do NOT pre-fill with random values. All slots start empty.
// Usage is tracked in State.slotUsage and updated on each confirmed order.
function buildEmptySlotMap() {
  const caps = {};
  let t = BAKERY_OPEN;
  while (t < BAKERY_CLOSE) {
    const h = String(Math.floor(t / 60)).padStart(2,'0');
    const m = String(t % 60).padStart(2,'0');
    caps[`${h}:${m}`] = 0;
    t += SLOT_INTERVAL;
  }
  return caps;
}
