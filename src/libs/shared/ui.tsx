import React from "react";

export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);
}

export function imageUrlFromFilename(filename?: string): string | undefined {
  if (!filename) return undefined;
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }
  return `/uploads/events/${filename}`;
}

export function uploadUrlFromFilename(
  folder: string,
  filename?: string,
): string | undefined {
  if (!filename) return undefined;
  if (filename.startsWith("http://") || filename.startsWith("https://")) {
    return filename;
  }
  return `/uploads/${folder}/${filename}`;
}

// Explicit helpers for clarity in components
export function memberImageUrlFromFilename(
  filename?: string,
  fallbackName?: string,
): string | undefined {
  if (filename) {
    return uploadUrlFromFilename("members", filename);
  }
  // Use Dicebear API for default avatar when no image
  if (fallbackName) {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fallbackName)}`;
  }
  return undefined;
}

export function eventImageUrlFromFilename(
  filename?: string,
): string | undefined {
  return uploadUrlFromFilename("events", filename);
}

export function clampText(text: string, max = 160): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max).trim()}…`;
}

export function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">{title}</h2>
      {description ? <p className="mt-2 max-w-2xl text-[15px] leading-7 text-muted-foreground">{description}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function Card({ children }: { children: React.ReactNode }) {
  return <div className="h-full rounded-2xl bg-card p-5 ring-1 ring-border transition-shadow hover:shadow-md">{children}</div>;
}
