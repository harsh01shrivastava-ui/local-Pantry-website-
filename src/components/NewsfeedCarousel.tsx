import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

interface NewsfeedCarouselProps {
  onExploreRecipes?: () => void;
}

interface NewsfeedPost {
  id: string;
  filename: string;
  imageUrl: string;
  title: string;
  caption: string;
  tag: string;
  recipePairing: string;
  likes: number;
}

// Curated culinary metadata tailored to each newsfeed snapshot
const POST_METADATA: Record<
  string,
  { title: string; caption: string; tag: string; recipePairing: string; likes: number }
> = {
  'nf1.png': {
    title: 'Batch #48 Fresh Drops',
    caption: 'Chunky Pizza Sauce, Smokey Tandoori, and Strawberry Shrikhand freshly tagged and sealed for courier dispatch.',
    tag: 'Fresh Jars',
    recipePairing: 'Ready to pair with warm sourdough, tandoori marinades, and festive desserts.',
    likes: 142,
  },
  'nf2.png': {
    title: 'Crispy Dumplings & Chilli Oil',
    caption: 'Crispy rice paper rolls served alongside a generous bowl of our slow-infused Sichuan peppercorn chilli oil.',
    tag: 'Pan-Asian Plate',
    recipePairing: 'Best drizzled over dumplings, steamed noodles, or crispy fried eggs.',
    likes: 198,
  },
  'nf3.png': {
    title: 'Basil Pesto Sourdough Melt',
    caption: 'Warm toasted country sourdough topped with melted cheese, ripe blistered tomatoes, and stone-ground basil pesto.',
    tag: 'Quick Lunch',
    recipePairing: 'Spoon 2 tbsp Pesto directly from jar over warm toasted cheese.',
    likes: 165,
  },
  'nf4.png': {
    title: 'Gunpowder Podi Uttapam',
    caption: 'Crispy vegetable uttapam generously dusted with artisanal Gunpowder Podi and coconut mint chutney.',
    tag: 'Heritage Morning',
    recipePairing: 'Mix with warm desi ghee or cold-pressed sesame oil before sprinkling.',
    likes: 214,
  },
  'nf5.png': {
    title: 'Simmering Pizza Sauce Jars',
    caption: 'Freshly bottled chunky oregano pizza sauce, slow-simmered for 2 hours with cold-pressed olive oil.',
    tag: 'From The Stove',
    recipePairing: 'Spread over artisanal pizza bases, warm sourdough toast, or baked shakshuka.',
    likes: 178,
  },
  'nf6.png': {
    title: 'Classic Spaghetti Pomodoro',
    caption: 'Al dente spaghetti tossed in our chunky pizza sauce and finished with fresh torn garden basil leaves.',
    tag: 'Italian Comfort',
    recipePairing: 'Emulsify 4 tbsp sauce with starchy pasta water for a silky restaurant-quality gloss.',
    likes: 220,
  },
  'nf7.png': {
    title: 'Cast-Iron Skillet Shakshuka',
    caption: 'Country eggs poached gently in spiced tomato gravy, served straight from skillet with whole wheat bread.',
    tag: 'Weekend Brunch',
    recipePairing: 'Simmer eggs directly into Chunky Pizza Sauce with cracked black pepper.',
    likes: 256,
  },
  'nf8.png': {
    title: 'Butterfly Pea Flower Rice',
    caption: 'Aromatic blue pea flower rice bowl topped with golden garlic crisps and Sichuan chilli oil crisp.',
    tag: 'Culinary Play',
    recipePairing: 'Toss with stir-fried seasonal greens, roasted cashews, and extra chilli crunch.',
    likes: 289,
  },
};

export const NewsfeedCarousel: React.FC<NewsfeedCarouselProps> = ({ onExploreRecipes }) => {
  // Dynamically import all images inside src/assets/images/newsfeed
  const rawImageModules = import.meta.glob<string>(
    '../assets/images/newsfeed/*.{png,jpg,jpeg,webp,PNG,JPG,JPEG,WEBP}',
    { eager: true, import: 'default' }
  );

  // Parse and naturally sort images by number (nf1, nf2, ..., nf8)
  const posts: NewsfeedPost[] = useMemo(() => {
    const entries = Object.entries(rawImageModules);
    entries.sort(([pathA], [pathB]) => {
      const matchA = pathA.match(/(\d+)/);
      const matchB = pathB.match(/(\d+)/);
      const numA = matchA ? parseInt(matchA[1], 10) : 0;
      const numB = matchB ? parseInt(matchB[1], 10) : 0;
      if (numA !== numB) return numA - numB;
      return pathA.localeCompare(pathB);
    });

    return entries.map(([filePath, imageUrl], idx) => {
      const filename = filePath.split('/').pop() || `photo-${idx + 1}.png`;
      const meta = POST_METADATA[filename] || {
        title: filename
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        caption: 'Handcrafted in small batches directly from our family kitchen in Banswara.',
        tag: 'Kitchen Creation',
        recipePairing: 'Made with 100% natural seasonal ingredients and cold-pressed oils.',
        likes: 120 + ((idx * 17) % 150),
      };

      return {
        id: `newsfeed-${idx}-${filename}`,
        filename,
        imageUrl,
        title: meta.title,
        caption: meta.caption,
        tag: meta.tag,
        recipePairing: meta.recipePairing,
        likes: meta.likes,
      };
    });
  }, [rawImageModules]);

  const totalOriginal = posts.length;

  // Clone first post to the end for seamless infinite forward looping
  const extendedPosts = useMemo(() => {
    if (totalOriginal === 0) return [];
    return [...posts, posts[0]];
  }, [posts, totalOriginal]);

  // Slideshow index: 0 to totalOriginal
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedPost, setSelectedPost] = useState<NewsfeedPost | null>(null);

  // 5-second progress bar tracking (0 to 100%)
  const [progress, setProgress] = useState(0);
  const SLIDE_DURATION_MS = 5000; // 5 seconds per image
  const PROGRESS_TICK_MS = 50;

  // Touch and drag coordinates
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const [dragOffset, setDragOffset] = useState(0);

  // Navigate to next slide
  const handleNext = useCallback(() => {
    if (totalOriginal === 0) return;
    setIsTransitioning(true);
    setProgress(0);
    setCurrentIndex((prev) => prev + 1);
  }, [totalOriginal]);

  // Navigate to previous slide
  const handlePrev = useCallback(() => {
    if (totalOriginal === 0) return;
    setProgress(0);
    if (currentIndex === 0) {
      // Snap to last original post immediately then animate
      setIsTransitioning(false);
      setCurrentIndex(totalOriginal);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsTransitioning(true);
          setCurrentIndex(totalOriginal - 1);
        });
      });
    } else {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex, totalOriginal]);

  // Handle transition end for infinite looping
  const handleTransitionEnd = useCallback(() => {
    if (totalOriginal === 0) return;
    if (currentIndex >= totalOriginal) {
      // Reached the clone of post 0 at the end: instantly reset to 0 without transition
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  }, [currentIndex, totalOriginal]);

  // Re-enable CSS transition after instantaneous reset
  useEffect(() => {
    if (!isTransitioning) {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  // Auto-advance slideshow every 5 seconds with smooth progress timer
  useEffect(() => {
    if (!isAutoPlay || isHovered || selectedPost !== null || totalOriginal === 0) {
      return;
    }

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (PROGRESS_TICK_MS / SLIDE_DURATION_MS) * 100;
        if (next >= 100) {
          handleNext();
          return 0;
        }
        return next;
      });
    }, PROGRESS_TICK_MS);

    return () => clearInterval(timer);
  }, [isAutoPlay, isHovered, selectedPost, totalOriginal, handleNext]);

  // Dot navigation
  const handleDotClick = (idx: number) => {
    setIsTransitioning(true);
    setProgress(0);
    setCurrentIndex(idx);
  };

  // Mobile Touch Handlers (intelligent horizontal detection so vertical page scroll is never blocked)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isHorizontalSwipe.current = null;
    setDragOffset(0);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return;
    const diffX = e.touches[0].clientX - touchStartX.current;
    const diffY = e.touches[0].clientY - touchStartY.current;

    // Detect direction on first few pixels
    if (isHorizontalSwipe.current === null && (Math.abs(diffX) > 8 || Math.abs(diffY) > 8)) {
      isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY);
    }

    // Only apply horizontal drag if user is actively swiping sideways
    if (isHorizontalSwipe.current) {
      setDragOffset(diffX);
    }
  };

  const handleTouchEnd = () => {
    if (isHorizontalSwipe.current && touchStartX.current !== null) {
      if (dragOffset < -40) {
        handleNext();
      } else if (dragOffset > 40) {
        handlePrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
    isHorizontalSwipe.current = null;
    setDragOffset(0);
  };

  // Desktop Mouse Handlers
  const [mouseStartX, setMouseStartX] = useState<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setMouseStartX(e.clientX);
    setDragOffset(0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (mouseStartX === null) return;
    setDragOffset(e.clientX - mouseStartX);
  };

  const handleMouseUp = () => {
    if (mouseStartX === null) return;
    if (dragOffset < -50) {
      handleNext();
    } else if (dragOffset > 50) {
      handlePrev();
    }
    setMouseStartX(null);
    setDragOffset(0);
  };

  // Active original post index (0 to totalOriginal - 1)
  const activeDotIndex = totalOriginal > 0 ? currentIndex % totalOriginal : 0;

  return (
    <section
      id="recipes-grid"
      className="w-full bg-[#fff8f5] py-12 sm:py-16 lg:py-20 border-b border-[#f5ece9] overflow-hidden"
    >
      <div className="max-w-[1280px] mx-auto px-4 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6 mb-6 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9f3c16]/10 text-[#9f3c16] mb-2.5">
              <span className="material-symbols-outlined text-[15px] animate-pulse">
                restaurant_menu
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase font-sans">
                Kitchen Table Dispatches &amp; Recipes
              </span>
            </div>

            <h2 className="font-serif text-[26px] xs:text-[30px] sm:text-[38px] lg:text-[42px] text-[#1e1b19] font-normal tracking-tight leading-tight">
              Delicious Cuisines Made from Local Pantry Products
            </h2>

            <p className="text-[14px] sm:text-[15px] text-[#57423b] max-w-xl mt-2 font-sans leading-relaxed">
              Explore vibrant home-cooked cuisines and quick serving ideas handcrafted with our
              small-batch natural condiments, dips, and spice blends from Banswara.
            </p>
          </div>

          {/* Controls: Instagram & Slideshow Toggles */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <a
              href="https://www.instagram.com/thelocalpantry_/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#fbf2ee] hover:bg-[#efe6e3] text-[#1e1b19] hover:text-[#9f3c16] text-[12px] sm:text-[13px] font-semibold rounded-lg border border-[#efe6e3] transition-all shadow-xs cursor-pointer min-h-[38px]"
              title="Visit @thelocalpantry_ on Instagram"
            >
              <span className="material-symbols-outlined text-[17px] text-[#9f3c16]">
                photo_camera
              </span>
              <span>@thelocalpantry_</span>
            </a>

            {/* Auto-play toggle button */}
            <button
              onClick={() => {
                setIsAutoPlay((prev) => !prev);
                setProgress(0);
              }}
              aria-label={isAutoPlay ? 'Pause 5s slideshow' : 'Play 5s slideshow'}
              className={`p-2 rounded-lg border text-[12px] sm:text-[13px] font-medium flex items-center gap-1.5 transition-all cursor-pointer min-h-[38px] ${
                isAutoPlay
                  ? 'bg-[#516444]/10 text-[#516444] border-[#516444]/20 hover:bg-[#516444]/20'
                  : 'bg-[#fbf2ee] text-[#57423b] border-[#efe6e3] hover:text-[#1e1b19]'
              }`}
              title={isAutoPlay ? 'Auto-slide active (changes every 5s)' : 'Auto-slide paused'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {isAutoPlay ? 'pause' : 'play_arrow'}
              </span>
              <span className="text-[11px] sm:text-[12px]">
                {isAutoPlay ? '5s Slide' : 'Paused'}
              </span>
            </button>

            {/* Left / Right Nav Arrows for Desktop */}
            <div className="hidden sm:flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                aria-label="Previous cuisine"
                className="w-9 h-9 rounded-full bg-[#fbf2ee] hover:bg-[#9f3c16] text-[#1e1b19] hover:text-white border border-[#efe6e3] flex items-center justify-center transition-all shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button
                onClick={handleNext}
                aria-label="Next cuisine"
                className="w-9 h-9 rounded-full bg-[#fbf2ee] hover:bg-[#9f3c16] text-[#1e1b19] hover:text-white border border-[#efe6e3] flex items-center justify-center transition-all shadow-xs hover:shadow-sm active:scale-95 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Single-Image Slideshow Frame: Stacks vertically on mobile */}
        <div
          className="relative max-w-[1040px] mx-auto rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-[#efe6e3] bg-[#fbf2ee]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Top 5-second Progress Indicator Bar */}
          <div className="w-full bg-[#efe6e3] h-1.5 overflow-hidden">
            <div
              className="h-full bg-[#9f3c16] transition-all ease-linear"
              style={{
                width: isAutoPlay && !isHovered ? `${progress}%` : '100%',
                transitionDuration: isAutoPlay && !isHovered ? `${PROGRESS_TICK_MS}ms` : '300ms',
              }}
            />
          </div>

          {/* Slideshow Slider Track (1 image per view at 100% width) */}
          <div
            onTransitionEnd={handleTransitionEnd}
            style={{
              transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}px))`,
              transition: isTransitioning ? 'transform 600ms cubic-bezier(0.25, 1, 0.5, 1)' : 'none',
            }}
            className="flex items-stretch will-change-transform"
          >
            {extendedPosts.map((post, idx) => (
              <div
                key={`${post.id}-${idx}`}
                className="w-full flex-shrink-0 grid grid-cols-1 lg:grid-cols-12"
              >
                {/* Image Stage: Top on Mobile, Left on Desktop */}
                <div className="lg:col-span-7 relative flex items-center justify-center p-4 xs:p-6 sm:p-8 lg:p-10 bg-[#f5ece9]/70 overflow-hidden min-h-[280px] xs:min-h-[320px] sm:min-h-[400px]">
                  {/* Atmospheric blurred ambient glow */}
                  <img
                    src={post.imageUrl}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover blur-3xl opacity-25 scale-110 pointer-events-none select-none"
                  />

                  {/* Food Photograph Container */}
                  <div
                    className="relative z-10 w-full max-w-[280px] xs:max-w-[320px] sm:max-w-[380px] aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-white/70 bg-[#1e1b19] group cursor-pointer"
                    onClick={() => setSelectedPost(post)}
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      loading="eager"
                      draggable={false}
                      className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-700 ease-out select-none"
                    />

                    {/* Tag Badge */}
                    <div className="absolute top-3 left-3 bg-[#fff8f5]/95 backdrop-blur-md text-[#516444] text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-white/80 shadow-xs font-sans">
                      {post.tag}
                    </div>

                    {/* Full screen inspect badge */}
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 text-[#1e1b19] flex items-center justify-center shadow-md">
                      <span className="material-symbols-outlined text-[17px]">fullscreen</span>
                    </div>
                  </div>

                  {/* Mobile-Friendly Navigation Chevrons directly over the Image */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                    }}
                    aria-label="Previous slide"
                    className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-[#9f3c16] text-[#1e1b19] hover:text-white shadow-md flex items-center justify-center transition-all cursor-pointer border border-[#efe6e3] active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px] sm:text-[22px]">chevron_left</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                    }}
                    aria-label="Next slide"
                    className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/90 hover:bg-[#9f3c16] text-[#1e1b19] hover:text-white shadow-md flex items-center justify-center transition-all cursor-pointer border border-[#efe6e3] active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[20px] sm:text-[22px]">chevron_right</span>
                  </button>
                </div>

                {/* Right/Bottom Column: Dish Details & Pairing */}
                <div className="lg:col-span-5 p-5 xs:p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-[#fbf2ee] border-t lg:border-t-0 lg:border-l border-[#efe6e3]">
                  <div>
                    {/* Slide Counter & Category */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <span className="text-[11px] sm:text-[12px] font-semibold tracking-wider uppercase text-[#9f3c16] font-sans flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#9f3c16] animate-pulse"></span>
                        <span>{post.tag}</span>
                      </span>

                      <div className="flex items-center gap-1 text-[11px] sm:text-[12px] font-mono font-medium text-[#8a726a] bg-[#fff8f5] px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full border border-[#efe6e3] shadow-xs">
                        <span className="text-[#9f3c16] font-bold">
                          {String((idx % totalOriginal) + 1).padStart(2, '0')}
                        </span>
                        <span>/</span>
                        <span>{String(totalOriginal).padStart(2, '0')}</span>
                      </div>
                    </div>

                    {/* Dish Headline */}
                    <h3 className="font-serif text-[22px] xs:text-[24px] sm:text-[28px] lg:text-[32px] text-[#1e1b19] font-normal leading-snug">
                      {post.title}
                    </h3>

                    {/* Dish Caption */}
                    <p className="text-[13px] sm:text-[15px] leading-relaxed text-[#57423b] mt-2 sm:mt-3 font-sans">
                      {post.caption}
                    </p>

                    {/* Serving Inspiration Card */}
                    <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-[#fff8f5] border border-[#efe6e3] shadow-xs">
                      <div className="flex items-center gap-1.5 text-[#516444] text-[11px] sm:text-[12px] font-semibold mb-1">
                        <span className="material-symbols-outlined text-[15px] sm:text-[16px]">restaurant</span>
                        <span>Pantry Serving Inspiration</span>
                      </div>
                      <p className="text-[12px] sm:text-[13px] text-[#57423b] leading-relaxed">
                        {post.recipePairing}
                      </p>
                    </div>
                  </div>

                  {/* Slide Footer Actions */}
                  <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-[#efe6e3] flex items-center justify-between gap-3 text-[12px] sm:text-[13px]">
                    <div className="flex items-center gap-1 text-[#8a726a]">
                      <span className="material-symbols-outlined text-[16px] text-[#9f3c16]">
                        favorite
                      </span>
                      <span>{post.likes} food lovers</span>
                    </div>

                    <button
                      onClick={() => setSelectedPost(post)}
                      className="inline-flex items-center gap-1 font-semibold text-[#9f3c16] hover:underline cursor-pointer"
                    >
                      <span>Inspect Details</span>
                      <span className="material-symbols-outlined text-[16px]">zoom_in</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination Dots & Recipe Explorer Bar */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#f5ece9]">
          {/* Pagination Dots */}
          <div className="flex items-center gap-2">
            {posts.map((post, idx) => (
              <button
                key={post.id}
                onClick={() => handleDotClick(idx)}
                aria-label={`Go to cuisine ${idx + 1}: ${post.title}`}
                className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                  activeDotIndex === idx
                    ? 'w-8 bg-[#9f3c16]'
                    : 'w-2.5 bg-[#dec0b7] hover:bg-[#9f3c16]/50'
                }`}
                title={post.title}
              />
            ))}
          </div>

          {/* Recipe Collection Link */}
          {onExploreRecipes && (
            <div className="flex items-center gap-2 sm:gap-4 text-center sm:text-left">
              <span className="text-[12px] sm:text-[13px] text-[#57423b]">
                Looking for full cooking measurements?
              </span>
              <button
                onClick={onExploreRecipes}
                className="inline-flex items-center gap-1 text-[12px] sm:text-[13px] font-semibold text-[#9f3c16] hover:underline cursor-pointer shrink-0"
              >
                <span>All Recipes</span>
                <span className="material-symbols-outlined text-[16px]">menu_book</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Modal for Full Screen Inspection */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-fadeIn"
          onClick={() => setSelectedPost(null)}
        >
          <div
            className="relative bg-[#fff8f5] rounded-2xl sm:rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-[#dec0b7]/40 max-h-[92vh] flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Modal Button */}
            <button
              onClick={() => setSelectedPost(null)}
              aria-label="Close photo preview"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 hover:bg-[#9f3c16] hover:text-white text-[#1e1b19] flex items-center justify-center shadow-md transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] sm:text-[20px]">close</span>
            </button>

            {/* Modal Image View */}
            <div className="md:w-1/2 bg-[#f5ece9] flex items-center justify-center overflow-hidden">
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                className="w-full h-full max-h-[40vh] md:max-h-[80vh] object-cover"
              />
            </div>

            {/* Modal Info Pane */}
            <div className="md:w-1/2 p-5 sm:p-8 flex flex-col justify-between overflow-y-auto">
              <div>
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#9f3c16]/10 text-[#9f3c16] text-[10px] sm:text-[11px] font-semibold tracking-wider uppercase font-sans">
                    {selectedPost.tag}
                  </span>
                  <span className="text-[11px] sm:text-[12px] text-[#8a726a]">From Banswara Kitchen</span>
                </div>

                <h3 className="font-serif text-[22px] sm:text-[28px] text-[#1e1b19] font-normal leading-snug">
                  {selectedPost.title}
                </h3>

                <p className="text-[13px] sm:text-[14px] leading-relaxed text-[#57423b] mt-2 sm:mt-3 font-sans">
                  {selectedPost.caption}
                </p>

                {/* Serving Pairing Suggestion */}
                <div className="mt-4 p-3 sm:p-3.5 bg-[#fbf2ee] rounded-xl border border-[#efe6e3]">
                  <div className="flex items-center gap-1.5 text-[#516444] text-[11px] sm:text-[12px] font-semibold mb-1">
                    <span className="material-symbols-outlined text-[15px] sm:text-[16px]">restaurant</span>
                    <span>Kitchen Serving Note</span>
                  </div>
                  <p className="text-[12px] sm:text-[13px] text-[#57423b] leading-relaxed">
                    {selectedPost.recipePairing}
                  </p>
                </div>
              </div>

              {/* Modal Footer with Instagram CTA */}
              <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-[#efe6e3] flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px] text-[#8a726a]">
                  <span className="material-symbols-outlined text-[16px] sm:text-[17px] text-[#9f3c16]">
                    favorite
                  </span>
                  <span>{selectedPost.likes} people love this plate</span>
                </div>

                <a
                  href="https://www.instagram.com/thelocalpantry_/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#9f3c16] hover:bg-[#bf542c] text-white text-[12px] sm:text-[13px] font-semibold rounded-lg shadow-sm transition-all"
                >
                  <span className="material-symbols-outlined text-[16px]">photo_camera</span>
                  <span>Follow On Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
