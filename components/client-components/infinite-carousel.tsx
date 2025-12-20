"use client";

import type React from "react";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface InfiniteCarouselProps {
  items: React.ReactNode[];
  className?: string;
  cardsToShow?: number;
}

export function InfiniteCarousel({ items, className, cardsToShow = 3 }: InfiniteCarouselProps) {
  const clonedItems = [...items, ...items, ...items];
  const [currentIndex, setCurrentIndex] = useState(items.length);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);

  const cardWidth = 100 / cardsToShow;

  const goToNext = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev + 1);
  };

  const goToPrevious = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prev) => prev - 1);
  };

  const handleDragStart = (clientX: number) => {
    setIsDragging(true);
    setStartPos(clientX);
    setPrevTranslate(currentTranslate);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging) return;
    const currentPosition = clientX;
    const diff = currentPosition - startPos;
    setCurrentTranslate(prevTranslate + diff);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const movedBy = currentTranslate - prevTranslate;
    const threshold = 50; // Minimum swipe distance in pixels

    if (movedBy < -threshold) {
      // Swiped left, go next
      goToNext();
    } else if (movedBy > threshold) {
      // Swiped right, go previous
      goToPrevious();
    }

    // Reset translate after determining direction
    setCurrentTranslate(0);
    setPrevTranslate(0);
  };

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleDragStart(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    handleDragMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleDragEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleDragEnd();
    }
  };

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleDragEnd();
  };

  useEffect(() => {
    if (!isTransitioning) return;

    const timeout = setTimeout(() => {
      setIsTransitioning(false);

      // Reset to the middle set when we reach the boundaries
      if (currentIndex >= items.length * 2) {
        setCurrentIndex(items.length);
      } else if (currentIndex < items.length) {
        setCurrentIndex(items.length * 2 - 1);
      }
    }, 500); // Match transition duration

    return () => clearTimeout(timeout);
  }, [currentIndex, isTransitioning, items.length]);

  const activeDot = (((currentIndex - items.length) % items.length) + items.length) % items.length;

  return (
    <div className={cn("relative w-full", className)}>
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div
        className="overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          ref={carouselRef}
          className={cn(
            "flex gap-4 select-none",
            isTransitioning && !isDragging && "transition-transform duration-500 ease-out"
          )}
          style={{
            transform: `translateX(calc(-${currentIndex * cardWidth}% + ${
              isDragging ? currentTranslate : 0
            }px))`,
          }}
        >
          {clonedItems.map((item, index) => (
            <div
              key={index}
              className="flex-shrink-0"
              style={{ width: `calc(${cardWidth}% - ${((cardsToShow - 1) * 16) / cardsToShow}px)` }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 backdrop-blur-sm"
        onClick={goToNext}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      <div className="mt-6 flex justify-center gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={cn(
              "h-2 w-2 rounded-full transition-all",
              activeDot === index ? "w-8 bg-primary" : "bg-muted-foreground/30"
            )}
            onClick={() => {
              setIsTransitioning(true);
              setCurrentIndex(items.length + index);
            }}
          />
        ))}
      </div>
    </div>
  );
}
