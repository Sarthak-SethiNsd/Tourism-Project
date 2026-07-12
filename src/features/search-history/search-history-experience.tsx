"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { History, LoaderCircle, MapPin, Trash2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { SectionHeader } from "@/components/shared/section-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { hasFirebaseConfig } from "@/config/firebase";
import { signInWithGoogle } from "@/features/authentication/services/authentication-service";
import { useAuthUser } from "@/features/authentication/hooks/use-auth-user";
import type { SearchHistoryEntry } from "@/features/search-history/types";
import {
  clearSearchHistory,
  deleteSearchHistoryEntry,
  getSearchHistory,
} from "@/features/tourism/services/tourism-service";
import { ComparePlaceButton } from "@/features/compare-places/compare-place-button";

export function SearchHistoryExperience() {
  const { user, isReady } = useAuthUser();
  const [historyEntries, setHistoryEntries] = useState<SearchHistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
  const [deletingEntryId, setDeletingEntryId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadSearchHistory() {
      setErrorMessage(null);

      if (!hasFirebaseConfig || !isReady || !user) {
        setHistoryEntries([]);
        setIsLoading(!isReady);
        return;
      }

      setIsLoading(true);

      try {
        const entries = await getSearchHistory(user.uid);

        if (isActive) {
          setHistoryEntries(entries);
        }
      } catch {
        if (isActive) {
          setErrorMessage("Search history could not be loaded.");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    }

    void loadSearchHistory();

    return () => {
      isActive = false;
    };
  }, [isReady, user]);

  async function handleSignIn() {
    if (!hasFirebaseConfig) {
      setErrorMessage("Firebase is not configured for search history.");
      return;
    }

    setErrorMessage(null);
    setIsLoading(true);

    try {
      await signInWithGoogle();
    } catch {
      setErrorMessage("Sign in was not completed.");
      setIsLoading(false);
    }
  }

  async function handleDelete(entryId: string) {
    if (!user) {
      return;
    }

    const previousEntries = historyEntries;

    setDeletingEntryId(entryId);
    setHistoryEntries((entries) => entries.filter((entry) => entry.id !== entryId));
    setErrorMessage(null);

    try {
      await deleteSearchHistoryEntry(user.uid, entryId);
    } catch {
      setHistoryEntries(previousEntries);
      setErrorMessage("Could not delete that history entry. Please try again.");
    } finally {
      setDeletingEntryId(null);
    }
  }

  async function handleClear() {
    if (!user || !historyEntries.length) {
      return;
    }

    const previousEntries = historyEntries;

    setIsClearing(true);
    setHistoryEntries([]);
    setErrorMessage(null);

    try {
      await clearSearchHistory(user.uid);
    } catch {
      setHistoryEntries(previousEntries);
      setErrorMessage("Could not clear search history. Please try again.");
    } finally {
      setIsClearing(false);
    }
  }

  return (
    <AppShell>
      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-8 pt-24 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeader
            eyebrow="History"
            title="Search history"
            description="Places you opened from successful Explore searches, listed from newest to oldest."
          />
          {user && historyEntries.length ? (
            <Button type="button" variant="outline" className="w-fit" disabled={isClearing} onClick={handleClear}>
              {isClearing ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Trash2 className="size-4" aria-hidden />}
              Clear History
            </Button>
          ) : null}
        </div>

        {errorMessage ? <ErrorState title="Search history error" description={errorMessage} /> : null}

        {renderContent({
          deletingEntryId,
          historyEntries,
          isClearing,
          isLoading,
          isReady,
          onDelete: handleDelete,
          onSignIn: handleSignIn,
          userId: user?.uid,
        })}
      </main>
    </AppShell>
  );
}

function renderContent({
  deletingEntryId,
  historyEntries,
  isClearing,
  isLoading,
  isReady,
  onDelete,
  onSignIn,
  userId,
}: {
  deletingEntryId: string | null;
  historyEntries: SearchHistoryEntry[];
  isClearing: boolean;
  isLoading: boolean;
  isReady: boolean;
  onDelete: (entryId: string) => void;
  onSignIn: () => void;
  userId?: string;
}) {
  if (!isReady || isLoading) {
    return <LoadingState label="Loading search history" />;
  }

  if (!userId) {
    return (
      <div className="grid gap-4">
        <EmptyState title="Sign in to see search history" description="Your search history is connected to your account." />
        <Button type="button" className="w-fit" onClick={onSignIn}>
          Sign in with Google
        </Button>
      </div>
    );
  }

  if (!historyEntries.length) {
    return <EmptyState title="No search history yet" description="Search for a place in Explore and open a result to add it here." />;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {historyEntries.map((entry) => (
        <SearchHistoryCard
          key={entry.id}
          entry={entry}
          isDeleting={deletingEntryId === entry.id || isClearing}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

function SearchHistoryCard({
  entry,
  isDeleting,
  onDelete,
}: {
  entry: SearchHistoryEntry;
  isDeleting: boolean;
  onDelete: (entryId: string) => void;
}) {
  return (
    <Card className="overflow-hidden border-primary/10 shadow-sm">
      <Link href={`/place/${entry.placeId}`} className="block">
        <div className="relative aspect-[16/10] bg-muted">
          {entry.thumbnailUrl ? (
            <Image
              src={entry.thumbnailUrl}
              alt={entry.placeName}
              fill
              unoptimized={isRemoteImage(entry.thumbnailUrl)}
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <History className="size-8" aria-hidden />
            </div>
          )}
        </div>
      </Link>
      <CardContent className="grid gap-4 p-4">
        <div className="grid gap-2">
          <div className="flex flex-wrap gap-2">
            {entry.primaryCategory ? <Badge variant="secondary">{entry.primaryCategory}</Badge> : null}
            <Badge variant="outline">{entry.country}</Badge>
          </div>
          <Link href={`/place/${entry.placeId}`} className="text-lg font-semibold tracking-tight hover:underline">
            {entry.placeName}
          </Link>
          <p className="flex items-start gap-2 text-sm leading-6 text-muted-foreground">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden />
            {formatLocation(entry)}
          </p>
          <p className="text-xs font-medium text-muted-foreground">Searched {formatSearchDate(entry.searchedAt)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            disabled={isDeleting}
            onClick={() => onDelete(entry.id)}
          >
            {isDeleting ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Trash2 className="size-4" aria-hidden />}
            Delete
          </Button>
          <ComparePlaceButton placeId={entry.placeId} className="w-fit" />
        </div>
      </CardContent>
    </Card>
  );
}

function formatLocation(entry: SearchHistoryEntry) {
  return [entry.district, entry.state, entry.country].filter(Boolean).join(", ");
}

function formatSearchDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function isRemoteImage(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}
