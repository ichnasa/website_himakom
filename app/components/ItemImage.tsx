"use client";

import { useState } from "react";

interface ItemImageProps {
    src?: string | null;
    alt: string;
    className?: string;
    containerClassName?: string;
    showBadge?: boolean;
    badgeText?: string;
}

export default function ItemImage({
    src,
    alt,
    className = "h-full w-full object-cover",
    containerClassName = "relative w-full overflow-hidden bg-zinc-100",
    showBadge,
    badgeText,
}: ItemImageProps) {
    const [hasError, setHasError] = useState(false);

    const isFallback = !src || hasError;

    return (
        <div className={containerClassName}>
            {isFallback ? (
                <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100/90 p-4 text-center select-none">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-xs border border-zinc-200/70 text-zinc-400 mb-2">
                        <svg
                            className="h-6 w-6 stroke-current"
                            viewBox="0 0 24 24"
                            fill="none"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                            <line x1="12" y1="22.08" x2="12" y2="12" />
                        </svg>
                    </div>
                    <span className="text-[11px] font-medium tracking-wider uppercase text-zinc-400">
                        {badgeText || "Katalog Barang"}
                    </span>
                    <span className="text-[10px] text-zinc-400/80 mt-0.5">
                        Belum ada foto
                    </span>
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    onError={() => setHasError(true)}
                    loading="lazy"
                    className={className}
                />
            )}

            {showBadge && badgeText && !isFallback && (
                <span className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-xs">
                    {badgeText}
                </span>
            )}
        </div>
    );
}
