import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Default items for the carousel
const DUMMY_ITEMS = [
  { id: 1, content: "Card 1" },
  { id: 2, content: "Card 2" },
  { id: 3, content: "Card 3" },
  { id: 4, content: "Card 4" },
  { id: 5, content: "Card 5" },
];

type CarouselItem = {
  id: number;
  content: string;
};

export default function Carousel3D({
  items = DUMMY_ITEMS,
}: {
  items?: CarouselItem[];
}) {
  const [activeIndex, setActiveIndex] = useState(Math.floor(items.length / 2));
  const [isAnimating, setIsAnimating] = useState(false);
  const TRANSITION_DURATION = 400; // Should match the CSS transition duration

  // Swipe/Drag detection state
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50; // Minimum distance in pixels to trigger a swipe

  const navigate = (direction: "prev" | "next") => {
    if (isAnimating) return;
    setIsAnimating(true);

    if (direction === "next") {
      setActiveIndex((prev) => (prev + 1) % items.length);
    } else {
      setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    }

    setTimeout(() => setIsAnimating(false), TRANSITION_DURATION);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    
    if (distance > SWIPE_THRESHOLD) {
      navigate("next");
    } else if (distance < -SWIPE_THRESHOLD) {
      navigate("prev");
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (touchStartX.current === null) return;
    touchEndX.current = e.clientX;
  };

  const handleMouseUp = () => {
    handleTouchEnd();
  };

  const handleMouseLeave = () => {
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const getStyle = (index: number) => {
    let offset = index - activeIndex;
    // Calculate the shortest path for looping
    if (Math.abs(offset) > items.length / 2) {
      offset = offset - Math.sign(offset) * items.length;
    }

    const style: React.CSSProperties = {
      position: "absolute",
      width: "100%",
      height: "100%",
      transition: `transform ${TRANSITION_DURATION}ms ease, opacity ${TRANSITION_DURATION}ms ease`,
      zIndex: items.length - Math.abs(offset),
      pointerEvents: offset === 0 ? "auto" : "none",
    };

    let transform = "scale(0)";
    let opacity = 0;

    if (Math.abs(offset) <= 2) {
      const sign = Math.sign(offset);
      const absOffset = Math.abs(offset);

      const baseTranslateX = 80;
      const baseScale = 0.8;
      const baseRotateY = 35;

      transform = `translateX(${
        sign * absOffset * baseTranslateX
      }%) rotateY(${-sign * baseRotateY}deg) scale(${Math.pow(
        baseScale,
        absOffset
      )})`;

      if (offset === 0) {
        opacity = 1;
      } else {
        opacity = Math.pow(0.7, absOffset);
      }
    }

    style.transform = transform;
    style.opacity = opacity;

    return style;
  };

  return (
    <div 
      className="relative flex h-62.5 w-full items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className="relative h-full w-[60%]"
        style={{ perspective: "1000px" }}
      >
        <div
          className="absolute h-full w-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center justify-center rounded-lg border-2 bg-base-100/50 p-4 backdrop-blur-sm"
              style={getStyle(index)}
            >
              <h2 className="text-2xl font-bold text-base-content">
                {item.content}
              </h2>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
