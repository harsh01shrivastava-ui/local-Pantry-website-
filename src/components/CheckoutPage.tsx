import React, { useState, useEffect } from 'react';
import { CartItem } from '../types';
import { CustomerOrder, UserProfile } from '../types/auth';

interface CheckoutPageProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, jarSize: string, delta: number) => void;
  onRemoveItem: (productId: string, jarSize: string) => void;
  onClearCart: () => void;
  onBackToShop: () => void;
  onOrderCreated?: (order: CustomerOrder) => void;
  currentUser?: UserProfile | null;
  onNavigateToOwnerDashboard?: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onBackToShop,
  onOrderCreated,
  currentUser,
  onNavigateToOwnerDashboard,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedCodeName, setAppliedCodeName] = useState<string>('');
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer & Shipping state
  const [customerInfo, setCustomerInfo] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    address: currentUser?.address || '',
    pincode: '327001',
    city: currentUser?.city || 'Banswara',
    state: 'Rajasthan',
    paymentMethod: 'UPI' as 'UPI' | 'COD' | 'Card',
    upiId: '',
  });

  const [orderPlaced, setOrderPlaced] = useState<{
    id: string;
    total: number;
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    items: {
      productId: string;
      productName: string;
      quantity: number;
      jarSize: string;
      unitPrice: number;
    }[];
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: string;
    city: string;
    pincode: string;
    paymentMethod: string;
    notes?: string;
  } | null>(null);

  useEffect(() => {
    if (currentUser) {
      setCustomerInfo((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        phone: currentUser.phone || prev.phone,
        email: currentUser.email || prev.email,
        address: currentUser.address || prev.address,
        city: currentUser.city || prev.city,
      }));
    }
  }, [currentUser]);

  // Calculations
  const subtotal = items.reduce((sum, item) => {
    const unitPrice =
      item.jarSize === 'Standard'
        ? item.product.price
        : Math.round(item.product.price * 1.75);
    return sum + unitPrice * item.quantity;
  }, 0);

  const freeShippingThreshold = 999;
  const isFreeShipping = subtotal >= freeShippingThreshold || appliedDiscount === 9999;
  const shippingFee = subtotal === 0 || isFreeShipping ? 0 : 99;
  const discountAmount =
    appliedDiscount === 9999
      ? 0
      : appliedDiscount > 0
      ? Math.round(subtotal * (appliedDiscount / 100))
      : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);
  const totalItemCount = items.reduce((acc, i) => acc + i.quantity, 0);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();

    if (!code) return;

    if (code === 'BANSWARA10') {
      setAppliedDiscount(10);
      setAppliedCodeName('BANSWARA10');
      setPromoSuccess('10% artisanal batch discount applied successfully!');
    } else if (code === 'FREESHIP') {
      setAppliedDiscount(9999);
      setAppliedCodeName('FREESHIP');
      setPromoSuccess('Free express thermal shipping applied!');
    } else {
      setPromoError('Invalid coupon code. Try "BANSWARA10" for 10% off or "FREESHIP".');
    }
  };

  const handleRemovePromo = () => {
    setAppliedDiscount(0);
    setAppliedCodeName('');
    setPromoCode('');
    setPromoSuccess('');
    setPromoError('');
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderId = `LP-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderItems = items.map((i) => ({
        productId: i.product.id,
        productName: i.product.name,
        quantity: i.quantity,
        jarSize: i.jarSize,
        unitPrice:
          i.jarSize === 'Standard'
            ? i.product.price
            : Math.round(i.product.price * 1.75),
      }));

      const finalOrder: CustomerOrder = {
        id: orderId,
        customerName: customerInfo.name.trim(),
        customerEmail: customerInfo.email.trim(),
        customerPhone: customerInfo.phone.trim(),
        shippingAddress: customerInfo.address.trim(),
        city: customerInfo.city.trim(),
        pincode: customerInfo.pincode.trim(),
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        items: orderItems,
        subtotal,
        shippingFee,
        total: grandTotal,
        paymentMethod: customerInfo.paymentMethod,
        status: 'Pending',
        notes: isGift && giftNote ? `Gift order: ${giftNote}` : undefined,
      };

      setOrderPlaced({
        id: orderId,
        total: grandTotal,
        subtotal,
        shippingFee,
        discountAmount,
        items: orderItems,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        shippingAddress: customerInfo.address,
        city: customerInfo.city,
        pincode: customerInfo.pincode,
        paymentMethod: customerInfo.paymentMethod,
        notes: isGift && giftNote ? giftNote : undefined,
      });

      if (onOrderCreated) {
        await onOrderCreated(finalOrder);
      }

      onClearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ORDER CONFIRMED VIEW
  if (orderPlaced) {
    return (
      <div className="w-full bg-[#fbf2ee] min-h-screen py-10 sm:py-16">
        <div className="max-w-[860px] mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#efe6e3] shadow-md text-center">
            {/* Top Confirmed Icon */}
            <div className="w-20 h-20 rounded-2xl bg-[#516444]/15 text-[#516444] flex items-center justify-center mx-auto mb-5 shadow-sm">
              <span className="material-symbols-outlined text-[44px]">verified</span>
            </div>

            <span className="text-[11px] font-bold tracking-widest uppercase text-[#9f3c16] font-sans">
              Hand-Bottled in Banswara • Order Received
            </span>
            <h1 className="font-serif text-[30px] sm:text-[38px] text-[#1e1b19] font-normal mt-1 mb-2">
              Thank You, {orderPlaced.customerName}!
            </h1>
            <p className="text-[14px] sm:text-[15px] text-[#57423b] max-w-lg mx-auto leading-relaxed">
              Your small-batch order has been queued directly in our kitchen studio. We hand-seal each jar in fragile glass packaging before handing off to our air courier.
            </p>

            {/* Order Reference Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#fbf2ee] border border-[#efe6e3] text-[13px] font-mono font-bold text-[#1e1b19] my-6">
              <span>Order Reference:</span>
              <span className="text-[#9f3c16]">{orderPlaced.id}</span>
            </div>

            {/* Receipt Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left my-6 text-[13px]">
              <div className="p-5 rounded-2xl bg-[#fbf2ee] border border-[#efe6e3] space-y-2.5">
                <div className="text-[11px] uppercase tracking-wider font-bold text-[#8a726a] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                  <span>Courier &amp; Delivery Destination</span>
                </div>
                <div className="font-semibold text-[#1e1b19] text-[14px]">{orderPlaced.customerName}</div>
                <div className="text-[#57423b]">{orderPlaced.shippingAddress}</div>
                <div className="text-[#57423b] font-medium">{orderPlaced.city} - {orderPlaced.pincode}</div>
                <div className="text-[12px] text-[#8a726a]">Phone: {orderPlaced.customerPhone}</div>
                <div className="text-[12px] text-[#8a726a]">Email: {orderPlaced.customerEmail}</div>
              </div>

              <div className="p-5 rounded-2xl bg-[#fbf2ee] border border-[#efe6e3] space-y-2.5">
                <div className="text-[11px] uppercase tracking-wider font-bold text-[#8a726a] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                  <span>Payment &amp; Billing Details</span>
                </div>
                <div className="flex justify-between items-center text-[#57423b]">
                  <span>Payment Mode:</span>
                  <strong className="text-[#1e1b19]">{orderPlaced.paymentMethod}</strong>
                </div>
                <div className="flex justify-between items-center text-[#57423b]">
                  <span>Subtotal:</span>
                  <span className="tabular-nums font-medium text-[#1e1b19]">₹{orderPlaced.subtotal}</span>
                </div>
                {orderPlaced.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-[#516444]">
                    <span>Artisanal Discount:</span>
                    <span className="tabular-nums font-medium">-₹{orderPlaced.discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-[#57423b]">
                  <span>Air Courier Fragile Packaging:</span>
                  <span className="tabular-nums font-medium">
                    {orderPlaced.shippingFee === 0 ? 'FREE' : `₹${orderPlaced.shippingFee}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#dec0b7]/40 flex justify-between items-baseline font-bold">
                  <span className="text-[#1e1b19]">Total Billed:</span>
                  <span className="font-serif text-[22px] text-[#9f3c16] tabular-nums">
                    ₹{orderPlaced.total}
                  </span>
                </div>
              </div>
            </div>

            {/* Jars in Order */}
            <div className="p-5 rounded-2xl bg-[#fff8f5] border border-[#efe6e3] text-left mb-6">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8a726a] block mb-3 font-sans">
                Hand-Bottled Jars Ordered
              </span>
              <div className="flex flex-wrap gap-2.5">
                {orderPlaced.items.map((it, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#efe6e3] text-[13px] text-[#1e1b19] shadow-2xs"
                  >
                    <span className="font-bold text-[#9f3c16]">{it.quantity}x</span>
                    <span className="font-medium">{it.productName}</span>
                    <span className="text-[11px] text-[#8a726a]">({it.jarSize})</span>
                    <span className="font-serif font-semibold text-[#57423b]">₹{it.unitPrice * it.quantity}</span>
                  </div>
                ))}
              </div>

              {orderPlaced.notes && (
                <div className="mt-3 p-3 rounded-xl bg-[#805200]/10 text-[#805200] text-[12px] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">featured_seasonal_and_gifts</span>
                  <span>Gift Note: "{orderPlaced.notes}"</span>
                </div>
              )}
            </div>

            {/* Courier Dispatch Timeline Card */}
            <div className="p-4 rounded-xl bg-[#516444]/10 text-[#516444] text-[12px] flex items-center justify-center gap-2 mb-8 font-medium">
              <span className="material-symbols-outlined text-[18px]">calendar_clock</span>
              <span>Kitchen Air Courier Dispatches: Tuesdays &amp; Fridays • Tracking details will be emailed.</span>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setOrderPlaced(null);
                  onBackToShop();
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#9f3c16] hover:bg-[#bf542c] text-white text-[13px] font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
              >
                Continue Exploring Provisions
              </button>

              {currentUser?.role === 'owner' && onNavigateToOwnerDashboard && (
                <button
                  onClick={() => {
                    setOrderPlaced(null);
                    onNavigateToOwnerDashboard();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#516444] hover:bg-[#435338] text-white text-[13px] font-semibold transition-all cursor-pointer shadow-sm active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[17px]">admin_panel_settings</span>
                  <span>View in Owner Dashboard</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // EMPTY BAG VIEW
  if (items.length === 0) {
    return (
      <div className="w-full bg-[#fbf2ee] min-h-screen py-12 sm:py-20">
        <div className="max-w-[720px] mx-auto px-4 text-center">
          <div className="bg-white rounded-3xl p-8 sm:p-14 border border-[#efe6e3] shadow-sm">
            <div className="w-20 h-20 rounded-3xl bg-[#f5ece9] text-[#9f3c16] flex items-center justify-center mx-auto mb-5 shadow-xs">
              <span className="material-symbols-outlined text-[44px]">shopping_bag</span>
            </div>

            <span className="text-[11px] font-bold uppercase tracking-widest text-[#8a726a] font-sans">
              Pantry Bag is Empty
            </span>
            <h2 className="font-serif text-[28px] sm:text-[34px] text-[#1e1b19] font-normal mt-1 mb-3">
              Your Kitchen Basket is Waiting
            </h2>
            <p className="text-[14px] sm:text-[15px] text-[#57423b] max-w-md mx-auto mb-8 leading-relaxed font-sans">
              Discover our small-batch crunchy Sichuan chili oil, freshly pounded basil pestos, slow-simmered pizza sauces, and traditional Banswara treats.
            </p>

            <button
              onClick={onBackToShop}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#9f3c16] hover:bg-[#bf542c] text-white text-[14px] font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">storefront</span>
              <span>Explore Small-Batch Provisions</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // DEDICATED FULL-PAGE CHECKOUT VIEW
  return (
    <div className="w-full bg-[#fbf2ee] min-h-screen py-6 sm:py-10">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 sm:mb-8">
          <button
            onClick={onBackToShop}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#57423b] hover:text-[#9f3c16] transition-colors cursor-pointer group"
          >
            <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
              arrow_back
            </span>
            <span>Return to Pantry Shop</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#efe6e3] text-[11px] font-semibold text-[#516444] shadow-2xs font-sans">
            <span className="w-2 h-2 rounded-full bg-[#516444] animate-pulse" />
            <span>Air Express Courier Available • Rajasthan &amp; Pan-India Metro Delivery</span>
          </div>
        </div>

        {/* Page Title & Highlights Banner */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9f3c16] font-sans">
              Small-Batch Provisions Checkout
            </span>
            <span className="text-[#8a726a]">•</span>
            <span className="text-[11px] font-semibold text-[#57423b]">
              {totalItemCount} {totalItemCount === 1 ? 'Hand-Bottled Jar' : 'Hand-Bottled Jars'}
            </span>
          </div>
          <h1 className="font-serif text-[28px] sm:text-[36px] text-[#1e1b19] font-normal tracking-tight">
            Review Your Pantry Bag &amp; Kitchen Dispatch
          </h1>
          <p className="text-[14px] text-[#57423b] mt-1">
            Carefully hand-packaged with 100% biodegradable honeycombed protection and sealed in food-grade glass.
          </p>
        </div>

        {/* 2-Column Full-Screen Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* LEFT COLUMN: PANTRY BAG ITEMS (Col 7) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Free Shipping Meter */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#efe6e3] shadow-xs">
              {isFreeShipping ? (
                <div className="flex items-center gap-2 text-[#516444] font-semibold text-[13px]">
                  <span className="material-symbols-outlined text-[22px]">local_shipping</span>
                  <span>🎉 You've unlocked Free Air Express Courier across India!</span>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-[#57423b] text-[12px] font-semibold mb-2">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[#9f3c16] text-[18px]">local_shipping</span>
                      <span>Add <strong>₹{freeShippingThreshold - subtotal}</strong> more for Free Shipping</span>
                    </span>
                    <span className="text-[#9f3c16] font-bold">{Math.round((subtotal / freeShippingThreshold) * 100)}%</span>
                  </div>
                  <div className="w-full bg-[#fbf2ee] h-2.5 rounded-full overflow-hidden border border-[#efe6e3]">
                    <div
                      className="bg-[#9f3c16] h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Bag Items Card */}
            <div className="bg-white rounded-2xl border border-[#efe6e3] shadow-xs overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-[#efe6e3] flex items-center justify-between bg-[#fff8f5]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#9f3c16] text-[20px]">
                    inventory_2
                  </span>
                  <h2 className="font-serif text-[18px] sm:text-[20px] font-medium text-[#1e1b19]">
                    1. Pantry Bag Contents ({totalItemCount})
                  </h2>
                </div>

                <button
                  onClick={onClearCart}
                  className="text-[12px] font-semibold text-[#ba1a1a] hover:underline cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#f5ece9] p-4 sm:p-5 space-y-4">
                {items.map((item) => {
                  const unitPrice =
                    item.jarSize === 'Standard'
                      ? item.product.price
                      : Math.round(item.product.price * 1.75);
                  const lineTotal = unitPrice * item.quantity;

                  return (
                    <div
                      key={`${item.product.id}-${item.jarSize}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 first:pt-0"
                    >
                      <div className="flex items-center gap-3.5">
                        {item.product.imageUrl ? (
                          <img
                            src={item.product.imageUrl}
                            alt={item.product.name}
                            className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover bg-[#f5ece9] border border-[#efe6e3] shrink-0"
                          />
                        ) : (
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-[#f6eee8] border border-[#ddcec7] shrink-0 flex items-center justify-center text-[#8e7b72]">
                            <span className="material-symbols-outlined text-[24px]">image</span>
                          </div>
                        )}

                        <div className="min-w-0">
                          <h3 className="font-serif text-[16px] sm:text-[18px] text-[#1e1b19] font-medium leading-tight">
                            {item.product.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-[#57423b]">
                            <span className="px-2 py-0.5 rounded-md bg-[#fbf2ee] font-semibold text-[#9f3c16] border border-[#efe6e3]">
                              {item.jarSize}
                            </span>
                            <span>•</span>
                            <span className="tabular-nums font-semibold text-[#1e1b19]">
                              ₹{unitPrice} per jar
                            </span>
                            {item.product.shelfLife && (
                              <>
                                <span>•</span>
                                <span className="text-[#516444]">Fresh for {item.product.shelfLife}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Stepper & Line Price */}
                      <div className="flex items-center justify-between sm:justify-end gap-5 pl-20 sm:pl-0">
                        {/* Stepper */}
                        <div className="flex items-center border border-[#efe6e3] rounded-xl bg-[#fbf2ee] overflow-hidden">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.jarSize, -1)}
                            className="w-8 h-8 flex items-center justify-center text-[15px] font-bold text-[#1e1b19] hover:bg-white transition-colors cursor-pointer"
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-8 text-center text-[13px] font-bold tabular-nums text-[#1e1b19]">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.product.id, item.jarSize, 1)}
                            className="w-8 h-8 flex items-center justify-center text-[15px] font-bold text-[#1e1b19] hover:bg-white transition-colors cursor-pointer"
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        {/* Line Total */}
                        <div className="text-right min-w-[70px]">
                          <span className="font-serif text-[17px] font-semibold text-[#1e1b19] tabular-nums">
                            ₹{lineTotal}
                          </span>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.product.id, item.jarSize)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-[#ba1a1a] hover:bg-red-50 transition-colors cursor-pointer"
                          title="Remove from bag"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Gifting & Handwritten Note Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#efe6e3] shadow-xs">
              <label className="flex items-center gap-2.5 cursor-pointer font-semibold text-[#1e1b19] text-[13px]">
                <input
                  type="checkbox"
                  checked={isGift}
                  onChange={(e) => setIsGift(e.target.checked)}
                  className="w-4 h-4 accent-[#9f3c16] rounded cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#805200]">featured_seasonal_and_gifts</span>
                  <span>This is a culinary gift order (Include handwritten Kraft paper greeting)</span>
                </span>
              </label>

              {isGift && (
                <div className="mt-3.5 pt-3 border-t border-[#efe6e3]">
                  <label className="block text-[12px] font-medium text-[#57423b] mb-1.5">
                    Your Personal Message to the Recipient:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Wishing you flavorful breakfasts and warm kitchen memories! With love, Shreya"
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    className="w-full p-3 bg-[#fbf2ee] rounded-xl border border-[#efe6e3] text-[13px] text-[#1e1b19] placeholder:text-[#8a726a] outline-none focus:border-[#9f3c16] focus:bg-white transition-colors"
                  />
                  <p className="text-[11px] text-[#805200] mt-1 italic">
                    Chef Vikas will hand-inscribe this note on artisanal recycled parchment.
                  </p>
                </div>
              )}
            </div>

            {/* Coupon Code Card */}
            <div className="bg-white p-5 rounded-2xl border border-[#efe6e3] shadow-xs">
              <div className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1e1b19] mb-3">
                <span className="material-symbols-outlined text-[#9f3c16] text-[18px]">sell</span>
                <span>Small-Batch Voucher or Community Coupon</span>
              </div>

              {appliedCodeName ? (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[13px] text-emerald-800 font-semibold">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    <span>Coupon <strong>{appliedCodeName}</strong> applied!</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemovePromo}
                    className="text-[12px] font-semibold text-[#ba1a1a] hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code (try BANSWARA10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 p-2.5 rounded-xl border border-[#efe6e3] bg-[#fbf2ee] text-[13px] text-[#1e1b19] uppercase placeholder:normal-case placeholder:text-[#8a726a] outline-none focus:border-[#9f3c16] focus:bg-white transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-[#9f3c16] hover:bg-[#bf542c] text-white text-[13px] font-semibold rounded-xl transition-colors cursor-pointer shadow-2xs"
                    >
                      Apply
                    </button>
                  </div>
                  {promoSuccess && (
                    <p className="text-[11px] text-[#516444] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                      <span>{promoSuccess}</span>
                    </p>
                  )}
                  {promoError && (
                    <p className="text-[11px] text-[#ba1a1a] font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      <span>{promoError}</span>
                    </p>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: SHIPPING FORM, PAYMENT & ORDER SUMMARY (Col 5) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28">
            <form onSubmit={handleCompleteOrder} className="space-y-6">
              {/* Step 2: Shipping Details Card */}
              <div className="bg-white rounded-2xl border border-[#efe6e3] shadow-xs overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-[#efe6e3] bg-[#fff8f5] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#9f3c16] text-[20px]">
                    local_shipping
                  </span>
                  <h2 className="font-serif text-[18px] sm:text-[20px] font-medium text-[#1e1b19]">
                    2. Delivery &amp; Destination Info
                  </h2>
                </div>

                <div className="p-5 space-y-3.5 text-[13px]">
                  <div>
                    <label className="block text-[#57423b] font-semibold mb-1">Full Recipient Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Vikas Sharma"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#efe6e3] bg-[#fbf2ee] focus:bg-white focus:border-[#9f3c16] outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#57423b] font-semibold mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98200 12345"
                        value={customerInfo.phone}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-[#efe6e3] bg-[#fbf2ee] focus:bg-white focus:border-[#9f3c16] outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[#57423b] font-semibold mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="you@domain.com"
                        value={customerInfo.email}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-[#efe6e3] bg-[#fbf2ee] focus:bg-white focus:border-[#9f3c16] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#57423b] font-semibold mb-1">Door / Flat / Street Address</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="House No, Apartment or Landmark, Sector / Colony"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#efe6e3] bg-[#fbf2ee] focus:bg-white focus:border-[#9f3c16] outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#57423b] font-semibold mb-1">Postal Pincode</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="327001"
                        value={customerInfo.pincode}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, pincode: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-[#efe6e3] bg-[#fbf2ee] focus:bg-white focus:border-[#9f3c16] outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[#57423b] font-semibold mb-1">City</label>
                      <input
                        type="text"
                        required
                        placeholder="Banswara"
                        value={customerInfo.city}
                        onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-[#efe6e3] bg-[#fbf2ee] focus:bg-white focus:border-[#9f3c16] outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method Selection */}
              <div className="bg-white rounded-2xl border border-[#efe6e3] shadow-xs overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-[#efe6e3] bg-[#fff8f5] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#9f3c16] text-[20px]">
                    payments
                  </span>
                  <h2 className="font-serif text-[18px] sm:text-[20px] font-medium text-[#1e1b19]">
                    3. Select Payment Mode
                  </h2>
                </div>

                <div className="p-5 space-y-3">
                  {/* UPI Option */}
                  <label
                    onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'UPI' })}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      customerInfo.paymentMethod === 'UPI'
                        ? 'border-[#9f3c16] bg-[#fff8f5] ring-1 ring-[#9f3c16]'
                        : 'border-[#efe6e3] hover:bg-[#fbf2ee]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={customerInfo.paymentMethod === 'UPI'}
                      onChange={() => {}}
                      className="mt-1 accent-[#9f3c16]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[14px] text-[#1e1b19]">Instant UPI / QR</span>
                        <span className="text-[11px] font-bold text-[#516444] bg-[#516444]/15 px-2 py-0.5 rounded-md">
                          Fast &amp; 0% Fee
                        </span>
                      </div>
                      <p className="text-[12px] text-[#57423b] mt-0.5">
                        Google Pay, PhonePe, Paytm, CRED or any BHIM UPI app
                      </p>
                    </div>
                  </label>

                  {/* COD Option */}
                  <label
                    onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'COD' })}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      customerInfo.paymentMethod === 'COD'
                        ? 'border-[#9f3c16] bg-[#fff8f5] ring-1 ring-[#9f3c16]'
                        : 'border-[#efe6e3] hover:bg-[#fbf2ee]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={customerInfo.paymentMethod === 'COD'}
                      onChange={() => {}}
                      className="mt-1 accent-[#9f3c16]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[14px] text-[#1e1b19]">Cash on Delivery (COD)</span>
                        <span className="text-[11px] text-[#8a726a]">Pay at Doorstep</span>
                      </div>
                      <p className="text-[12px] text-[#57423b] mt-0.5">
                        Pay in cash or UPI to the courier agent upon arrival
                      </p>
                    </div>
                  </label>

                  {/* Card / NetBanking Option */}
                  <label
                    onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'Card' })}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      customerInfo.paymentMethod === 'Card'
                        ? 'border-[#9f3c16] bg-[#fff8f5] ring-1 ring-[#9f3c16]'
                        : 'border-[#efe6e3] hover:bg-[#fbf2ee]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={customerInfo.paymentMethod === 'Card'}
                      onChange={() => {}}
                      className="mt-1 accent-[#9f3c16]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[14px] text-[#1e1b19]">Cards &amp; NetBanking</span>
                        <span className="text-[11px] text-[#8a726a]">All Indian Banks</span>
                      </div>
                      <p className="text-[12px] text-[#57423b] mt-0.5">
                        Visa, MasterCard, RuPay, and NetBanking gateways
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Order Cost Summary & Final CTA */}
              <div className="bg-white p-5 rounded-2xl border border-[#efe6e3] shadow-md space-y-3">
                <h3 className="font-serif text-[18px] text-[#1e1b19] font-medium border-b border-[#efe6e3] pb-2">
                  Order Summary
                </h3>

                <div className="space-y-2 text-[13px]">
                  <div className="flex justify-between text-[#57423b]">
                    <span>Items Subtotal ({totalItemCount} jars)</span>
                    <span className="tabular-nums font-medium text-[#1e1b19]">₹{subtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#516444] font-medium">
                      <span>Artisanal Discount ({appliedDiscount === 9999 ? 'Free Shipping' : `${appliedDiscount}%`})</span>
                      <span className="tabular-nums">-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#57423b]">
                    <span>Thermal Courier Packaging &amp; Shipping</span>
                    <span className="tabular-nums">
                      {shippingFee === 0 ? (
                        <span className="text-[#516444] font-semibold">FREE</span>
                      ) : (
                        `₹${shippingFee}`
                      )}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-[#dec0b7]/40 flex justify-between items-baseline">
                    <div>
                      <span className="font-bold text-[15px] text-[#1e1b19] block">Total Amount</span>
                      <span className="text-[11px] text-[#8a726a]">Inclusive of all kitchen craft taxes</span>
                    </div>
                    <span className="font-serif text-[26px] font-bold text-[#9f3c16] tabular-nums">
                      ₹{grandTotal}
                    </span>
                  </div>
                </div>

                {/* Final Submit CTA */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-4 py-3.5 rounded-xl bg-[#9f3c16] hover:bg-[#bf542c] text-white font-semibold text-[14px] transition-all cursor-pointer shadow-md active:scale-98 flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <span className="material-symbols-outlined text-[19px]">lock</span>
                  <span>{isSubmitting ? 'Placing Order...' : `Confirm & Place Order • Pay ₹${grandTotal}`}</span>
                </button>

                <div className="pt-2 text-center text-[11px] text-[#8a726a] flex items-center justify-center gap-1.5">
                  <span className="material-symbols-outlined text-[14px] text-[#516444]">verified_user</span>
                  <span>Direct Kitchen Dispatch • Instant Supabase Realtime Sync</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

