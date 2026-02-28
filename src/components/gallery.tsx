import { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
} from '@/common/components/ui/dialog';
import { Button } from '@/common/components/ui/button';
import { ChevronLeft, ChevronRight, ChevronDown, X } from 'lucide-react';
import Intersect from '@/common/components/intersect';

const SLICE_SIZE = 9;
const SWIPE_THRESHOLD = 40;
const MAX_VERTICAL_DELTA = 80;
const SLIDE_DURATION_MS = 300;

type GalleryImageItem = {
  src: string;
  display?: string;
  thumbnail?: string;
  alt?: string;
};

export default function Gallery({ images }: { images: GalleryImageItem[] }) {
  const [displayCount, setDisplayCount] = useState<number>(SLICE_SIZE);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [slideDirection, setSlideDirection] = useState<1 | -1>(1);
  const [isSliding, setIsSliding] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const transitionTimerRef = useRef<number | null>(null);

  const getModalSrc = (index: number) =>
    images[index]?.display || images[index]?.src;

  const preloadImage = (src?: string) => {
    if (!src) return;
    const img = new Image();
    img.decoding = 'async';
    img.src = src;
  };

  useEffect(() => {
    return () => {
      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
        transitionTimerRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (selectedIndex === null || images.length === 0) return;

    const preloadTargets = [
      currentIndex,
      (currentIndex + 1) % images.length,
      (currentIndex - 1 + images.length) % images.length,
    ];

    preloadTargets.forEach((index) => {
      const src = getModalSrc(index);
      preloadImage(src);
    });
  }, [selectedIndex, currentIndex, images]);

  useEffect(() => {
    const initialSources = images
      .slice(0, SLICE_SIZE)
      .map((image) => image.thumbnail || image.display || image.src);

    initialSources.forEach(preloadImage);
    preloadImage(getModalSrc(0));
    preloadImage(getModalSrc(1));
  }, [images]);

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    setCurrentIndex(index);
    setNextIndex(null);
    setIsSliding(false);
  };

  const startSlide = (direction: 1 | -1) => {
    if (isSliding || images.length < 2) return;

    const targetIndex =
      direction === 1
        ? currentIndex < images.length - 1
          ? currentIndex + 1
          : 0
        : currentIndex > 0
          ? currentIndex - 1
          : images.length - 1;

    setSlideDirection(direction);
    setNextIndex(targetIndex);
    setIsSliding(false);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setIsSliding(true);
      });
    });

    if (transitionTimerRef.current) {
      window.clearTimeout(transitionTimerRef.current);
    }
    transitionTimerRef.current = window.setTimeout(() => {
      setCurrentIndex(targetIndex);
      setNextIndex(null);
      setIsSliding(false);
      transitionTimerRef.current = null;
    }, SLIDE_DURATION_MS);
  };

  const handlePrevious = () => {
    startSlide(-1);
  };

  const handleNext = () => {
    startSlide(1);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0] ?? e.changedTouches[0];
    if (!touch) return;
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    if (!start) return;

    const touch = e.changedTouches[0];
    if (!touch) {
      touchStartRef.current = null;
      return;
    }
    const deltaX = touch.clientX - start.x;
    const deltaY = Math.abs(touch.clientY - start.y);

    touchStartRef.current = null;

    if (deltaY > MAX_VERTICAL_DELTA) return;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

    if (deltaX < 0) {
      handleNext();
    } else {
      handlePrevious();
    }
  };

  const handleTouchCancel = () => {
    touchStartRef.current = null;
  };

  const slideFrames =
    nextIndex === null
      ? [currentIndex]
      : slideDirection === 1
        ? [currentIndex, nextIndex]
        : [nextIndex, currentIndex];

  const trackTransform =
    nextIndex === null
      ? 'translateX(0%)'
      : isSliding
        ? slideDirection === 1
          ? 'translateX(-50%)'
          : 'translateX(0%)'
        : slideDirection === 1
          ? 'translateX(0%)'
          : 'translateX(-50%)';

  return (
    <div>
      <h2 className='text-center text-xl font-en pb-10'>WEDDING GALLERY</h2>

      {/* 이미지 그리드 */}
      <div className='grid grid-cols-3 gap-2 mx-4'>
        {images.slice(0, displayCount).map((image, index) => (
          <Intersect key={index} type='data-animate'>
            <div
              className='aspect-square cursor-pointer overflow-hidden rounded-lg'
              onClick={() => handleImageClick(index)}
              data-animate-stage={(index % SLICE_SIZE) + 1}
            >
              <img
                src={image.thumbnail || image.src}
                alt={image.alt || `Wedding photo ${index + 1}`}
                loading={index < 3 ? 'eager' : 'lazy'}
                decoding='async'
                className='w-full h-full object-cover hover:scale-105 transition-transform duration-400'
              />
            </div>
          </Intersect>
        ))}
      </div>

      {/* 더보기 버튼 */}
      {displayCount < images.length && (
        <div className='flex justify-center mt-6'>
          <Button
            variant='outline'
            onClick={() => setDisplayCount((prev) => prev + SLICE_SIZE)}
          >
            <ChevronDown className='h-6 w-6' />
            사진 더보기
          </Button>
        </div>
      )}

      {/* 이미지 모달 */}
      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedIndex(null);
            setNextIndex(null);
            setIsSliding(false);
            if (transitionTimerRef.current) {
              window.clearTimeout(transitionTimerRef.current);
              transitionTimerRef.current = null;
            }
          }
        }}
      >
        <DialogContent
          showCloseButton={false}
          className='max-w-4xl p-0 bg-transparent border-none'
        >
          <div
            className='relative touch-pan-y select-none'
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchCancel}
          >
            <DialogClose
              className='absolute right-3 top-3 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full bg-black/55 text-white shadow-md ring-1 ring-white/35 backdrop-blur-sm transition-colors hover:bg-black/70'
              aria-label='닫기'
            >
              <X className='h-4 w-4' />
            </DialogClose>
            <div className='overflow-hidden rounded-lg'>
              <div
                className='flex will-change-transform'
                style={
                  nextIndex !== null
                    ? {
                        width: '200%',
                        transform: trackTransform,
                        transitionProperty: isSliding
                          ? 'transform'
                          : undefined,
                        transitionDuration: isSliding
                          ? `${SLIDE_DURATION_MS}ms`
                          : undefined,
                        transitionTimingFunction: isSliding
                          ? 'ease-in-out'
                          : undefined,
                      }
                    : {
                        width: '100%',
                        transform: 'translateX(0%)',
                      }
                }
              >
                {slideFrames.map((imageIndex, order) => (
                  <img
                    key={`${selectedIndex}-${imageIndex}-${order}`}
                    src={getModalSrc(imageIndex)}
                    alt={images[imageIndex].alt || `Wedding photo ${imageIndex + 1}`}
                    loading='eager'
                    decoding='async'
                    className={
                      nextIndex !== null
                        ? 'h-auto w-1/2 shrink-0'
                        : 'h-auto w-full shrink-0'
                    }
                    draggable={false}
                  />
                ))}
              </div>
            </div>
            <Button
              variant='ghost'
              size='icon'
              className='absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background'
              onClick={handlePrevious}
            >
              <ChevronLeft className='h-6 w-6' />
            </Button>
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background'
              onClick={handleNext}
            >
              <ChevronRight className='h-6 w-6' />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
