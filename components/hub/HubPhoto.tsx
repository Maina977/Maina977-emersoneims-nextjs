'use client';

/**
 * HubPhoto
 * --------
 * Renders a Hub manifest photo with two key behaviours:
 *
 *  1. **Graceful fallback.** If the underlying file does not exist yet
 *     (file 404), we render a tasteful gradient + label instead of a
 *     broken image. This means we can ship the wiring before all 18
 *     real photos have been delivered.
 *
 *  2. **Credit caption** rendered under the image, derived from
 *     `hub-photos.ts`. Stock images automatically render as
 *     "Illustrative photo" so we never silently pass off a generic
 *     stock shot as our own work.
 *
 * Uses next/image so files are auto-optimised (AVIF/WebP, responsive
 * srcset, lazy by default).
 */

import Image from 'next/image';
import { useState } from 'react';
import { captionFor, type HubPhoto as HubPhotoData } from './hub-photos';

interface Props {
  photo: HubPhotoData;
  /** Tailwind aspect class. Default 16:9. */
  aspect?: string;
  /** Tailwind rounded class. Default rounded-lg. */
  rounded?: string;
  /** When true, hide the caption (useful for tiny tool-card thumbs). */
  hideCaption?: boolean;
  /** Pass-through className for the wrapper. */
  className?: string;
  /** Forwarded to next/image — true for above-the-fold heroes only. */
  priority?: boolean;
  /** Forwarded to next/image; defaults sensible for cards. */
  sizes?: string;
}

export default function HubPhoto({
  photo,
  aspect = 'aspect-video',
  rounded = 'rounded-lg',
  hideCaption = false,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw',
}: Props) {
  const [errored, setErrored] = useState(false);
  const caption = captionFor(photo);

  return (
    <figure className={className}>
      <div
        className={`relative w-full overflow-hidden ${aspect} ${rounded}`}
        style={{
          // Placeholder gradient sits behind the image and shows through
          // (a) before the image loads and (b) if the image 404s.
          background:
            'linear-gradient(135deg, rgba(0,113,227,0.22) 0%, rgba(76,210,238,0.18) 45%, rgba(201,166,74,0.18) 100%), #0b1220',
        }}
      >
        {!errored && (
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
            onError={() => setErrored(true)}
          />
        )}
        {errored && (
          <div
            className="absolute inset-0 flex items-end p-3"
            aria-hidden="true"
          >
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.18em]"
              style={{ color: 'rgba(255,255,255,0.78)' }}
            >
              Photo coming soon
            </span>
          </div>
        )}
      </div>
      {!hideCaption && (
        <figcaption className="mt-1.5 text-[10px] font-medium uppercase tracking-[0.14em] text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
