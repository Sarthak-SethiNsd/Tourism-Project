"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, ImageOff, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type { TourismPlaceImage } from "@/types/tourism";

type PlaceGalleryProps = {
  placeName: string;
  images: TourismPlaceImage[];
};

export function PlaceGallery({ placeName, images }: PlaceGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set());

  const hasMultipleImages = images.length > 1;
  const activeImage = images[activeIndex];
  const activeImageKey = activeImage ? getImageKey(activeImage, activeIndex) : "";
  const activeImageFailed = activeImage ? failedImages.has(activeImageKey) : false;
  const activeImageLoading = activeImage ? loadingImages.has(activeImageKey) : false;

  useEffect(() => {
    setActiveIndex((currentIndex) => Math.min(currentIndex, Math.max(images.length - 1, 0)));
  }, [images.length]);

  useEffect(() => {
    if (!isLightboxOpen || !hasMultipleImages) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((currentIndex) => getPreviousIndex(currentIndex, images.length));
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((currentIndex) => getNextIndex(currentIndex, images.length));
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasMultipleImages, images.length, isLightboxOpen]);

  if (!images.length || !activeImage) {
    return (
      <div className="flex h-56 w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed bg-muted/40 p-6 text-center text-muted-foreground">
        <ImageOff className="size-8 stroke-[1.5]" aria-hidden="true" />
        <p className="text-sm font-medium">No photos available for this destination.</p>
        <p className="text-xs text-muted-foreground/80">Photographs and virtual views will appear here as they are added.</p>
      </div>
    );
  }

  function showPreviousImage() {
    setActiveIndex((currentIndex) => getPreviousIndex(currentIndex, images.length));
  }

  function showNextImage() {
    setActiveIndex((currentIndex) => getNextIndex(currentIndex, images.length));
  }

  function markImageAsFailed(image: TourismPlaceImage, index: number) {
    const key = getImageKey(image, index);
    setFailedImages((current) => new Set(current).add(key));
    setLoadingImages((current) => {
      const updated = new Set(current);
      updated.delete(key);
      return updated;
    });
  }

  function handleImageLoad(image: TourismPlaceImage, index: number) {
    const key = getImageKey(image, index);
    setLoadingImages((current) => {
      const updated = new Set(current);
      updated.delete(key);
      return updated;
    });
  }

  return (
    <div className="space-y-4">
      {/* Main / Hero Gallery Viewer */}
      <div
        className="group relative aspect-[16/10] w-full overflow-hidden rounded-xl border bg-muted shadow-sm focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 sm:aspect-[16/9] lg:aspect-[21/9]"
        tabIndex={0}
        role="region"
        aria-label={`${placeName} photo gallery`}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" && hasMultipleImages) {
            event.preventDefault();
            showPreviousImage();
          } else if (event.key === "ArrowRight" && hasMultipleImages) {
            event.preventDefault();
            showNextImage();
          } else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsLightboxOpen(true);
          }
        }}
        onPointerDown={(event) => {
          event.currentTarget.dataset.swipeStart = String(event.clientX);
        }}
        onPointerUp={(event) => {
          const start = Number(event.currentTarget.dataset.swipeStart);
          const delta = event.clientX - start;
          if (!hasMultipleImages || !Number.isFinite(start) || Math.abs(delta) < 40) return;
          if (delta > 0) showPreviousImage();
          else showNextImage();
        }}
      >
        {activeImageFailed ? (
          <GalleryFallback label="This photograph could not be loaded." />
        ) : (
          <>
            {activeImageLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-muted/60 backdrop-blur-xs">
                <Loader2 className="size-6 animate-spin text-primary" aria-hidden="true" />
              </div>
            )}
            <Image
              src={activeImage.url}
              alt={getAltText(activeImage, placeName, activeIndex)}
              fill
              priority={activeIndex === 0}
              unoptimized={isRemoteImage(activeImage.url)}
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 85vw, 1200px"
              className="object-cover transition-transform duration-300 group-hover:scale-[1.01]"
              onError={() => markImageAsFailed(activeImage, activeIndex)}
              onLoad={() => handleImageLoad(activeImage, activeIndex)}
            />
          </>
        )}

        {/* Overlay Controls and Badges */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4 text-white">
          <div className="flex items-center gap-2">
            {hasMultipleImages && (
              <span className="rounded-md bg-black/60 px-2.5 py-1 text-xs font-semibold backdrop-blur-xs">
                {activeIndex + 1} / {images.length}
              </span>
            )}
            {activeImage.attribution && (
              <span className="hidden truncate text-xs text-white/80 sm:inline-block max-w-[280px] md:max-w-md">
                {activeImage.attribution}
              </span>
            )}
          </div>
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="gap-1.5 bg-white/90 text-foreground shadow-sm hover:bg-white"
            onClick={() => setIsLightboxOpen(true)}
            aria-label={`Open ${getAltText(activeImage, placeName, activeIndex)} in fullscreen view`}
          >
            <Expand className="size-3.5" aria-hidden="true" />
            <span className="text-xs font-medium">Fullscreen</span>
          </Button>
        </div>

        {/* Previous and Next Navigation Buttons for Hero Gallery */}
        {hasMultipleImages && (
          <>
            <GalleryNavigationButton direction="previous" onClick={showPreviousImage} />
            <GalleryNavigationButton direction="next" onClick={showNextImage} />
          </>
        )}
      </div>

      {/* Attribution under hero viewer on small mobile screens */}
      {activeImage.attribution && (
        <p className="px-1 text-xs text-muted-foreground sm:hidden">
          Photo credit: {activeImage.attribution}
        </p>
      )}

      {/* Thumbnails Strip */}
      {hasMultipleImages && (
        <div
          className="flex gap-2.5 overflow-x-auto pb-1 pt-0.5 scrollbar-thin"
          role="tablist"
          aria-label={`${placeName} photo thumbnails`}
        >
          {images.map((image, index) => {
            const key = getImageKey(image, index);
            const imageFailed = failedImages.has(key);
            const isActive = index === activeIndex;

            return (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`gallery-panel-${index}`}
                id={`gallery-tab-${index}`}
                aria-label={`Show photo ${index + 1}: ${getAltText(image, placeName, index)}`}
                className={`group relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 bg-muted transition focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:h-20 sm:w-28 ${
                  isActive
                    ? "border-primary shadow-sm"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
                onClick={() => setActiveIndex(index)}
              >
                {imageFailed ? (
                  <div className="flex h-full w-full items-center justify-center bg-muted">
                    <ImageOff className="size-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                ) : (
                  <Image
                    src={image.url}
                    alt=""
                    fill
                    unoptimized={isRemoteImage(image.url)}
                    sizes="112px"
                    className="object-cover transition duration-200 group-hover:scale-105"
                    onError={() => markImageAsFailed(image, index)}
                  />
                )}
                {isActive && (
                  <span className="absolute inset-x-0 bottom-0 h-1 bg-primary" aria-hidden="true" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Accessible Fullscreen Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent
          className="max-h-[calc(100dvh-1rem)] max-w-[calc(100%-1rem)] overflow-hidden border-none bg-black/95 p-0 text-white sm:max-w-6xl"
          aria-describedby={undefined}
        >
          <DialogTitle className="sr-only">
            {getAltText(activeImage, placeName, activeIndex)}
          </DialogTitle>

          <div
            className="relative flex min-h-[50dvh] items-center justify-center bg-black/95"
            onPointerDown={(event) => {
              event.currentTarget.dataset.swipeStart = String(event.clientX);
            }}
            onPointerUp={(event) => {
              const start = Number(event.currentTarget.dataset.swipeStart);
              const delta = event.clientX - start;
              if (!hasMultipleImages || !Number.isFinite(start) || Math.abs(delta) < 40) return;
              if (delta > 0) showPreviousImage();
              else showNextImage();
            }}
          >
            {activeImageFailed ? (
              <GalleryFallback label="This photograph could not be loaded." />
            ) : (
              <Image
                src={activeImage.url}
                alt={getAltText(activeImage, placeName, activeIndex)}
                width={activeImage.width ?? 1600}
                height={activeImage.height ?? 1000}
                unoptimized={isRemoteImage(activeImage.url)}
                className="max-h-[calc(100dvh-5rem)] w-auto max-w-full object-contain select-none"
                onError={() => markImageAsFailed(activeImage, activeIndex)}
              />
            )}

            {hasMultipleImages && (
              <>
                <GalleryNavigationButton direction="previous" onClick={showPreviousImage} lightbox />
                <GalleryNavigationButton direction="next" onClick={showNextImage} lightbox />
              </>
            )}
          </div>

          {/* Lightbox Footer Bar */}
          <div className="flex flex-col gap-1 px-5 pb-4 pt-1 sm:flex-row sm:items-center sm:justify-between text-xs text-white/80">
            <span className="font-medium text-white/95">
              {hasMultipleImages
                ? `Photo ${activeIndex + 1} of ${images.length}`
                : "Photo 1 of 1"}
            </span>
            {activeImage.attribution && (
              <span className="truncate text-white/70">
                Credit: {activeImage.attribution}
              </span>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function GalleryNavigationButton({
  direction,
  onClick,
  lightbox = false,
}: {
  direction: "previous" | "next";
  onClick: () => void;
  lightbox?: boolean;
}) {
  const isPrevious = direction === "previous";
  const Icon = isPrevious ? ChevronLeft : ChevronRight;

  return (
    <Button
      type="button"
      size="icon"
      variant="secondary"
      className={`absolute top-1/2 z-10 size-10 -translate-y-1/2 rounded-full border border-black/10 transition hover:scale-105 active:scale-95 ${
        isPrevious ? "left-3" : "right-3"
      } ${
        lightbox
          ? "bg-black/60 text-white hover:bg-black/80"
          : "bg-white/85 text-foreground shadow-sm hover:bg-white"
      }`}
      onClick={onClick}
      aria-label={isPrevious ? "View previous photo" : "View next photo"}
    >
      <Icon className="size-5" aria-hidden="true" />
    </Button>
  );
}

function GalleryFallback({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-48 items-center justify-center gap-2.5 px-4 text-center text-sm text-muted-foreground">
      <ImageOff className="size-5 text-muted-foreground/80" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function getPreviousIndex(index: number, length: number) {
  return (index - 1 + length) % length;
}

function getNextIndex(index: number, length: number) {
  return (index + 1) % length;
}

function getImageKey(image: TourismPlaceImage, index: number) {
  return `${image.url}-${image.photoReference ?? index}`;
}

function getAltText(image: TourismPlaceImage, placeName: string, index: number) {
  return image.alt?.trim() || `${placeName} photo ${index + 1}`;
}

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}
