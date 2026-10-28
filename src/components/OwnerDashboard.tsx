import React, { useState, useEffect } from 'react';
import { CustomerOrder, OrderStatus, UserProfile } from '../types/auth';
import { Product } from '../types';
import { isSupabaseConfigured } from '../lib/supabase';

interface OwnerDashboardProps {
  currentUser: UserProfile;
  orders: CustomerOrder[];
  products: Product[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  onUpdateProductPrice?: (productId: string, newPrice: number) => void;
  onUpdateProductStock?: (productId: string, status: 'In Stock' | 'Low Stock' | 'Out of Stock') => void;
  onRefreshData?: () => Promise<{ success: boolean; message: string }>;
  onNavigateToShop: () => void;
}

export const OwnerDashboard: React.FC<OwnerDashboardProps> = ({
  currentUser,
  orders,
  products,
  onUpdateOrderStatus,
  onUpdateProductPrice,
  onUpdateProductStock,
  onRefreshData,
  onNavigateToShop,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'inventory' | 'dispatch'>('orders');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'All' | OrderStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [refreshNotice, setRefreshNotice] = useState<string | null>(null);

  // Dynamically initialize stock map from live Supabase products
  const [productStockMap, setProductStockMap] = useState<Record<string, 'In Stock' | 'Low Stock' | 'Out of Stock'>>({});

  useEffect(() => {
    if (products.length > 0) {
      const initialStock: Record<string, 'In Stock' | 'Low Stock' | 'Out of Stock'> = {};
      products.forEach((p) => {
        initialStock[p.id] = ((p as any).stock_status as any) || 'In Stock';
      });
      setProductStockMap(initialStock);
    }
  }, [products]);

  // Calculate Quick Stats
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);
  const pendingOrders = orders.filter((o) => o.status === 'Pending').length;
  const processingOrders = orders.filter((o) => o.status === 'Processing').length;
  const inStockCount = Object.values(productStockMap).filter((s) => s === 'In Stock').length;

  // Calculate total jars pending packaging across pending/processing orders
  const pendingJars = orders
    .filter((o) => o.status === 'Pending' || o.status === 'Processing')
    .reduce((sum, o) => {
      if (!o.items || !Array.isArray(o.items)) return sum;
      return sum + o.items.reduce((iSum, item) => iSum + (item.quantity || 1), 0);
    }, 0);

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = orderStatusFilter === 'All' || order.status === orderStatusFilter;
    const matchesSearch =
      searchQuery === '' ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStockToggle = (productId: string) => {
    const current = productStockMap[productId] || 'In Stock';
    const nextState = current === 'In Stock' ? 'Low Stock' : current === 'Low Stock' ? 'Out of Stock' : 'In Stock';
    setProductStockMap((prev) => ({
      ...prev,
      [productId]: nextState,
    }));
    if (onUpdateProductStock) {
      onUpdateProductStock(productId, nextState);
    }
  };

  const handleSavePrice = (productId: string) => {
    if (tempPrice > 0 && onUpdateProductPrice) {
      onUpdateProductPrice(productId, tempPrice);
    }
    setEditingPriceId(null);
  };

  const handleTriggerRefresh = async () => {
    if (!onRefreshData) return;
    setRefreshLoading(true);
    setRefreshNotice(null);
    try {
      const res = await onRefreshData();
      setRefreshNotice(res.message);
      setTimeout(() => setRefreshNotice(null), 4000);
    } catch (err: any) {
      setRefreshNotice(`Sync error: ${err.message}`);
    } finally {
      setRefreshLoading(false);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-[#805200]/15 text-[#805200] border-[#805200]/30';
      case 'Processing':
        return 'bg-[#9f3c16]/15 text-[#9f3c16] border-[#9f3c16]/30';
      case 'Completed':
        return 'bg-[#516444]/15 text-[#516444] border-[#516444]/30';
      case 'Cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  return (
    <div className="w-full bg-[#fbf2ee] min-h-screen py-6 sm:py-10">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-7 shadow-sm border border-[#efe6e3] mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9f3c16]/10 text-[#9f3c16] text-[11px] font-semibold tracking-wider uppercase font-sans">
                  <span className="material-symbols-outlined text-[16px]">admin_panel_settings</span>
                  <span>Store Owner &amp; Kitchen Management</span>
                </div>

                <div
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    isSupabaseConfigured
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  <span>{isSupabaseConfigured ? 'Supabase Live Connected' : 'Supabase Demo/Local Mode'}</span>
                </div>
              </div>

              <h1 className="font-serif text-[26px] sm:text-[34px] text-[#1e1b19] font-normal tracking-tight leading-tight">
                Welcome {currentUser.name.startsWith('Chef') ? currentUser.name : `Chef ${currentUser.name}`}
              </h1>
              <p className="text-[14px] text-[#57423b] mt-1">
                Live Kitchen Studio • Banswara, Rajasthan • Real-time Supabase Database Sync for Orders &amp; Inventory.
              </p>
            </div>

            {/* Quick Action Navigation */}
            <div className="flex flex-wrap items-center gap-2.5">
              {onRefreshData && (
                <button
                  onClick={handleTriggerRefresh}
                  disabled={refreshLoading}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#516444] hover:bg-[#435338] text-white text-[13px] font-semibold transition-all cursor-pointer shadow-sm active:scale-95 disabled:opacity-60"
                  title="Synchronize fresh orders and product stock from Supabase database"
                >
                  <span className={`material-symbols-outlined text-[18px] ${refreshLoading ? 'animate-spin' : ''}`}>
                    sync
                  </span>
                  <span>{refreshLoading ? 'Syncing...' : 'Sync Supabase'}</span>
                </button>
              )}

              <button
                onClick={onNavigateToShop}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#9f3c16] hover:bg-[#bf542c] text-white text-[13px] font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">storefront</span>
                <span>View Storefront</span>
              </button>
            </div>
          </div>

          {refreshNotice && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[12px] flex items-center gap-2 animate-fadeIn">
              <span className="material-symbols-outlined text-[18px]">check_circle</span>
              <span>{refreshNotice}</span>
            </div>
          )}
        </div>


        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 mb-6 sm:mb-8">
          {/* Card 1: Total Orders */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#efe6e3] shadow-xs">
            <div className="flex items-center justify-between text-[#8a726a] mb-2">
              <span className="text-[12px] font-semibold uppercase tracking-wider font-sans">
                Total Orders
              </span>
              <span className="w-8 h-8 rounded-lg bg-[#9f3c16]/10 text-[#9f3c16] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">receipt_long</span>
              </span>
            </div>
            <div className="font-serif text-[26px] sm:text-[32px] font-normal text-[#1e1b19] tabular-nums">
              {totalOrders}
            </div>
            <div className="text-[11px] sm:text-[12px] text-[#516444] font-medium mt-1">
              {totalOrders === 0 ? 'No active orders' : `${pendingOrders + processingOrders} active in kitchen`}
            </div>
          </div>

          {/* Card 2: Total Revenue */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#efe6e3] shadow-xs">
            <div className="flex items-center justify-between text-[#8a726a] mb-2">
              <span className="text-[12px] font-semibold uppercase tracking-wider font-sans">
                Total Revenue
              </span>
              <span className="w-8 h-8 rounded-lg bg-[#516444]/15 text-[#516444] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">payments</span>
              </span>
            </div>
            <div className="font-serif text-[26px] sm:text-[32px] font-normal text-[#1e1b19] tabular-nums">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] sm:text-[12px] text-[#516444] font-medium mt-1">
              {totalOrders === 0 ? 'Awaiting live orders' : `₹${(totalRevenue / totalOrders).toFixed(0)} avg order value`}
            </div>
          </div>

          {/* Card 3: Active Products */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#efe6e3] shadow-xs">
            <div className="flex items-center justify-between text-[#8a726a] mb-2">
              <span className="text-[12px] font-semibold uppercase tracking-wider font-sans">
                Active Catalog
              </span>
              <span className="w-8 h-8 rounded-lg bg-[#805200]/15 text-[#805200] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">inventory_2</span>
              </span>
            </div>
            <div className="font-serif text-[26px] sm:text-[32px] font-normal text-[#1e1b19] tabular-nums">
              {inStockCount} / {products.length}
            </div>
            <div className="text-[11px] sm:text-[12px] text-[#805200] font-medium mt-1">
              Hand-bottled in Banswara
            </div>
          </div>

          {/* Card 4: Next Courier Dispatch */}
          <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#efe6e3] shadow-xs">
            <div className="flex items-center justify-between text-[#8a726a] mb-2">
              <span className="text-[12px] font-semibold uppercase tracking-wider font-sans">
                Pending Packaging
              </span>
              <span className="w-8 h-8 rounded-lg bg-[#516444]/15 text-[#516444] flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">local_shipping</span>
              </span>
            </div>
            <div className="font-serif text-[26px] sm:text-[32px] font-normal text-[#1e1b19] tabular-nums">
              {pendingJars} Jars
            </div>
            <div className="text-[11px] sm:text-[12px] text-[#9f3c16] font-medium mt-1">
              {pendingJars === 0 ? 'Queue clear' : 'Next air courier: Tuesday'}
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-[#efe6e3] pb-2 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-[#9f3c16] text-white shadow-xs'
                : 'bg-white text-[#57423b] hover:bg-[#f5ece9] border border-[#efe6e3]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">receipt_long</span>
            <span>Incoming Customer Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-[#9f3c16] text-white shadow-xs'
                : 'bg-white text-[#57423b] hover:bg-[#f5ece9] border border-[#efe6e3]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">inventory</span>
            <span>Product &amp; Inventory Management</span>
          </button>

          <button
            onClick={() => setActiveTab('dispatch')}
            className={`px-4 py-2.5 rounded-xl text-[14px] font-semibold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'dispatch'
                ? 'bg-[#9f3c16] text-white shadow-xs'
                : 'bg-white text-[#57423b] hover:bg-[#f5ece9] border border-[#efe6e3]'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">local_shipping</span>
            <span>Courier Logistics Schedule</span>
          </button>
        </div>

        {/* TAB 1: INCOMING ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {/* Search and Status Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-[#efe6e3] flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a726a] text-[20px]">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search order ID, customer name, or city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#fbf2ee] rounded-xl text-[13px] text-[#1e1b19] placeholder:text-[#8a726a] border border-[#efe6e3] focus:border-[#9f3c16] focus:bg-white focus:outline-none transition-colors"
                />
              </div>

              {/* Status Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {(['All', 'Pending', 'Processing', 'Completed', 'Cancelled'] as const).map((status) => (
                  <button
                    key={status}
                    onClick={() => setOrderStatusFilter(status)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      orderStatusFilter === status
                        ? 'bg-[#1e1b19] text-white'
                        : 'bg-[#f5ece9] text-[#57423b] hover:bg-[#efe6e3]'
                    }`}
                  >
                    {status}
                    {status !== 'All' && (
                      <span className="ml-1 opacity-75 font-normal">
                        ({orders.filter((o) => o.status === status).length})
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List / Cards */}
            {orders.length === 0 ? (
              <div className="bg-white p-10 sm:p-14 rounded-2xl border border-[#efe6e3] text-center shadow-xs">
                <div className="w-14 h-14 rounded-2xl bg-[#9f3c16]/10 text-[#9f3c16] flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-[28px]">inbox</span>
                </div>
                <h3 className="font-serif text-[22px] text-[#1e1b19] font-medium">No Incoming Orders</h3>
                <p className="text-[13px] text-[#57423b] mt-1.5 max-w-md mx-auto leading-relaxed">
                  Your kitchen order queue is completely clear and fresh. When customer orders are placed in the storefront, they will stream in here automatically via Supabase Realtime.
                </p>
                <div className="mt-5">
                  <button
                    onClick={onNavigateToShop}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9f3c16] hover:bg-[#853212] text-white text-[13px] font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">storefront</span>
                    <span>Browse Customer Storefront</span>
                  </button>
                </div>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-[#efe6e3] text-center">
                <span className="material-symbols-outlined text-[42px] text-[#8a726a] mb-2">
                  search_off
                </span>
                <h3 className="font-serif text-[20px] text-[#1e1b19]">No Orders Found</h3>
                <p className="text-[13px] text-[#57423b] mt-1">
                  No orders match the current status or search query.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-[#efe6e3] p-5 sm:p-6 shadow-xs hover:shadow-md transition-shadow"
                  >
                    {/* Order Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#efe6e3]">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono font-bold text-[15px] sm:text-[16px] text-[#1e1b19]">
                          {order.id}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                        <span className="text-[12px] text-[#8a726a] font-sans">
                          • {order.date}
                        </span>
                      </div>

                      {/* Interactive Status Changer */}
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] text-[#57423b] font-medium hidden sm:inline">
                          Change Status:
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className="bg-[#fbf2ee] border border-[#efe6e3] text-[#1e1b19] text-[12px] font-semibold px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-[#9f3c16] cursor-pointer"
                        >
                          <option value="Pending">⏳ Pending Packing</option>
                          <option value="Processing">🍳 Simmering / Bottling</option>
                          <option value="Completed">✅ Dispatched / Delivered</option>
                          <option value="Cancelled">❌ Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer & Destination Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-[13px] border-b border-[#f5ece9]">
                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8a726a] block mb-1">
                          Customer
                        </span>
                        <div className="font-medium text-[#1e1b19]">{order.customerName}</div>
                        <div className="text-[12px] text-[#57423b]">{order.customerEmail}</div>
                        <div className="text-[12px] text-[#57423b]">{order.customerPhone}</div>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8a726a] block mb-1">
                          Delivery Destination
                        </span>
                        <div className="text-[#57423b]">{order.shippingAddress}</div>
                        <div className="font-medium text-[#1e1b19]">
                          {order.city} - {order.pincode}
                        </div>
                      </div>

                      <div>
                        <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8a726a] block mb-1">
                          Payment &amp; Total
                        </span>
                        <div className="font-medium text-[#1e1b19]">
                          Payment: {order.paymentMethod}
                        </div>
                        <div className="font-serif text-[20px] text-[#9f3c16] font-semibold mt-0.5">
                          ₹{order.total}
                        </div>
                      </div>
                    </div>

                    {/* Items Ordered List */}
                    <div className="pt-3">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8a726a] block mb-2">
                        Pantry Jars in This Order
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {order.items.map((item, i) => (
                          <div
                            key={i}
                            className="bg-[#fbf2ee] px-3 py-1.5 rounded-xl border border-[#efe6e3] text-[12px] text-[#1e1b19] flex items-center gap-2"
                          >
                            <span className="font-bold text-[#9f3c16]">{item.quantity}x</span>
                            <span>{item.productName}</span>
                            <span className="text-[#8a726a] text-[11px]">({item.jarSize})</span>
                            <span className="text-[#57423b] font-medium">₹{item.unitPrice * item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {order.notes && (
                        <div className="mt-2 text-[12px] text-[#805200] bg-[#805200]/10 p-2 rounded-lg flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">info</span>
                          <span>Note: {order.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCT & INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="bg-white rounded-2xl border border-[#efe6e3] p-5 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#efe6e3]">
              <div>
                <h3 className="font-serif text-[22px] text-[#1e1b19] font-normal">
                  Pantry Product Catalog &amp; Live Stock Status
                </h3>
                <p className="text-[13px] text-[#57423b] mt-0.5">
                  Update inventory availability and pricing. Changes reflect live on the customer storefront.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs text-[#516444] font-semibold bg-[#516444]/10 px-3 py-1.5 rounded-xl">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>Batch #48 Open</span>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[13px]">
                <thead>
                  <tr className="border-b border-[#efe6e3] text-[#8a726a] text-[11px] uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Pantry Item</th>
                    <th className="pb-3 font-semibold">Category</th>
                    <th className="pb-3 font-semibold">Shelf Life</th>
                    <th className="pb-3 font-semibold">Price (₹)</th>
                    <th className="pb-3 font-semibold">Stock Status</th>
                    <th className="pb-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f5ece9]">
                  {products.map((product) => {
                    const stock = productStockMap[product.id] || 'In Stock';
                    const isEditing = editingPriceId === product.id;

                    return (
                      <tr key={product.id} className="hover:bg-[#fff8f5] transition-colors">
                        <td className="py-3.5 pr-4 flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-11 h-11 object-cover rounded-xl bg-[#f5ece9] border border-[#efe6e3] shrink-0"
                          />
                          <div>
                            <div className="font-medium text-[#1e1b19] leading-tight">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-[#8a726a]">{product.subtitle}</div>
                          </div>
                        </td>

                        <td className="py-3.5 pr-4 text-[#57423b] capitalize">
                          {product.category}
                        </td>

                        <td className="py-3.5 pr-4 text-[#57423b]">
                          {product.shelfLife}
                        </td>

                        {/* Price Column */}
                        <td className="py-3.5 pr-4">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                className="w-20 px-2 py-1 bg-[#fbf2ee] rounded border border-[#9f3c16] text-[13px] text-[#1e1b19] outline-none"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(parseInt(e.target.value) || 0)}
                              />
                              <button
                                onClick={() => handleSavePrice(product.id)}
                                className="p-1 bg-[#516444] text-white rounded hover:bg-[#435338]"
                                title="Save price"
                              >
                                <span className="material-symbols-outlined text-[16px]">check</span>
                              </button>
                            </div>
                          ) : (
                            <span className="font-serif text-[16px] text-[#1e1b19] font-medium">
                              ₹{product.price}
                            </span>
                          )}
                        </td>

                        {/* Stock Status Column */}
                        <td className="py-3.5 pr-4">
                          <button
                            onClick={() => handleStockToggle(product.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition-all cursor-pointer ${
                              stock === 'In Stock'
                                ? 'bg-[#516444]/15 text-[#516444] border-[#516444]/30'
                                : stock === 'Low Stock'
                                ? 'bg-[#805200]/15 text-[#805200] border-[#805200]/30'
                                : 'bg-red-100 text-red-800 border-red-200'
                            }`}
                            title="Click to toggle stock status"
                          >
                            {stock}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => {
                              if (isEditing) {
                                setEditingPriceId(null);
                              } else {
                                setEditingPriceId(product.id);
                                setTempPrice(product.price);
                              }
                            }}
                            className="text-[12px] text-[#9f3c16] font-semibold hover:underline cursor-pointer"
                          >
                            {isEditing ? 'Cancel' : 'Edit Price'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DISPATCH & COURIER LOGISTICS */}
        {activeTab === 'dispatch' && (
          <div className="bg-white rounded-2xl border border-[#efe6e3] p-5 sm:p-7 shadow-xs">
            <h3 className="font-serif text-[22px] text-[#1e1b19] font-normal mb-1">
              Banswara Kitchen Air Courier Logistics
            </h3>
            <p className="text-[13px] text-[#57423b] mb-6">
              Our weekly shipping cycle operates every Tuesday and Friday to guarantee weekend freshness for metro hubs.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-[#fbf2ee] rounded-xl border border-[#efe6e3] space-y-3">
                <div className="font-semibold text-[#1e1b19] text-[15px] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#9f3c16]">verified</span>
                  <span>Packaging Checklist</span>
                </div>
                <ul className="text-[13px] text-[#57423b] space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-[#516444]">✓</span>
                    <span>Aero-bubble sleeve around each individual glass jar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#516444]">✓</span>
                    <span>Hand-tied Kraft batch seal with expiry stamp</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#516444]">✓</span>
                    <span>Cold-pack inserted for fresh curd dips (Smokey Tandoori, Mint Dip)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#516444]">✓</span>
                    <span>Heavy-duty corrugated master box with "Fragile Glass" label</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-[#fbf2ee] rounded-xl border border-[#efe6e3] space-y-3">
                <div className="font-semibold text-[#1e1b19] text-[15px] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#516444]">local_shipping</span>
                  <span>Courier Partner Hubs</span>
                </div>
                <ul className="text-[13px] text-[#57423b] space-y-2">
                  <li>
                    <strong>Delhivery Air Express:</strong> Pick up scheduled Tuesday 2:00 PM
                  </li>
                  <li>
                    <strong>BlueDart Surface:</strong> Pick up scheduled Friday 11:00 AM
                  </li>
                  <li>
                    <strong>Banswara Local Delivery:</strong> Same-day doorstep bike dispatch
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
