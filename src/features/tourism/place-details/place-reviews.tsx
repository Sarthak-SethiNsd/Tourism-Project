"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { TourismPlaceReview } from "@/features/tourism/types";
import { cn } from "@/lib/utils";

type PlaceReviewsProps = {
  reviews?: TourismPlaceReview[];
};

const INITIAL_REVIEW_COUNT = 5;
const MAX_REVIEW_RATING = 5;

export function PlaceReviews({ reviews = [] }: PlaceReviewsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleReviews = isExpanded ? reviews : reviews.slice(0, INITIAL_REVIEW_COUNT);
  const hasMoreReviews = reviews.length > INITIAL_REVIEW_COUNT;

  return (
    <section className="space-y-4">
      <SectionHeader eyebrow="Reviews" title="Google reviews" />
      {reviews.length ? (
        <div className="grid gap-4">
          {visibleReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {hasMoreReviews && !isExpanded ? (
            <Button type="button" variant="outline" className="w-fit" onClick={() => setIsExpanded(true)}>
              Show More Reviews
            </Button>
          ) : null}
        </div>
      ) : (
        <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed bg-card p-6 text-center">
          <p className="text-sm font-medium text-muted-foreground">No reviews available.</p>
        </div>
      )}
    </section>
  );
}

function ReviewCard({ review }: { review: TourismPlaceReview }) {
  return (
    <Card className="border-primary/10 shadow-sm">
      <CardContent className="grid gap-4 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <Avatar size="lg">
            {review.reviewerProfilePhotoUrl ? (
              <AvatarImage src={review.reviewerProfilePhotoUrl} alt={review.reviewerName} />
            ) : null}
            <AvatarFallback>{getReviewerInitial(review.reviewerName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <h3 className="font-semibold tracking-tight">{review.reviewerName}</h3>
              {review.relativePublishTimeDescription ? (
                <p className="text-sm text-muted-foreground">{review.relativePublishTimeDescription}</p>
              ) : null}
            </div>
            <StarRating rating={review.rating} />
          </div>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{review.text}</p>
      </CardContent>
    </Card>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="mt-2 flex items-center gap-1" aria-label={`${rating} out of ${MAX_REVIEW_RATING} stars`}>
      {Array.from({ length: MAX_REVIEW_RATING }, (_, index) => {
        const isFilled = index < Math.round(rating);

        return (
          <Star
            key={index}
            className={cn("size-4", isFilled ? "fill-primary text-primary" : "text-muted-foreground/40")}
            aria-hidden
          />
        );
      })}
    </div>
  );
}

function getReviewerInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "?";
}
