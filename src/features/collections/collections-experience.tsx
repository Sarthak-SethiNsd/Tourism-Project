"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, FolderOpen, LoaderCircle, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingState } from "@/components/shared/loading-state";
import { SectionHeader } from "@/components/shared/section-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { hasFirebaseConfig } from "@/config/firebase";
import { useAuthUser } from "@/features/authentication/hooks/use-auth-user";
import type { CollectionInput, CollectionPlace, PlaceCollection } from "@/features/collections/types";
import { createCollection, deleteCollection, getCollections, removePlaceFromCollection, renameCollection } from "@/features/tourism/services/tourism-service";

const emptyForm: CollectionInput = { name: "", description: "" };

export function CollectionsExperience() {
  const { user, isReady } = useAuthUser();
  const [collections, setCollections] = useState<PlaceCollection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string | null>(null);
  const [form, setForm] = useState<CollectionInput>(emptyForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [busyCollectionId, setBusyCollectionId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadCollections = useCallback(async () => {
    if (hasFirebaseConfig && !isReady) return;
    setIsLoading(true); setErrorMessage(null);
    try { setCollections(await getCollections(user?.uid)); }
    catch { setErrorMessage("Collections could not be loaded."); }
    finally { setIsLoading(false); }
  }, [isReady, user?.uid]);

  useEffect(() => { void loadCollections(); }, [loadCollections]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setIsCreating(true); setErrorMessage(null);
    try { await createCollection(user?.uid, { name: form.name.trim(), description: form.description?.trim() || undefined }); setForm(emptyForm); await loadCollections(); }
    catch { setErrorMessage("Could not create this collection. Please try again."); }
    finally { setIsCreating(false); }
  }

  async function handleDelete(collectionId: string) {
    const previousCollections = collections; setBusyCollectionId(collectionId); setCollections((items) => items.filter((item) => item.id !== collectionId)); setSelectedCollectionId(null);
    try { await deleteCollection(user?.uid, collectionId); }
    catch { setCollections(previousCollections); setErrorMessage("Could not delete this collection. Please try again."); }
    finally { setBusyCollectionId(null); }
  }

  async function handleRename(collection: PlaceCollection, input: CollectionInput) {
    const previousCollections = collections; setBusyCollectionId(collection.id); setCollections((items) => items.map((item) => item.id === collection.id ? { ...item, ...input } : item));
    try { await renameCollection(user?.uid, collection.id, input); }
    catch { setCollections(previousCollections); setErrorMessage("Could not rename this collection. Please try again."); }
    finally { setBusyCollectionId(null); }
  }

  async function handleRemovePlace(collection: PlaceCollection, places: CollectionPlace[]) {
    const previousCollections = collections; setBusyCollectionId(collection.id); setCollections((items) => items.map((item) => item.id === collection.id ? { ...item, places } : item));
    try { await removePlaceFromCollection(user?.uid, collection.id, places); }
    catch { setCollections(previousCollections); setErrorMessage("Could not remove this place. Please try again."); }
    finally { setBusyCollectionId(null); }
  }

  const selectedCollection = collections.find((collection) => collection.id === selectedCollectionId);
  return <AppShell><main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-8 pt-24 sm:px-8 lg:px-12">
    {errorMessage ? <ErrorState title="Collections error" description={errorMessage} /> : null}
    {selectedCollection ? <CollectionDetail collection={selectedCollection} isBusy={busyCollectionId === selectedCollection.id} onBack={() => setSelectedCollectionId(null)} onDelete={handleDelete} onRename={handleRename} onRemovePlace={handleRemovePlace} /> : <>
      <SectionHeader eyebrow="Collections" title="Your place collections" description="Group places for any kind of trip or travel idea." />
      <CreateCollectionForm form={form} isCreating={isCreating} onChange={setForm} onSubmit={handleCreate} />
      {isLoading ? <LoadingState label="Loading collections" /> : collections.length ? <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{collections.map((collection) => <CollectionCard key={collection.id} collection={collection} onOpen={() => setSelectedCollectionId(collection.id)} />)}</div> : <EmptyState title="No collections yet" description="Create a collection, then add places from Explore, Saved Places, Recently Viewed, or Place Details." />}
    </>}
  </main></AppShell>;
}

function CreateCollectionForm({ form, isCreating, onChange, onSubmit }: { form: CollectionInput; isCreating: boolean; onChange: (input: CollectionInput) => void; onSubmit: (event: FormEvent<HTMLFormElement>) => void }) {
  return <Card className="border-primary/10 shadow-sm"><CardContent className="p-5"><form className="grid gap-4" onSubmit={onSubmit}><div className="grid gap-4 sm:grid-cols-2"><label className="grid gap-2 text-sm font-medium">Collection name<Input required value={form.name} onChange={(event) => onChange({ ...form, name: event.target.value })} /></label><label className="grid gap-2 text-sm font-medium">Description (optional)<Textarea value={form.description} onChange={(event) => onChange({ ...form, description: event.target.value })} /></label></div><Button type="submit" className="w-fit" disabled={isCreating}>{isCreating ? <LoaderCircle className="size-4 animate-spin" aria-hidden /> : <Plus className="size-4" aria-hidden />}Create collection</Button></form></CardContent></Card>;
}

function CollectionCard({ collection, onOpen }: { collection: PlaceCollection; onOpen: () => void }) {
  return <Card className="border-primary/10 shadow-sm"><CardContent className="grid gap-4 p-5"><div><FolderOpen className="size-6 text-primary" aria-hidden /><h2 className="mt-4 text-xl font-semibold">{collection.name}</h2>{collection.description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{collection.description}</p> : null}<p className="mt-3 text-xs text-muted-foreground">Created {formatDate(collection.createdAt)} · {collection.places.length} place{collection.places.length === 1 ? "" : "s"}</p></div><Button type="button" variant="outline" className="w-fit" onClick={onOpen}>Open collection</Button></CardContent></Card>;
}

function CollectionDetail({ collection, isBusy, onBack, onDelete, onRename, onRemovePlace }: { collection: PlaceCollection; isBusy: boolean; onBack: () => void; onDelete: (id: string) => void; onRename: (collection: PlaceCollection, input: CollectionInput) => void; onRemovePlace: (collection: PlaceCollection, places: CollectionPlace[]) => void }) {
  const [isEditing, setIsEditing] = useState(false); const [name, setName] = useState(collection.name); const [description, setDescription] = useState(collection.description ?? "");
  function submitRename(event: FormEvent<HTMLFormElement>) { event.preventDefault(); onRename(collection, { name: name.trim(), description: description.trim() || undefined }); setIsEditing(false); }
  return <><Button type="button" variant="ghost" className="w-fit" onClick={onBack}><ArrowLeft className="size-4" aria-hidden />All collections</Button><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div>{isEditing ? <form className="grid gap-3" onSubmit={submitRename}><Input required value={name} onChange={(event) => setName(event.target.value)} /><Textarea value={description} onChange={(event) => setDescription(event.target.value)} /><div className="flex gap-2"><Button type="submit" disabled={isBusy}>Save changes</Button><Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button></div></form> : <><h1 className="text-3xl font-semibold tracking-tight">{collection.name}</h1>{collection.description ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{collection.description}</p> : null}<p className="mt-2 text-xs text-muted-foreground">Created {formatDate(collection.createdAt)}</p></>}</div><div className="flex flex-wrap gap-2"><Button type="button" variant="outline" disabled={isBusy} onClick={() => setIsEditing(true)}><Pencil className="size-4" aria-hidden />Rename</Button><Button type="button" variant="destructive" disabled={isBusy} onClick={() => onDelete(collection.id)}><Trash2 className="size-4" aria-hidden />Delete collection</Button></div></div>
    {collection.places.length ? <div className="grid gap-3">{collection.places.map((place) => <div key={place.placeId} className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"><div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-muted sm:w-24">{place.thumbnailUrl ? <Image src={place.thumbnailUrl} alt={place.placeName} fill unoptimized={isRemoteImage(place.thumbnailUrl)} sizes="96px" className="object-cover" /> : null}</div><div className="min-w-0 flex-1"><Link href={`/place/${place.placeId}`} className="font-medium hover:underline">{place.placeName}</Link><p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground"><MapPin className="size-4" aria-hidden />{[place.district, place.state].filter(Boolean).join(", ") || "Location not available"}</p></div><Button type="button" variant="outline" disabled={isBusy} onClick={() => onRemovePlace(collection, collection.places.filter((item) => item.placeId !== place.placeId))}><Trash2 className="size-4" aria-hidden />Remove</Button></div>)}</div> : <EmptyState title="No places in this collection" description="Use Add to Collection from any supported place surface." />}
  </>;
}

function formatDate(date: Date) { return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date); }
function isRemoteImage(src: string) { return src.startsWith("http://") || src.startsWith("https://"); }
