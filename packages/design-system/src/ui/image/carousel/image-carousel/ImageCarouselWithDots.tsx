'use client';

import { useEffect, useState } from 'react';
import type { ImageCarouselProps } from './ImageCarousel';
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '../base/Carousel';
import { cn } from '@konkuk-icteam-fe/design-system/cn';
import { IconEllipse } from '@konkuk-icteam-fe/design-system/assets';

export default function ImageCarouselWithDots({
  images,
  initialIndex,
  className,
  ...props
}: ImageCarouselProps) {
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex ?? 0);
  const [imageMetaMap, setImageMetaMap] = useState<Record<string, { isLandscape: boolean }>>({});

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>, src: string) => {
    const target = e.target as HTMLImageElement;

    target
      .decode()
      .then(() => {
        const isLandscape = target.naturalWidth > target.naturalHeight;
        setImageMetaMap((prev) => ({ ...prev, [src]: { isLandscape } }));
      })
      .catch((err) => {
        console.error(`이미지(${src}) 디코딩 실패:`, err);
        setImageMetaMap((prev) => ({ ...prev, [src]: { isLandscape: false } }));
      });
  };

  useEffect(() => {
    if (!api) return;

    const onSelect = () => setSelectedIndex(api.selectedScrollSnap());
    onSelect();

    api.on('select', onSelect);
    api.on('reInit', onSelect);
    return () => {
      api.off('select', onSelect);
      api.off('reInit', onSelect);
    };
  }, [api]);

  return (
    <div className={cn('relative aspect-[3/4] w-full overflow-hidden', className)} {...props}>
      <Carousel setApi={setApi} opts={{ startIndex: initialIndex }}>
        <CarouselContent>
          {images.map((img, idx) => (
            <CarouselItem key={`${img.src}-${idx}`}>
              <div
                className={cn(
                  'relative aspect-[3/4] w-full overflow-hidden',
                  imageMetaMap[img.src]?.isLandscape ? 'bg-black' : 'bg-gray-50',
                )}
              >
                <img
                  src={img.src}
                  alt={img.alt ?? `image-${img.src}`}
                  className={cn(
                    'absolute inset-0 h-full w-full',
                    imageMetaMap[img.src] ? 'opacity-100' : 'opacity-0',
                    imageMetaMap[img.src]?.isLandscape ? 'object-contain' : 'object-cover',
                  )}
                  onLoad={(e) => handleImageLoad(e, img.src)}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className='absolute bottom-[1.8rem] z-10 flex w-full flex-col items-center gap-[0.4rem] px-[1.2rem]'>
        <div className='flex w-full items-center justify-center gap-[0.6rem]'>
          {images.map((img, i) => {
            const active = i === selectedIndex;
            return (
              <button
                key={`${img.src}-${i}`}
                type='button'
                aria-label={`${i + 1}번째 이미지로 이동`}
                aria-current={active}
                onClick={() => api?.scrollTo(i)}
                className='cursor-pointer'
              >
                <IconEllipse
                  aria-hidden='true'
                  className={active ? 'text-black-1' : 'text-gray-400'}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
