import { createClient, User } from '@supabase/supabase-js';
import { CustomerOrder, OrderStatus, UserProfile } from '../types/auth';
import { Product } from '../types';

import smokeyTandooriImg from '../assets/images/smokey_tandoori.png';
import chilliOilImg from '../assets/images/chilli_oil.png';
import pestoImg from '../assets/images/pesto.png';
import pizzaSauceImg from '../assets/images/pizza_sauce.png';
import mintDipImg from '../assets/images/mint_dip.png';
import podiImg from '../assets/images/podi.png';
import kesariShrikhandImg from '../assets/images/Kesari_shrikhand.png';
import hummusImg from '../assets/images/Hummus.png';

export const LOCAL_PRODUCT_IMAGES: Record<string, string> = {
  'smokey-tandoori': smokeyTandooriImg,
  'sichuan-chilli-oil': chilliOilImg,
  'pesto': pestoImg,
  'chunky-pizza-sauce': pizzaSauceImg,
  'pizza-sauce': pizzaSauceImg,
  'mint-dip': mintDipImg,
  'podi': podiImg,
  'kesari-shrikhand': kesariShrikhandImg,
  'hummus': hummusImg,
  'apple-tam-jam': '',
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Configured check ensures placeholders don't cause unhandled network crashes
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id') &&
  !supabaseAnonKey.includes('your-anon-public-key')
);

// Fallback dummy credentials if real Supabase keys are not yet provided
const fallbackUrl = 'https://placeholder-project.supabase.co';
const fallbackKey = 'placeholder-anon-key';

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl : fallbackUrl,
  isSupabaseConfigured ? supabaseAnonKey : fallbackKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

export const OWNER_EMAIL = (
  import.meta.env.VITE_OWNER_EMAIL || 'owner@thelocalpantry.in'
).toLowerCase().trim();

export const isUserOwner = (user: User | null): boolean => {
  if (!user || !user.email) return false;
  const userEmail = user.email.toLowerCase().trim();
  const ownerEmail = OWNER_EMAIL.toLowerCase().trim();
  const isEmailMatch = Boolean(ownerEmail) && userEmail === ownerEmail;
  const isAppRoleOwner = user.app_metadata?.role === 'owner';
  return isEmailMatch || isAppRoleOwner;
};

// ==========================================
// SUPABASE DATABASE OPERATIONS
// ==========================================

/**
 * Fetch all products from Supabase 'products' table.
 */
export async function getSupabaseProducts(): Promise<{ data: Product[] | null; error: any }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase is not configured yet') };
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true });

    if (error) throw error;

    if (data && data.length > 0) {
      const mapped: Product[] = data.map((item: any) => ({
        id: item.id,
        name: item.name,
        category: item.category,
        subtitle: item.subtitle || '',
        weight: item.weight || '',
        price: Number(item.price),
        rating: Number(item.rating || 4.8),
        reviewCount: Number(item.review_count || 50),
        tag: item.tag,
        tagType: item.tag_type,
        description: item.description || '',
        longDescription: item.long_description || item.description || '',
        imageUrl: LOCAL_PRODUCT_IMAGES[item.id] !== undefined ? LOCAL_PRODUCT_IMAGES[item.id] : (item.image_url || ''),
        altText: item.alt_text || item.name,
        ingredients: item.ingredients || [],
        pairingSuggestions: item.pairing_suggestions || [],
        shelfLife: item.shelf_life || '4 weeks',
        heatLevel: item.heat_level || 'Mild',
        dietary: item.dietary || ['Vegetarian', 'Preservative-Free'],
        stock_status: (item.stock_status as any) || 'In Stock',
        stockStatus: (item.stock_status as any) || 'In Stock',
      }));
      return { data: mapped, error: null };
    }

    return { data: [], error: null };
  } catch (err: any) {
    console.warn('Could not fetch products from Supabase:', err.message);
    return { data: null, error: err };
  }
}

/**
 * Update product price in Supabase
 */
export async function updateSupabaseProductPrice(productId: string, price: number) {
  if (!isSupabaseConfigured) return { error: null };
  return await supabase
    .from('products')
    .update({ price, updated_at: new Date().toISOString() })
    .eq('id', productId);
}

/**
 * Update product stock status in Supabase
 */
export async function updateSupabaseProductStock(productId: string, stock_status: string) {
  if (!isSupabaseConfigured) return { error: null };
  return await supabase
    .from('products')
    .update({ stock_status, updated_at: new Date().toISOString() })
    .eq('id', productId);
}

// Known legacy mock or test order IDs to exclude
export const DUMMY_OR_TEST_IDS = new Set([
  'LP-TEST-4586',
  'LP-94018',
  'LP-94015',
  'LP-94009',
  'LP-94021',
  'LP-89412',
  'LP-89390',
  'LP-89345',
  'LP-89218',
  'LP-89104',
]);

export const isDummyOrTestOrder = (row: any): boolean => {
  if (!row || !row.id) return false;
  const idStr = String(row.id).toUpperCase();
  if (idStr.includes('TEST') || DUMMY_OR_TEST_IDS.has(row.id)) return true;
  if (
    row.customer_email &&
    (row.customer_email.toLowerCase().includes('test@') ||
      row.customer_email.toLowerCase().includes('@example.com'))
  ) {
    return true;
  }
  if (
    row.customer_name &&
    (row.customer_name.toLowerCase().includes('test customer') ||
      row.customer_name.toLowerCase().includes('dummy'))
  ) {
    return true;
  }
  return false;
};

/**
 * Fetch all customer orders from Supabase 'orders' table.
 * Strictly excludes any test/mock seed orders to ensure the live dashboard
 * starts fresh with zero mock records.
 */
export async function getSupabaseOrders(): Promise<{ data: CustomerOrder[] | null; error: any }> {
  if (!isSupabaseConfigured) {
    return { data: null, error: new Error('Supabase is not configured yet') };
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    if (data) {
      // Filter out mock / test orders
      const realOrders = data.filter((row: any) => !isDummyOrTestOrder(row));

      const mapped: CustomerOrder[] = realOrders.map((row: any) => ({
        id: row.id,
        customerName: row.customer_name,
        customerEmail: row.customer_email,
        customerPhone: row.customer_phone,
        shippingAddress: row.shipping_address,
        city: row.city,
        pincode: row.pincode,
        date: new Date(row.created_at || Date.now()).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        items: row.items || [],
        subtotal: Number(row.subtotal),
        shippingFee: Number(row.shipping_fee || 0),
        total: Number(row.total),
        paymentMethod: row.payment_method || 'UPI',
        status: row.status as OrderStatus,
        notes: row.notes,
      }));
      return { data: mapped, error: null };
    }

    return { data: [], error: null };
  } catch (err: any) {
    console.warn('Could not fetch orders from Supabase:', err.message);
    return { data: null, error: err };
  }
}

/**
 * Create a new order in Supabase
 */
export async function createSupabaseOrder(order: CustomerOrder, userId?: string) {
  if (!isSupabaseConfigured) {
    return { error: null };
  }

  try {
    // Validate that userId is a valid UUID before passing to postgres uuid column
    const isUUID = userId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);

    const payload = {
      id: order.id,
      user_id: isUUID ? userId : null,
      customer_name: order.customerName,
      customer_email: order.customerEmail,
      customer_phone: order.customerPhone,
      shipping_address: order.shippingAddress,
      city: order.city,
      pincode: order.pincode,
      items: order.items,
      subtotal: order.subtotal,
      shipping_fee: order.shippingFee,
      total: order.total,
      payment_method: order.paymentMethod,
      status: order.status,
      notes: order.notes || null,
    };

    const { error } = await supabase.from('orders').insert([payload]);
    if (error) throw error;
    return { error: null };
  } catch (err: any) {
    console.warn('Failed to insert order into Supabase:', err.message);
    return { error: err };
  }
}

/**
 * Update an order's status in Supabase
 */
export async function updateSupabaseOrderStatus(orderId: string, status: OrderStatus) {
  if (!isSupabaseConfigured) return { error: null };
  return await supabase
    .from('orders')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', orderId);
}

/**
 * Seed sample products into Supabase 'products' table
 */
export async function seedProductsToSupabase(products: Product[]) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase credentials are not configured in .env yet.');
  }

  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    subtitle: p.subtitle,
    weight: p.weight,
    price: p.price,
    rating: p.rating,
    review_count: p.reviewCount,
    tag: p.tag,
    tag_type: p.tagType,
    description: p.description,
    long_description: p.longDescription,
    image_url: p.imageUrl,
    alt_text: p.altText,
    ingredients: p.ingredients,
    pairing_suggestions: p.pairingSuggestions,
    shelf_life: p.shelfLife,
    heat_level: p.heatLevel,
    dietary: p.dietary,
    stock_status: 'In Stock',
  }));

  const { error } = await supabase.from('products').upsert(rows, { onConflict: 'id' });
  if (error) throw error;
  return { success: true };
}

/**
 * Seed sample initial orders into Supabase 'orders' table
 */
export async function seedSampleOrdersToSupabase(orders: CustomerOrder[]) {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase credentials are not configured in .env yet.');
  }

  const rows = orders.map((o) => ({
    id: o.id,
    customer_name: o.customerName,
    customer_email: o.customerEmail,
    customer_phone: o.customerPhone,
    shipping_address: o.shippingAddress,
    city: o.city,
    pincode: o.pincode,
    items: o.items,
    subtotal: o.subtotal,
    shipping_fee: o.shippingFee,
    total: o.total,
    payment_method: o.paymentMethod,
    status: o.status,
    notes: o.notes || null,
  }));

  const { error } = await supabase.from('orders').upsert(rows, { onConflict: 'id' });
  if (error) throw error;
  return { success: true };
}

/**
 * Maps a Supabase User object into our application's UserProfile
 */
export const mapSupabaseUserToProfile = (user: User): UserProfile => {
  const isOwner = isUserOwner(user);
  const fullName = isOwner
    ? 'Vikas Oli'
    : user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      user.user_metadata?.username ||
      user.email?.split('@')[0] ||
      'Pantry Patron';

  const username = isOwner
    ? 'vikas_oli'
    : user.user_metadata?.username ||
      user.user_metadata?.user_name ||
      fullName.toLowerCase().replace(/[^a-z0-9_]/g, '_');

  const initials = isOwner
    ? 'VO'
    : fullName
        .split(' ')
        .filter(Boolean)
        .map((n: string) => n[0].toUpperCase())
        .slice(0, 2)
        .join('') || 'LP';

  return {
    id: user.id,
    name: fullName,
    username: username,
    email: user.email || '',
    role: isOwner ? 'owner' : 'customer',
    avatarInitials: initials,
    phone: user.user_metadata?.phone || '+91 98200 12345',
    address: user.user_metadata?.address || 'Civil Lines, Near Lake',
    city: user.user_metadata?.city || 'Banswara',
  };
};

/**
 * Real Supabase Auth: Sign Up with email, password, and metadata
 */
export async function signUpUser({
  email,
  password,
  fullName,
  username,
  role = 'customer',
}: {
  email: string;
  password: string;
  fullName: string;
  username?: string;
  role?: 'customer' | 'owner';
}) {
  if (!isSupabaseConfigured) {
    return {
      data: null,
      error: new Error('Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'),
    };
  }

  // Enforce server-side security: users cannot self-assign owner role unless email matches OWNER_EMAIL
  const sanitizedRole = email.toLowerCase().trim() === OWNER_EMAIL.toLowerCase().trim() ? 'owner' : 'customer';

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        username: username || fullName.toLowerCase().replace(/[^a-z0-9_]/g, '_'),
        role: sanitizedRole,
      },
    },
  });

  return { data, error };
}

/**
 * Real Supabase Auth: Sign In with email and password
 */
export async function signInUser({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  if (!isSupabaseConfigured) {
    return {
      data: null,
      error: new Error('Supabase is not configured yet. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'),
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}

/**
 * Real Supabase Auth: Sign Out
 */
export async function signOutUser() {
  if (!isSupabaseConfigured) return { error: null };
  return await supabase.auth.signOut();
}

/**
 * Realtime listener for orders table changes
 */
export function subscribeToOrders(onUpdate: () => void) {
  if (!isSupabaseConfigured) return () => {};

  const channel = supabase
    .channel('orders-realtime-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'orders' },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Realtime listener for products table changes (stock, prices, edits)
 */
export function subscribeToProducts(onUpdate: () => void) {
  if (!isSupabaseConfigured) return () => {};

  const channel = supabase
    .channel('products-realtime-channel')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'products' },
      () => {
        onUpdate();
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

