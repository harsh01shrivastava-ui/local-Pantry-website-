-- ==============================================================================
-- THE LOCAL PANTRY - SUPABASE DATABASE SCHEMA & MIGRATION SCRIPT
-- ==============================================================================
-- Run this script in your Supabase project's SQL Editor (Dashboard -> SQL Editor)
-- to create the tables, indexes, row-level security (RLS), and sample seed data.
-- ==============================================================================

-- 1. Enable UUID Extension (standard in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. PRODUCTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    subtitle TEXT,
    weight TEXT,
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    rating NUMERIC(3, 1) DEFAULT 4.8,
    review_count INTEGER DEFAULT 50,
    tag TEXT,
    tag_type TEXT,
    description TEXT,
    long_description TEXT,
    image_url TEXT,
    alt_text TEXT,
    ingredients JSONB DEFAULT '[]'::jsonb,
    pairing_suggestions JSONB DEFAULT '[]'::jsonb,
    shelf_life TEXT DEFAULT '4 weeks',
    heat_level TEXT DEFAULT 'Mild',
    dietary JSONB DEFAULT '["Vegetarian", "Preservative-Free"]'::jsonb,
    stock_status TEXT DEFAULT 'In Stock',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category filtering & fast lookup
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON public.products(created_at DESC);

-- ==============================================================================
-- 3. ORDERS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    shipping_address TEXT NOT NULL,
    city TEXT NOT NULL,
    pincode TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_method TEXT NOT NULL DEFAULT 'UPI',
    status TEXT NOT NULL DEFAULT 'Pending', -- 'Pending', 'Processing', 'Completed', 'Cancelled'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast order lookups by email, status, and creation date
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON public.orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Enable RLS on both tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Product Policies:
-- 1. Allow anyone (guest, customer, public) to view published products
DROP POLICY IF EXISTS "Public can view products" ON public.products;
CREATE POLICY "Public can view products"
    ON public.products FOR SELECT
    USING (true);

-- 2. Allow only authorized Store Owner to modify, update price, or manage products
DROP POLICY IF EXISTS "Store owner can manage products" ON public.products;
DROP POLICY IF EXISTS "Allow updates to products" ON public.products;
CREATE POLICY "Store owner can manage products"
    ON public.products FOR ALL
    USING (
        (auth.jwt() ->> 'email' = 'harsh01.shrivastava@gmail.com') OR
        ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner') OR
        ((auth.jwt() -> 'user_metadata' ->> 'role') = 'owner' AND auth.jwt() ->> 'email' = 'harsh01.shrivastava@gmail.com')
    )
    WITH CHECK (
        (auth.jwt() ->> 'email' = 'harsh01.shrivastava@gmail.com') OR
        ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner') OR
        ((auth.jwt() -> 'user_metadata' ->> 'role') = 'owner' AND auth.jwt() ->> 'email' = 'harsh01.shrivastava@gmail.com')
    );

-- Order Policies:
-- 1. Allow anyone (guest or customer) to place a new order at checkout
DROP POLICY IF EXISTS "Allow anyone to insert orders" ON public.orders;
CREATE POLICY "Allow anyone to insert orders"
    ON public.orders FOR INSERT
    WITH CHECK (true);

-- 2. Allow Store Owner to view all kitchen orders; Patrons can view their own orders
DROP POLICY IF EXISTS "Store owner can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Allow viewing orders" ON public.orders;
CREATE POLICY "Store owner can view all orders"
    ON public.orders FOR SELECT
    USING (
        (auth.jwt() ->> 'email' = 'harsh01.shrivastava@gmail.com') OR
        ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner') OR
        (auth.uid() IS NOT NULL AND auth.uid() = user_id) OR
        (auth.jwt() ->> 'email' IS NOT NULL AND customer_email = auth.jwt() ->> 'email')
    );

-- 3. Allow Store Owner to update order status (e.g. from the Owner Dashboard)
DROP POLICY IF EXISTS "Store owner can update order status" ON public.orders;
DROP POLICY IF EXISTS "Allow updating order status" ON public.orders;
CREATE POLICY "Store owner can update order status"
    ON public.orders FOR UPDATE
    USING (
        (auth.jwt() ->> 'email' = 'harsh01.shrivastava@gmail.com') OR
        ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner') OR
        ((auth.jwt() -> 'user_metadata' ->> 'role') = 'owner' AND auth.jwt() ->> 'email' = 'harsh01.shrivastava@gmail.com')
    )
    WITH CHECK (
        (auth.jwt() ->> 'email' = 'harsh01.shrivastava@gmail.com') OR
        ((auth.jwt() -> 'app_metadata' ->> 'role') = 'owner') OR
        ((auth.jwt() -> 'user_metadata' ->> 'role') = 'owner' AND auth.jwt() ->> 'email' = 'harsh01.shrivastava@gmail.com')
    );

-- Enable Supabase Realtime replication on orders (so owner dashboard updates instantly)
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- ==============================================================================
-- 5. INITIAL SEED DATA FOR PRODUCTS (EXACT 9 OFFICIAL PANTRY PRODUCTS)
-- ==============================================================================
INSERT INTO public.products (
    id, name, category, subtitle, weight, price, rating, review_count, tag, tag_type, description, long_description, image_url, alt_text, ingredients, pairing_suggestions, shelf_life, heat_level, dietary, stock_status
) VALUES
(
    'smokey-tandoori',
    'Smokey Tandoori',
    'sauces',
    'Hung curd based dip • 200ml',
    '200ml',
    250.00,
    4.8,
    68,
    'New Drop',
    'new',
    'Hung curd based dip. Mild spicy, maximum tandoori flavour.',
    'Capturing the deep, wood-fired aroma of clay ovens. Made with thick hung curd, stone-pounded Kashmiri chillies for natural vibrant color, dry-roasted cumin, whole coriander, kasuri methi, crushed raw ginger-garlic paste, and wood-charred cold-pressed mustard oil. Mild spicy, maximum tandoori flavour for marinades, dips, and sandwich spreads.',
    '/src/assets/images/smokey_tandoori.png',
    'Artisanal glass jar of Smokey Tandoori hung curd dip with kraft tag',
    '["Hung curd (chakka)", "Kashmiri red chillies", "Wood-smoked cold-pressed mustard oil", "Fresh garlic & ginger paste", "Dry-roasted cumin seeds", "Stone-ground coriander", "Kasuri methi", "Amchur (dry mango powder)", "Black salt & rock salt"]'::jsonb,
    '["Mix with paneer, mushrooms, or tofu before air-frying or grilling", "Slather on toasted flatbreads or sourdough wraps", "Dip with warm naan, lavash, or crispy roasted potatoes", "Spread directly onto burger buns and sourdough toast"]'::jsonb,
    '4 weeks',
    'Mild',
    '["Vegetarian", "Gluten-Free", "No Artificial Food Colors", "Preservative-Free"]'::jsonb,
    'In Stock'
),
(
    'sichuan-chilli-oil',
    'Sichuan Chilli Oil',
    'chili',
    'Champawat peppercorns • 200ml',
    '200ml',
    350.00,
    4.9,
    198,
    'Bestseller 🔥',
    'bestseller',
    'Infused with Sichuan peppercorns sourced from forests of Champawat, Uttrakhand. Blend of 2 chillies. Spicy, aromatic.',
    'Infused with Sichuan peppercorns sourced directly from the dense mountain forests of Champawat, Uttarakhand. Slow-simmered with a bespoke blend of 2 sun-dried Indian chillies, crispy thin-sliced garlic chips, golden shallots, and toasted sesame seeds in cold-pressed oil. Intensely spicy, numbing, and aromatic.',
    '/src/assets/images/chilli_oil.png',
    'Artisanal glass jar of crunchy Sichuan Chilli Oil with kraft tag and chilli flakes',
    '["Champawat wild Sichuan peppercorns", "Blend of 2 chillies (Guntur & Kashmiri)", "Cold-pressed sesame oil", "Cold-pressed mustard oil", "Crispy slow-fried garlic", "Crispy shallots", "Toasted white sesame seeds", "Sea salt", "Star anise"]'::jsonb,
    '["Drizzle over morning sunny-side eggs & steaming rice", "Swirl into wonton soup, momos, or instant ramen", "Dip crusty sourdough or flatbreads", "Toss with roasted baby potatoes or edamame"]'::jsonb,
    '8 weeks',
    'Hot',
    '["Vegan", "Gluten-Free", "Preservative-Free", "No Palm Oil"]'::jsonb,
    'In Stock'
),
(
    'pesto',
    'Pesto',
    'pesto',
    'Nutty walnut & fresh basil • 200ml',
    '200ml',
    410.00,
    5.0,
    115,
    'Fresh Batch',
    'fresh',
    'Packed with nutty walnuts, extra virgin olive oil, and fresh basil. Without parmesan.',
    'Packed with nutty walnuts, cold-pressed extra virgin olive oil, and freshly harvested sweet basil leaves. Crafted entirely without parmesan cheese, creating a pure, plant-based green pesto that lets the natural basil aroma and walnut crunch shine without dairy fillers.',
    '/src/assets/images/pesto.png',
    'Hands holding freshly blended Walnut Basil Pesto in an artisanal glass jar',
    '["Freshly harvested sweet basil", "Extra virgin olive oil", "Nutty toasted walnuts", "Fresh garlic cloves", "Lemon zest & juice", "Cracked Malabar black pepper", "Natural sea salt"]'::jsonb,
    '["Toss with warm al-dente linguine pasta or gnocchi", "Spread onto toasted sourdough with salted ricotta or tomatoes", "Spoon over ripe heirloom tomatoes and avocados", "Stir into warm vegetable minestrone soup"]'::jsonb,
    '12 days',
    'None',
    '["Vegan", "Gluten-Free", "Dairy-Free", "Preservative-Free", "Zero Added Sugar"]'::jsonb,
    'In Stock'
),
(
    'chunky-pizza-sauce',
    'Chunky Pizza Sauce',
    'sauces',
    'Slow cooked 2 hours • 200ml',
    '200ml',
    250.00,
    4.8,
    92,
    'Kitchen Essential',
    'essential',
    'Slow cooked for 2 hours, basil infused. Healthy replacement for ketchup.',
    'Slow cooked for 2 hours to concentrate natural sweetness and reduce acidity, basil infused. Made with ripe vine plum tomatoes, caramelized shallots, slow-crushed garlic, wild oregano, and cold-pressed extra virgin olive oil. A healthy, wholesome replacement for ketchup and processed dipping sauces.',
    '/src/assets/images/pizza_sauce.png',
    'Open glass jar of Chunky Pizza Sauce with gold spoon, fresh tomatoes, and basil leaves',
    '["Slow-simmered plum tomatoes", "Caramelized shallots", "Fresh mountain oregano", "Fresh basil sprigs", "Slow-crushed garlic", "Extra virgin olive oil", "Balsamic reduction", "Sea salt", "Coarse black pepper"]'::jsonb,
    '["Spread generously on artisanal pizza bases & flatbreads", "Healthy dipping companion for sourdough grilled cheese & fries", "Toss with penne, rigatoni, or gnocchi", "Use as base for shakshuka or baked eggs"]'::jsonb,
    '4 weeks',
    'Mild',
    '["Vegan", "Gluten-Free", "Preservative-Free", "Zero Added Corn Syrup", "Healthy Ketchup Alternative"]'::jsonb,
    'In Stock'
),
(
    'mint-dip',
    'Mint Dip',
    'pesto',
    'Hung curd & fresh herbs • 200ml',
    '200ml',
    210.00,
    4.9,
    54,
    'Fresh Batch',
    'fresh',
    'Hung curd based mint & coriander dip. Light, fresh & minty.',
    'Hung curd based mint & coriander dip crafted with hand-picked spearmint and fresh cilantro. Light, fresh & minty, gently stone-ground with dry-roasted cumin seeds, green chillies, Himalayan black salt, and a splash of lime juice for a cooling, zesty accompaniment.',
    '/src/assets/images/mint_dip.png',
    'Glass jar of refreshing green hung curd Mint Dip with kraft label',
    '["Hung curd (chakka)", "Fresh garden spearmint", "Fresh coriander leaves", "Cold-pressed extra virgin olive oil", "Dry-roasted cumin seeds", "Green chillies", "Lemon zest & juice", "Kala namak (black salt)", "Natural sea salt"]'::jsonb,
    '["Dip for crispy vegetable kebabs & samosas", "Spread on grilled cheese, wraps, and paninis", "Drizzle over grain bowls and sprout chaat", "Serve with artisanal lavash and sourdough crackers"]'::jsonb,
    '5 days',
    'Mild',
    '["Vegetarian", "Gluten-Free", "Preservative-Free", "No Artificial Flavors"]'::jsonb,
    'Low Stock'
),
(
    'podi',
    'Podi',
    'heritage',
    '3 lentils & 2 chillies • 200ml',
    '200ml',
    250.00,
    4.9,
    124,
    'Heritage Recipe',
    'heritage',
    'Classic gunpowder with blend of 3 lentils & 2 chillies. Umami, nutty, spicy.',
    'Classic gunpowder crafted with a nutritious blend of 3 lentils (chana, urad, and toor) slow-roasted in heavy cast-iron kadhais, then stone-crushed with 2 chillies, sun-dried curry leaves, roasted cumin, asafoetida (hing), and toasted white sesame. Umami, nutty, spicy condiment to mix with hot melted desi ghee or sesame oil.',
    '/src/assets/images/podi.png',
    'Glass jar of South Indian Gunpowder Podi roasted lentil spice blend with kraft label',
    '["Roasted split Bengal gram (Chana dal)", "Roasted black gram (Urad dal)", "Roasted pigeon pea (Toor dal)", "Blend of 2 dried red chillies", "Sun-dried fresh curry leaves", "Roasted white sesame", "Compounded asafoetida", "Pink Himalayan rock salt"]'::jsonb,
    '["Mix with hot melted Desi Ghee over steaming idlis", "Dust liberally over crispy dosas and uttapams", "Toss with roasted baby potatoes or bhindi", "Sprinkle over avocado toast with a squeeze of lime"]'::jsonb,
    '8 weeks',
    'Medium',
    '["Vegan", "Gluten-Free", "Preservative-Free", "High Protein"]'::jsonb,
    'In Stock'
),
(
    'kesari-shrikhand',
    'Kesari Shrikhand',
    'heritage',
    'Kesar infused hung curd • 200ml',
    '200ml',
    210.00,
    5.0,
    88,
    'Weekend Special',
    'weekend',
    'Kesar infused hung curd. Rich, floral, sweet & soothing. Not highly sweetened.',
    'Kesar infused hung curd dessert steeped in authentic Mewari tradition. Whole curd suspended in cotton muslin until pure, velvety chakka forms, then patiently folded with Kashmiri Mogra saffron, freshly cracked green cardamom, and unrefined raw khand sugar. Rich, floral, sweet & soothing, with restrained sweetness.',
    '/src/assets/images/Kesari_shrikhand.png',
    'Artisanal glass jar of rich Shrikhand dessert with kraft tag',
    '["Hung whole organic curd (Chakka)", "Unrefined raw khand sugar", "Pure Kashmiri Mogra saffron", "Fresh stone-ground Idukki cardamom", "Slivered Californian almonds", "Hand-cut Iranian pistachios", "Charoli seeds"]'::jsonb,
    '["Pair alongside warm, ballooning puffed puris", "Spoon cold over fresh berries or roasted figs", "Serve as celebratory dessert with chai", "Spread over warm sweet crepes or parathas"]'::jsonb,
    '5 days',
    'None',
    '["Vegetarian", "Gluten-Free", "No Preservatives", "Unrefined Sugar"]'::jsonb,
    'In Stock'
),
(
    'hummus',
    'Hummus',
    'pesto',
    'Airy chickpea & in-house tahini • 200ml',
    '200ml',
    210.00,
    4.8,
    76,
    'Fresh Batch',
    'fresh',
    'Airy, fluffy chickpea hummus made with in-house tahini.',
    'Airy, fluffy chickpea hummus made with slow-cooked tender chickpeas stone-ground with our in-house stone-ground sesame tahini, fresh lemon juice, roasted garlic, and cold-pressed extra virgin olive oil. Exceptionally silky, creamy, and wholesome.',
    '/src/assets/images/Hummus.png',
    'Artisanal glass jar of fluffy stone-ground Hummus with kraft tag',
    '["Slow-cooked chickpeas", "In-house stone-ground sesame tahini", "Extra virgin olive oil", "Fresh lemon juice", "Roasted garlic", "Dry-roasted cumin", "Sea salt", "Paprika garnish"]'::jsonb,
    '["Warm pita bread & sourdough toasts", "Crunchy veggie crudités & lavash", "Spoon into grain bowls & falafel wraps", "Base spread for avocado toasts"]'::jsonb,
    '4 days',
    'None',
    '["Vegan", "Gluten-Free", "Preservative-Free", "High Fiber"]'::jsonb,
    'In Stock'
),
(
    'apple-tam-jam',
    'Apple Tam Jam',
    'heritage',
    'Dates & jaggery sweetened • 200ml',
    '200ml',
    330.00,
    4.9,
    61,
    'Artisanal Drop',
    'new',
    'Slow cooked apples for 2 hours in fresh tamarind pulp. Sweetened with dates & jaggery. Earthy, sweet, tangy.',
    'Slow cooked apples for 2 hours in fresh tamarind pulp. Marrying crisp mountain apples with tart tamarind, naturally sweetened without refined sugar using mineral-rich organic jaggery and whole dates, accented with Ceylon cinnamon bark. Earthy, sweet, tangy, and deeply comforting.',
    '',
    'Artisanal glass jar of Apple Tam Jam',
    '["Fresh mountain apples", "Sun-cured fresh tamarind pulp", "Dates", "Organic jaggery", "Ceylon cinnamon", "Whole cloves", "Himalayan pink salt"]'::jsonb,
    '["Spread over buttered warm sourdough toast", "Pair alongside sharp cheddar and brie on cheese boards", "Glaze over roasted root vegetables or paneer", "Swirl into morning Greek yogurt or warm porridge"]'::jsonb,
    '8 weeks',
    'None',
    '["Vegan", "Gluten-Free", "Preservative-Free", "Refined Sugar Free", "Naturally Sweetened"]'::jsonb,
    'In Stock'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    category = EXCLUDED.category,
    subtitle = EXCLUDED.subtitle,
    weight = EXCLUDED.weight,
    price = EXCLUDED.price,
    description = EXCLUDED.description,
    long_description = EXCLUDED.long_description,
    image_url = EXCLUDED.image_url,
    alt_text = EXCLUDED.alt_text,
    shelf_life = EXCLUDED.shelf_life,
    stock_status = EXCLUDED.stock_status,
    updated_at = NOW();

-- ==============================================================================
-- 6. INITIAL SEED DATA FOR ORDERS
-- ==============================================================================
INSERT INTO public.orders (
    id, customer_name, customer_email, customer_phone, shipping_address, city, pincode, items, subtotal, shipping_fee, total, payment_method, status, notes
) VALUES
(
    'LP-89412',
    'Ananya Mehta',
    'ananya.mehta@example.com',
    '+91 98201 12345',
    'Flat 402, Sea View Apartments, Bandra West',
    'Mumbai',
    '400050',
    '[
        {"productId": "sichuan-chilli-oil", "productName": "Sichuan Chilli Oil", "quantity": 2, "jarSize": "Standard", "unitPrice": 350},
        {"productId": "smokey-tandoori", "productName": "Smokey Tandoori", "quantity": 1, "jarSize": "Standard", "unitPrice": 250}
    ]'::jsonb,
    950.00,
    0.00,
    950.00,
    'UPI',
    'Pending',
    'Please pack with extra thermal bubble wrap for air transit.'
),
(
    'LP-89390',
    'Vikramaditya Rao',
    'vikram.rao@techhub.in',
    '+91 99000 88776',
    'Villa 14, Palm Meadows, Whitefield',
    'Bengaluru',
    '560066',
    '[
        {"productId": "podi", "productName": "Podi", "quantity": 3, "jarSize": "Standard", "unitPrice": 250},
        {"productId": "pesto", "productName": "Pesto", "quantity": 1, "jarSize": "Standard", "unitPrice": 410}
    ]'::jsonb,
    1160.00,
    0.00,
    1160.00,
    'Card',
    'Processing',
    'Fragile glass containers.'
),
(
    'LP-89345',
    'Priyanka Sen',
    'priyanka.sen@designworks.com',
    '+91 98311 22334',
    '72/B Park Street, Apt 3C',
    'Kolkata',
    '700016',
    '[
        {"productId": "chunky-pizza-sauce", "productName": "Chunky Pizza Sauce", "quantity": 2, "jarSize": "Standard", "unitPrice": 250},
        {"productId": "mint-dip", "productName": "Mint Dip", "quantity": 1, "jarSize": "Standard", "unitPrice": 210}
    ]'::jsonb,
    710.00,
    99.00,
    809.00,
    'UPI',
    'Processing',
    NULL
),
(
    'LP-89218',
    'Devendra Rathore',
    'devendra.rathore@rajasthan.gov.in',
    '+91 94141 55667',
    'Plot 12, Malviya Nagar',
    'Jaipur',
    '302017',
    '[
        {"productId": "kesari-shrikhand", "productName": "Kesari Shrikhand", "quantity": 2, "jarSize": "Standard", "unitPrice": 210},
        {"productId": "hummus", "productName": "Hummus", "quantity": 2, "jarSize": "Standard", "unitPrice": 210}
    ]'::jsonb,
    840.00,
    99.00,
    939.00,
    'UPI',
    'Completed',
    'Dispatched via Rajasthan Express Courier.'
),
(
    'LP-89104',
    'Kavita Chawla',
    'kavita.chawla@delhidiaries.org',
    '+91 98110 99887',
    'D-56 Defence Colony',
    'New Delhi',
    '110024',
    '[
        {"productId": "apple-tam-jam", "productName": "Apple Tam Jam", "quantity": 1, "jarSize": "Standard", "unitPrice": 330},
        {"productId": "sichuan-chilli-oil", "productName": "Sichuan Chilli Oil", "quantity": 1, "jarSize": "Standard", "unitPrice": 350},
        {"productId": "smokey-tandoori", "productName": "Smokey Tandoori", "quantity": 1, "jarSize": "Standard", "unitPrice": 250}
    ]'::jsonb,
    930.00,
    0.00,
    930.00,
    'Card',
    'Completed',
    'Includes handwritten gift message.'
)
ON CONFLICT (id) DO NOTHING;

