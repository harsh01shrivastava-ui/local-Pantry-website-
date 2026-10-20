import React, { useState } from 'react';
import { CartItem } from '../types';
import { CustomerOrder } from '../types/auth';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, jarSize: string, delta: number) => void;
  onRemoveItem: (productId: string, jarSize: string) => void;
  onClearCart: () => void;
  onExplore: () => void;
  onOrderCreated?: (order: CustomerOrder) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onExplore,
  onOrderCreated,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [promoError, setPromoError] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState('');

  // Checkout form fields
  const [customerInfo, setCustomerInfo] = useState({
    name: 'Ananya Mehta',
    phone: '9820012345',
    email: 'ananya.mehta@example.com',
    address: 'Flat 402, Sea View Apartments, Bandra West',
    pincode: '400050',
    city: 'Mumbai',
    state: 'Maharashtra',
    paymentMethod: 'UPI' as 'UPI' | 'COD' | 'Card',
  });

  const [orderPlaced, setOrderPlaced] = useState<{
    id: string;
    total: number;
  } | null>(null);

  if (!isOpen) return null;

  // Calculate totals
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

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    setPromoSuccess('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'BANSWARA10') {
      setAppliedDiscount(10);
      setPromoSuccess('10% Small-Batch discount applied!');
    } else if (code === 'FREESHIP') {
      setAppliedDiscount(9999);
      setPromoSuccess('Free express shipping applied!');
    } else {
      setPromoError('Invalid coupon code. Try "BANSWARA10" for 10% off.');
    }
  };

  const handleCompleteOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const orderId = `LP-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderPlaced({
      id: orderId,
      total: grandTotal,
    });

    if (onOrderCreated) {
      onOrderCreated({
        id: orderId,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        customerPhone: customerInfo.phone,
        shippingAddress: customerInfo.address,
        city: customerInfo.city,
        pincode: customerInfo.pincode,
        date: 'Just now',
        items: items.map((i) => ({
          productId: i.product.id,
          productName: i.product.name,
          quantity: i.quantity,
          jarSize: i.jarSize,
          unitPrice: i.jarSize === 'Standard' ? i.product.price : Math.round(i.product.price * 1.75),
        })),
        subtotal,
        shippingFee,
        total: grandTotal,
        paymentMethod: customerInfo.paymentMethod,
        status: 'Pending',
        notes: isGift && giftNote ? `Gift note: ${giftNote}` : undefined,
      });
    }

    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-[#efe6e3] animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-[#efe6e3] flex items-center justify-between bg-[#fff8f5]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#9f3c16] text-[24px]">
              shopping_bag
            </span>
            <h2 className="font-serif text-[22px] font-semibold text-[#1e1b19]">
              {orderPlaced ? 'Order Confirmed' : 'Your Pantry Bag'}
            </h2>
            {!orderPlaced && (
              <span className="bg-[#f5ece9] text-[#57423b] text-xs font-bold px-2 py-0.5 rounded-full font-sans">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close cart"
            className="w-8 h-8 rounded-full hover:bg-[#efe6e3] text-[#57423b] flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* ORDER SUCCESS SCREEN */}
        {orderPlaced ? (
          <div className="p-6 flex-1 overflow-y-auto flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#516444]/15 text-[#516444] flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>
            <span className="text-xs uppercase font-bold text-[#9f3c16] tracking-widest font-sans">
              Handcrafted with Heart
            </span>
            <h3 className="font-serif text-[26px] text-[#1e1b19] font-normal mt-1 mb-2">
              Thank You, {customerInfo.name}!
            </h3>
            <p className="text-[13px] text-[#57423b] mb-4">
              Order <strong>#{orderPlaced.id}</strong> has been received by our Banswara family kitchen.
            </p>

            <div className="bg-[#fbf2ee] p-4 rounded-xl text-left w-full border border-[#efe6e3] mb-6 text-xs text-[#57423b] space-y-2">
              <div className="flex justify-between">
                <span>Shipping Destination:</span>
                <strong className="text-[#1e1b19]">{customerInfo.city}, {customerInfo.pincode}</strong>
              </div>
              <div className="flex justify-between">
                <span>Payment Mode:</span>
                <strong className="text-[#1e1b19]">{customerInfo.paymentMethod}</strong>
              </div>
              <div className="flex justify-between">
                <span>Total Billed:</span>
                <strong className="text-[#9f3c16] font-serif text-[15px]">₹{orderPlaced.total}</strong>
              </div>
              <div className="pt-2 border-t border-[#efe6e3] text-[11px] text-[#516444] flex items-center gap-1 font-medium">
                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                <span>Scheduled for next dispatch cycle with thermal fragile packaging!</span>
              </div>
            </div>

            <button
              onClick={() => {
                setOrderPlaced(null);
                setIsCheckingOut(false);
                onClose();
              }}
              className="w-full py-3 bg-[#9f3c16] hover:bg-[#bf542c] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              Back to Pantry Kitchen
            </button>
          </div>
        ) : isCheckingOut ? (
          /* CHECKOUT FORM VIEW */
          <div className="p-6 flex-1 overflow-y-auto">
            <button
              onClick={() => setIsCheckingOut(false)}
              className="text-xs font-semibold text-[#57423b] hover:text-[#9f3c16] flex items-center gap-1 mb-4"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              <span>Back to Bag Items</span>
            </button>

            <h3 className="font-serif text-[20px] text-[#1e1b19] font-medium mb-4">
              Direct Kitchen Dispatch Form
            </h3>

            <form onSubmit={handleCompleteOrder} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[#57423b] font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#efe6e3] focus:border-[#9f3c16] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#57423b] font-semibold mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#efe6e3] focus:border-[#9f3c16] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#57423b] font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#efe6e3] focus:border-[#9f3c16] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#57423b] font-semibold mb-1">Street Address</label>
                <textarea
                  required
                  rows={2}
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                  className="w-full p-2.5 rounded-lg border border-[#efe6e3] focus:border-[#9f3c16] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[#57423b] font-semibold mb-1">Postal Pincode</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={customerInfo.pincode}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, pincode: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#efe6e3] focus:border-[#9f3c16] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#57423b] font-semibold mb-1">City &amp; State</label>
                  <input
                    type="text"
                    required
                    value={`${customerInfo.city}, ${customerInfo.state}`}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, city: e.target.value })}
                    className="w-full p-2.5 rounded-lg border border-[#efe6e3] focus:border-[#9f3c16] outline-none"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="pt-2">
                <label className="block text-[#57423b] font-semibold mb-2">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'UPI' })}
                    className={`p-2.5 rounded-lg border text-center transition-colors font-medium flex flex-col items-center justify-center gap-1 ${
                      customerInfo.paymentMethod === 'UPI'
                        ? 'border-[#9f3c16] bg-[#fbf2ee] text-[#9f3c16]'
                        : 'border-[#efe6e3] text-[#57423b]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
                    <span>UPI / GPay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'COD' })}
                    className={`p-2.5 rounded-lg border text-center transition-colors font-medium flex flex-col items-center justify-center gap-1 ${
                      customerInfo.paymentMethod === 'COD'
                        ? 'border-[#9f3c16] bg-[#fbf2ee] text-[#9f3c16]'
                        : 'border-[#efe6e3] text-[#57423b]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    <span>Cash on Delivery</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'Card' })}
                    className={`p-2.5 rounded-lg border text-center transition-colors font-medium flex flex-col items-center justify-center gap-1 ${
                      customerInfo.paymentMethod === 'Card'
                        ? 'border-[#9f3c16] bg-[#fbf2ee] text-[#9f3c16]'
                        : 'border-[#efe6e3] text-[#57423b]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">credit_card</span>
                    <span>Cards / NetBanking</span>
                  </button>
                </div>
              </div>

              {/* Fragile Glass Packaging Note */}
              <div className="p-3 bg-[#516444]/10 rounded-lg text-[11px] text-[#516444] flex items-start gap-2">
                <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">
                  verified
                </span>
                <span>
                  Every jar is cushioned in 100% biodegradable honeycombed paper and sealed in food-grade safety glass.
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 bg-[#9f3c16] hover:bg-[#bf542c] text-white text-xs font-semibold rounded-lg transition-colors shadow-md mt-4 cursor-pointer"
              >
                Confirm Dispatch • Pay ₹{grandTotal}
              </button>
            </form>
          </div>
        ) : (
          /* CART ITEMS VIEW */
          <div className="flex-1 overflow-y-auto p-5 flex flex-col">
            {/* Free Shipping Meter */}
            <div className="bg-[#fbf2ee] p-3 rounded-xl border border-[#efe6e3] mb-4 text-xs font-sans">
              {isFreeShipping ? (
                <div className="flex items-center gap-1.5 text-[#516444] font-semibold">
                  <span className="material-symbols-outlined text-[18px]">local_shipping</span>
                  <span>🎉 You've unlocked Free Fragile Shipping across India!</span>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between text-[#57423b] mb-1.5">
                    <span>Add <strong>₹{freeShippingThreshold - subtotal}</strong> more for Free Shipping</span>
                    <span>{Math.round((subtotal / freeShippingThreshold) * 100)}%</span>
                  </div>
                  <div className="w-full bg-[#dec0b7]/40 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#9f3c16] h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Items List */}
            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                <span className="material-symbols-outlined text-[#dec0b7] text-[48px] mb-2">
                  shopping_bag
                </span>
                <h3 className="font-serif text-[20px] text-[#1e1b19] font-medium mb-1">
                  Your pantry bag is empty
                </h3>
                <p className="text-xs text-[#57423b] max-w-xs mb-5">
                  Explore our small-batch crunchy chili oils, fresh pestos, and traditional spice blends.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onExplore();
                  }}
                  className="py-2.5 px-5 bg-[#9f3c16] text-white text-xs font-semibold rounded-lg hover:bg-[#bf542c] transition-colors"
                >
                  Explore Provisions
                </button>
              </div>
            ) : (
              <div className="space-y-3.5 flex-1">
                {items.map((item) => {
                  const unitPrice =
                    item.jarSize === 'Standard'
                      ? item.product.price
                      : Math.round(item.product.price * 1.75);

                  return (
                    <div
                      key={`${item.product.id}-${item.jarSize}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white border border-[#efe6e3] shadow-sm"
                    >
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-16 h-16 rounded-lg object-cover bg-[#f5ece9] shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-[#f6eee8] border border-[#ddcec7] shrink-0 flex items-center justify-center text-[#8e7b72]">
                          <span className="material-symbols-outlined text-[20px]">image</span>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif text-[16px] text-[#1e1b19] font-medium leading-snug truncate">
                          {item.product.name}
                        </h4>
                        <div className="text-[11px] text-[#57423b] flex items-center gap-1.5 mt-0.5">
                          <span>{item.jarSize}</span>
                          <span>•</span>
                          <span className="tabular-nums font-semibold text-[#1e1b19]">
                            ₹{unitPrice}
                          </span>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-[#efe6e3] rounded bg-[#fbf2ee]">
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.product.id, item.jarSize, -1)
                              }
                              className="w-6 h-6 flex items-center justify-center text-xs text-[#1e1b19] hover:bg-white transition-colors"
                            >
                              -
                            </button>
                            <span className="w-6 text-center text-xs font-bold tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                onUpdateQuantity(item.product.id, item.jarSize, 1)
                              }
                              className="w-6 h-6 flex items-center justify-center text-xs text-[#1e1b19] hover:bg-white transition-colors"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() =>
                              onRemoveItem(item.product.id, item.jarSize)
                            }
                            className="text-[#ba1a1a] hover:text-[#93000a] text-xs p-1"
                            title="Remove item"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-serif text-[16px] font-semibold text-[#1e1b19] tabular-nums">
                          ₹{unitPrice * item.quantity}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Gift Option Checkbox */}
                <div className="p-3 bg-[#fbf2ee] rounded-xl border border-[#efe6e3] text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-[#1e1b19]">
                    <input
                      type="checkbox"
                      checked={isGift}
                      onChange={(e) => setIsGift(e.target.checked)}
                      className="accent-[#9f3c16]"
                    />
                    <span>This is a gift order (Include handwritten parchment card)</span>
                  </label>
                  {isGift && (
                    <input
                      type="text"
                      placeholder="Enter gift message (e.g. Wishing you warm kitchen memories!)"
                      value={giftNote}
                      onChange={(e) => setGiftNote(e.target.value)}
                      className="mt-2 w-full p-2 bg-white rounded border border-[#efe6e3] text-xs text-[#1e1b19] outline-none focus:border-[#9f3c16]"
                    />
                  )}
                </div>

                {/* Promo Code Box */}
                <form onSubmit={handleApplyPromo} className="mt-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code (try BANSWARA10)"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 p-2 rounded-lg border border-[#efe6e3] text-xs uppercase outline-none focus:border-[#9f3c16]"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-[#efe6e3] hover:bg-[#dec0b7] text-[#1e1b19] text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
                    >
                      Apply
                    </button>
                  </div>
                  {promoSuccess && (
                    <p className="text-[11px] text-[#516444] mt-1 font-medium">{promoSuccess}</p>
                  )}
                  {promoError && (
                    <p className="text-[11px] text-[#ba1a1a] mt-1 font-medium">{promoError}</p>
                  )}
                </form>
              </div>
            )}
          </div>
        )}

        {/* Footer Summary / Checkout trigger */}
        {!orderPlaced && !isCheckingOut && items.length > 0 && (
          <div className="p-5 border-t border-[#efe6e3] bg-[#fff8f5] space-y-2 text-xs">
            <div className="flex justify-between text-[#57423b]">
              <span>Subtotal</span>
              <span className="tabular-nums font-medium text-[#1e1b19]">₹{subtotal}</span>
            </div>

            {discountAmount > 0 && (
              <div className="flex justify-between text-[#516444] font-medium">
                <span>Discount ({appliedDiscount}%)</span>
                <span className="tabular-nums">-₹{discountAmount}</span>
              </div>
            )}

            <div className="flex justify-between text-[#57423b]">
              <span>Fragile Glass Shipping</span>
              <span className="tabular-nums">
                {shippingFee === 0 ? (
                  <span className="text-[#516444] font-semibold">FREE</span>
                ) : (
                  `₹${shippingFee}`
                )}
              </span>
            </div>

            <div className="pt-2 border-t border-[#dec0b7]/40 flex justify-between items-baseline text-sm">
              <span className="font-bold text-[#1e1b19]">Total</span>
              <span className="font-serif text-[22px] font-bold text-[#9f3c16] tabular-nums">
                ₹{grandTotal}
              </span>
            </div>

            <button
              onClick={() => setIsCheckingOut(true)}
              className="w-full py-3 bg-[#9f3c16] hover:bg-[#bf542c] text-white text-xs font-semibold rounded-lg transition-colors shadow-md mt-2 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Delivery &amp; Payment</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
