import type { ReactNode } from "react";
import { BadgeCheck } from "lucide-react";

/** Two-column auth layout: form on the left, a forest photo panel on the right (MTechLab style). */
export default function AuthShell({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <div className="grid overflow-hidden rounded-[32px] bg-card ring-1 ring-border lg:grid-cols-[1.05fr_1fr]">
      <div className="px-6 py-12 sm:px-12 md:py-16 lg:px-16">
        <span className="eyebrow-pill">{eyebrow}</span>
        <h1 className="display-lg mt-5 text-foreground">{title}</h1>
        <p className="lead mt-4 max-w-md">{lead}</p>
        <div className="mt-10 max-w-md">{children}</div>
      </div>

      <div className="relative isolate hidden min-h-[560px] overflow-hidden bg-forest text-white lg:block">
        <img
          src="/uploads/images/volunteers/02.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[rgba(12,26,19,0.92)] via-[rgba(12,26,19,0.45)] to-[rgba(12,26,19,0.15)]" />
        <div className="absolute inset-x-10 bottom-10">
          <span className="eyebrow-pill on-dark">Volunteer with confidence</span>
          <p className="mt-5 text-2xl font-bold leading-snug tracking-tight">
            Every organizer on Unity is reviewed before their first event goes live.
          </p>
          <div className="mt-5 flex items-center gap-2 text-sm text-white/75">
            <BadgeCheck className="h-4 w-4 text-lime" /> Verified organizations only
          </div>
        </div>
      </div>
    </div>
  );
}

export const fieldLabel = "mb-2 block text-sm font-semibold text-foreground";
export const fieldInput =
  "h-12 w-full rounded-xl bg-background px-4 text-[15px] text-foreground ring-1 ring-border outline-none transition-shadow placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";
