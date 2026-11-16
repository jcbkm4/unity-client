import type { ReactNode } from "react";
import { cn } from "@/libs/utils";

/** Section heading in the MTechLab pattern: mono eyebrow, heavy tight headline, muted lead. */
export function SectionHeader({
  eyebrow,
  title,
  lead,
  action,
  align = "left",
  onDark = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
}) {
  const centered = align === "center";
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 md:mb-12",
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {eyebrow && (
          <span className={cn("eyebrow-pill", onDark && "on-dark")}>{eyebrow}</span>
        )}
        <h2 className={cn("display-lg mt-4", onDark ? "text-white" : "text-foreground")}>{title}</h2>
        {lead && (
          <p className={cn("mt-4 text-base leading-7 md:text-lg", onDark ? "text-white/70" : "text-muted-foreground")}>
            {lead}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

/** Top-of-page header for inner pages (Events, Groups, Articles, ...). */
export function PageHeader({
  eyebrow,
  title,
  lead,
  actions,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-6 border-b border-border pb-10 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="max-w-3xl">
        {eyebrow && <span className="eyebrow-pill">{eyebrow}</span>}
        <h1 className="display-lg mt-4 text-foreground">{title}</h1>
        {lead && <p className="lead mt-4 max-w-2xl">{lead}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </div>
  );
}
