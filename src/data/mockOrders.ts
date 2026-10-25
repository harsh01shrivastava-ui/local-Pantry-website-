import { CustomerOrder, UserProfile } from '../types/auth';

/**
 * Dummy fallback data has been removed.
 * All orders, products, and customer/owner sessions are dynamically fetched
 * from the live Supabase database and authentication provider.
 */
export const MOCK_CUSTOMER: UserProfile | null = null;
export const MOCK_OWNER: UserProfile | null = null;
export const INITIAL_ORDERS: CustomerOrder[] = [];
