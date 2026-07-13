"use client";

import { Check, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type SharePlaceButtonProps = {
  placeId: string;
  placeName: string;
  address: string;
};

export function SharePlaceButton({ placeId, placeName, address }: SharePlaceButtonProps) {
  const [message, setMessage] = useState<string | null>(null);

  async function handleShare() {
    const url = `${window.location.origin}/place/${encodeURIComponent(placeId)}`;
    const shareData = {
      title: placeName,
      text: `${placeName}\n${address}`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setMessage(null);
      } catch {
        // Dismissing a native share sheet is not an error that needs to interrupt the page.
      }
      return;
    }

    try {
      await copyToClipboard(url);
      setMessage("Place link copied to clipboard.");
    } catch {
      setMessage("Could not copy the place link. Please copy it from the address bar.");
    }
  }

  return (
    <div className="grid gap-2">
      <Button type="button" variant="outline" onClick={handleShare}>
        {message?.startsWith("Place link copied") ? <Check className="size-4" aria-hidden /> : <Share2 className="size-4" aria-hidden />}
        Share place
      </Button>
      {message ? <p className="text-sm text-muted-foreground" role="status">{message}</p> : null}
    </div>
  );
}

async function copyToClipboard(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();

  const didCopy = document.execCommand("copy");
  textArea.remove();

  if (!didCopy) {
    throw new Error("Clipboard copy failed");
  }
}
