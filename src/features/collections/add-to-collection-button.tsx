"use client";

import { useState } from "react";
import { BookmarkPlus, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { hasFirebaseConfig } from "@/config/firebase";
import { useAuthUser } from "@/features/authentication/hooks/use-auth-user";
import type { CollectionPlaceInput, PlaceCollection } from "@/features/collections/types";
import { addPlaceToCollection, getCollections } from "@/features/tourism/services/tourism-service";
import { cn } from "@/lib/utils";

export function AddToCollectionButton({ place, className }: { place: CollectionPlaceInput; className?: string }) {
  const { user, isReady } = useAuthUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [collections, setCollections] = useState<PlaceCollection[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  async function handleOpenChange(nextIsOpen: boolean) {
    setIsOpen(nextIsOpen);
    setMessage(null);
    if (!nextIsOpen || (hasFirebaseConfig && !isReady)) return;
    setIsLoading(true);
    try { setCollections(await getCollections(user?.uid)); }
    catch { setMessage("Collections could not be loaded."); }
    finally { setIsLoading(false); }
  }

  async function handleAdd(collectionId: string) {
    setIsAdding(true);
    setMessage(null);
    try { await addPlaceToCollection(user?.uid, collectionId, place); setIsOpen(false); }
    catch { setMessage("Could not add this place to the collection. Please try again."); }
    finally { setIsAdding(false); }
  }

  return <Dialog open={isOpen} onOpenChange={handleOpenChange}>
    <Button type="button" variant="outline" className={cn(className)} disabled={hasFirebaseConfig && !isReady} onClick={() => void handleOpenChange(true)}><BookmarkPlus className="size-4" aria-hidden />Add to Collection</Button>
    <DialogContent><DialogHeader><DialogTitle>Add to a collection</DialogTitle><DialogDescription>Select a collection for {place.placeName}.</DialogDescription></DialogHeader>
      {isLoading ? <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" aria-hidden />Loading collections</div> : collections.length ? <div className="grid gap-2">{collections.map((collection) => <Button key={collection.id} type="button" variant="outline" className="h-auto justify-start px-3 py-3 text-left" disabled={isAdding} onClick={() => void handleAdd(collection.id)}><span className="grid gap-1"><span>{collection.name}</span>{collection.description ? <span className="text-xs font-normal text-muted-foreground">{collection.description}</span> : null}</span></Button>)}</div> : <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">Create a collection from the Collections page before adding places.</p>}
      {message ? <p className="text-sm text-destructive" role="status">{message}</p> : null}
    </DialogContent>
  </Dialog>;
}
