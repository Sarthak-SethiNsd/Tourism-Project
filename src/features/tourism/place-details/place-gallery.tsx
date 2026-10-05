"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Expand, ImageOff } from "lucide-react";
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
  const hasMultipleImages = images.length > 1;
  const activeImage = images[activeIndex];
  const activeImageFailed = activeImage ? failedImages.has(getImageKey(activeImage, activeIndex)) : false;

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

  if (!activeImage) {
    return <GalleryFallback label="No photos available for this destination." />;
  }

  function showPreviousImage() {
    setActiveIndex((currentIndex) => getPreviousIndex(currentIndex, images.length));
  }

  function showNextImage() {
    setActiveIndex((currentIndex) => getNextIndex(currentIndex, images.length));
  }

  function markImageAsFailed(image: TourismPlaceImage, index: number) {
    setFailedImages((currentImages) => new Set(currentImages).add(getImageKey(image, index)));
  }

  return (
    <div className="space-y-3">
      <div
        className="relative aspect-[16/10] overflow-hidden rounded-lg border bg-muted shadow-sm"
        onPointerDown={(event) => {
          event.currentTarget.dataset.swipeStart = String(event.clientX);
        }}
        onPointerUp={(event) => {
          const start = Number(event.currentTarget.dataset.swipeStart);
          const delta = event.clientX - start;
          if (!hasMultipleImages || !Number.isFinite(start) || Math.abs(delta) < 40) return;
          if (delta > 0) showPreviousImage(); else showNextImage();
        }}
      >
        {activeImageFailed ? (
          <GalleryFallback label="This photo could not be loaded." />
        ) : (
          <Image
            src={activeImage.url}
            alt={getAltText(activeImage, placeName, activeIndex)}
            fill
            priority
            unoptimized={isRemoteImage(activeImage.url)}
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 75vw, 960px"
            className="object-cover"
            onError={() => markImageAsFailed(activeImage, activeIndex)}
          />
        )}

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 bg-gradient-to-t from-black/70 to-transparent p-3 text-white">
          {hasMultipleImages ? <span className="rounded-md bg-black/45 px-2 py-1 text-xs font-medium">{activeIndex + 1} / {images.length}</span> : <span />}
          <Button type="button" size="icon" variant="secondary" className="size-9 bg-white/90 text-foreground hover:bg-white" onClick={() => setIsLightboxOpen(true)} aria-label={`View ${getAltText(activeImage, placeName, activeIndex)} fullscreen`}>
            <Expand className="size-4" aria-hidden />
          </Button>
        </div>

        {hasMultipleImages ? (
          <>
            <GalleryNavigationButton direction="previous" onClick={showPreviousImage} />
            <GalleryNavigationButton direction="next" onClick={showNextImage} />
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Gallery thumbnails">
          {images.map((image, index) => {
            const imageFailed = failedImages.has(getImageKey(image, index));
            const isActive = index === activeIndex;
            return (
              <button
                key={getImageKey(image, index)}
                type="button"
                className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-md border-2 bg-muted outline-none transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${isActive ? "border-primary" : "border-transparent opacity-75 hover:opacity-100"}`}
                aria-label={`Show ${getAltText(image, placeName, index)}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => setActiveIndex(index)}
              >
                {imageFailed ? <ImageOff className="mx-auto size-4 text-muted-foreground" aria-hidden /> : <Image src={image.url} alt="" fill unoptimized={isRemoteImage(image.url)} sizes="80px" className="object-cover" onError={() => markImageAsFailed(image, index)} />}
              </button>
            );
          })}
        </div>
      ) : null}

      {activeImage.attribution ? <p className="text-xs text-muted-foreground">{activeImage.attribution}</p> : null}

      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-h-[calc(100dvh-1rem)] max-w-[calc(100%-1rem)] overflow-hidden bg-black p-0 text-white sm:max-w-6xl" aria-describedby={undefined}>
          <DialogTitle className="sr-only">{getAltText(activeImage, placeName, activeIndex)}</DialogTitle>
          <div className="relative flex min-h-[50dvh] items-center justify-center bg-black" onPointerDown={(event) => { event.currentTarget.dataset.swipeStart = String(event.clientX); }} onPointerUp={(event) => { const start = Number(event.currentTarget.dataset.swipeStart); const delta = event.clientX - start; if (!hasMultipleImages || !Number.isFinite(start) || Math.abs(delta) < 40) return; if (delta > 0) showPreviousImage(); else showNextImage(); }}>
            {activeImageFailed ? <GalleryFallback label="This photo could not be loaded." /> : <Image src={activeImage.url} alt={getAltText(activeImage, placeName, activeIndex)} width={activeImage.width ?? 1600} height={activeImage.height ?? 1000} unoptimized={isRemoteImage(activeImage.url)} className="max-h-[calc(100dvh-4rem)] w-auto max-w-full object-contain" onError={() => markImageAsFailed(activeImage, activeIndex)} />}
            {hasMultipleImages ? <><GalleryNavigationButton direction="previous" onClick={showPreviousImage} lightbox /><GalleryNavigationButton direction="next" onClick={showNextImage} lightbox /></> : null}
          </div>
          <div className="flex items-center justify-between gap-3 px-4 pb-4 text-sm text-white/80">
            <span>{hasMultipleImages ? `${activeIndex + 1} / ${images.length}` : "Photo"}</span>
            {activeImage.attribution ? <span className="truncate">{activeImage.attribution}</span> : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function GalleryNavigationButton({ direction, onClick, lightbox = false }: { direction: "previous" | "next"; onClick: () => void; lightbox?: boolean }) {
  const isPrevious = direction === "previous";
  const Icon = isPrevious ? ChevronLeft : ChevronRight;
  return <Button type="button" size="icon" variant="secondary" className={`absolute top-1/2 z-10 size-10 -translate-y-1/2 bg-white/90 text-foreground hover:bg-white ${isPrevious ? "left-3" : "right-3"} ${lightbox ? "bg-black/55 text-white hover:bg-black/75" : ""}`} onClick={onClick} aria-label={isPrevious ? "Previous photo" : "Next photo"}><Icon className="size-5" aria-hidden /></Button>;
}

function GalleryFallback({ label }: { label: string }) {
  return <div className="flex h-full min-h-44 items-center justify-center gap-2 px-4 text-center text-sm text-muted-foreground"><ImageOff className="size-5" aria-hidden />{label}</div>;
}

function getPreviousIndex(index: number, length: number) { return (index - 1 + length) % length; }
function getNextIndex(index: number, length: number) { return (index + 1) % length; }
function getImageKey(image: TourismPlaceImage, index: number) { return `${image.url}-${image.photoReference ?? index}`; }
function getAltText(image: TourismPlaceImage, placeName: string, index: number) { return image.alt?.trim() || `${placeName} photo ${index + 1}`; }
function isRemoteImage(src: string) { return src.startsWith("http://") || src.startsWith("https://"); }
