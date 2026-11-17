"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

/** Click-to-load YouTube embed: no third-party cookies or heavy iframe until the visitor asks for it. */
export function YouTube({ id, title }: { id: string; title: string }) {
  const [active, setActive] = useState(false);
  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-navy-950 shadow-xl shadow-navy-900/20">
      {active ? (
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setActive(true)}
          className="group absolute inset-0 size-full"
          aria-label={`Play video: ${title}`}
        >
          <Image
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className="object-cover opacity-80 transition-opacity group-hover:opacity-100"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent" />
          <span className="absolute left-1/2 top-1/2 grid size-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand-red text-white shadow-lg transition-transform group-hover:scale-110">
            <Play className="size-7 translate-x-0.5 fill-current" aria-hidden />
          </span>
          <span className="absolute bottom-4 left-4 right-4 text-left font-display text-lg font-semibold text-white">
            {title}
          </span>
        </button>
      )}
    </div>
  );
}
