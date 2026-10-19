import React from 'react';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToShop: () => void;
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  onNavigateToShop,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div
        className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden border border-[#efe6e3] p-6 sm:p-7"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-[#efe6e3] text-[#57423b] flex items-center justify-center transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Profile Card */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-14 h-14 rounded-full bg-[#9f3c16] text-white flex items-center justify-center font-serif text-[20px] font-bold">
            HS
          </div>
          <div>
            <h3 className="font-serif text-[20px] text-[#1e1b19] font-medium leading-tight">
              Harsh Shrivastava
            </h3>
            <span className="text-xs text-[#57423b]">harsh01.shrivastava@gmail.com</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="bg-[#516444]/15 text-[#516444] text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                Pantry Club Member
              </span>
            </div>
          </div>
        </div>

        {/* Saved Delivery Addresses */}
        <div className="mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#57423b] block mb-2 font-sans">
            Primary Dispatch Address
          </span>
          <div className="p-3 bg-[#fbf2ee] rounded-xl border border-[#efe6e3] text-xs space-y-1">
            <div className="font-semibold text-[#1e1b19]">Home Delivery</div>
            <p className="text-[#57423b]">B-402, Green Meadows, Civil Lines, Banswara, Rajasthan - 327001</p>
            <span className="text-[11px] text-[#516444] font-medium block pt-1">
              ✓ Eligible for same-day local kitchen pick-up
            </span>
          </div>
        </div>

        {/* Recent Past Batch Orders */}
        <div className="mb-6">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#57423b] block mb-2 font-sans">
            Recent Batch Dispatches
          </span>
          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-white border border-[#efe6e3] rounded-xl flex items-center justify-between shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#1e1b19]">Order #LP-77491</span>
                  <span className="bg-[#516444]/15 text-[#516444] text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Delivered
                  </span>
                </div>
                <p className="text-[#57423b] mt-0.5">
                  1x Sichuan Chilli Oil (200ml), 1x Pesto (200ml)
                </p>
                <span className="text-[11px] text-[#8a726a]">Dispatched Oct 4, 2026 • ₹760</span>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onNavigateToShop();
                }}
                className="text-[11px] text-[#9f3c16] font-semibold hover:underline"
              >
                Reorder
              </button>
            </div>
          </div>
        </div>

        {/* Glass Recycling Credits */}
        <div className="p-3 bg-[#516444]/10 rounded-xl border border-[#516444]/20 text-xs flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#516444] text-[20px]">
              eco
            </span>
            <div>
              <strong className="text-[#1e1b19] block">Glass Return Credits:</strong>
              <span className="text-[#516444]">₹100 available for your next order</span>
            </div>
          </div>
          <span className="font-bold text-[#516444] text-sm tabular-nums">2 Jars Returned</span>
        </div>

        {/* Footer */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#efe6e3] hover:bg-[#dec0b7] text-[#1e1b19] text-xs font-semibold rounded-lg transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
