import React from 'react';
import { Review } from '../types';

interface TestimonialsProps {
  reviews: Review[];
}

export const Testimonials: React.FC<TestimonialsProps> = ({ reviews }) => {
  return (
    <section className="w-full bg-[#fbf2ee] py-16 border-b border-[#f5ece9]">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-[12px] text-[#516444] tracking-widest uppercase font-semibold block font-sans">
            Kitchen Praise
          </span>
          <h2 className="font-serif text-[32px] sm:text-[38px] text-[#1e1b19] mt-1 font-normal tracking-tight">
            Loved Across Breakfast &amp; Dinner Tables
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-xl shadow-[0_2px_8px_rgba(42,38,36,0.04)] border border-[#efe6e3] flex flex-col justify-between"
            >
              <div>
                {/* 5-star row */}
                <div className="flex text-[#805200] mb-3">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[18px] fill-current">
                      star
                    </span>
                  ))}
                </div>

                {/* Review body */}
                <p className="text-[14px] leading-relaxed text-[#57423b] italic mb-6">
                  "{review.comment}"
                </p>
              </div>

              {/* Author footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#f5ece9]">
                <div
                  className={`w-9 h-9 rounded-full font-bold flex items-center justify-center text-[12px] ${
                    review.initials === 'AM'
                      ? 'bg-[#9f3c16]/10 text-[#9f3c16]'
                      : review.initials === 'RK'
                      ? 'bg-[#516444]/15 text-[#516444]'
                      : 'bg-[#805200]/15 text-[#805200]'
                  }`}
                >
                  {review.initials}
                </div>
                <div>
                  <span className="font-serif text-[16px] text-[#1e1b19] block leading-tight font-medium">
                    {review.name}
                  </span>
                  <span className="text-[11px] text-[#57423b] font-sans">
                    {review.role} • {review.location.split(',')[0]}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
