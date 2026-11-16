import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, BadgeCheck, CalendarDays, Eye } from "lucide-react";

import { useGetTopOrganizersQuery } from "../../services/organizersApi";
import { memberImageUrlFromFilename } from "../../../libs/shared/ui";
import { SectionHeader } from "@/libs/components/common/Headers";

export default function TopOrganizersSection() {
  const { data, isLoading, isError } = useGetTopOrganizersQuery({ limit: 4 });

  return (
    <section className="section-y surface-sage">
      <div className="content-container">
        <SectionHeader
          eyebrow="Verified organizers"
          title="The teams behind the events."
          lead="Every organizer on Unity is reviewed before their first event goes live."
          action={
            <Link to="/organizers" className="btn-pill btn-pill-outline">
              All organizers <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />

        {isLoading ? (
          <div className="text-muted-foreground">Loading organizers…</div>
        ) : isError ? (
          <div className="text-destructive">Organizers could not be loaded.</div>
        ) : !data?.length ? (
          <div className="rounded-2xl bg-background p-8 text-muted-foreground">No organizers yet.</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.map((org) => {
              const avatar = memberImageUrlFromFilename(org.memberImage, org.memberNick);
              const events = org.eventsOrganizedCount ?? org.eventsCount ?? 0;
              return (
                <Link
                  key={org._id}
                  to={`/organizers/${org._id}`}
                  className="group flex h-full flex-col rounded-2xl bg-background p-6 ring-1 ring-border transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-start justify-between">
                    <img
                      src={avatar}
                      alt={org.memberNick}
                      className="h-14 w-14 rounded-full bg-muted object-cover ring-1 ring-border"
                    />
                    <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  <div className="mt-6 text-lg font-bold tracking-tight text-foreground">{org.memberNick}</div>
                  {org.isVerified && (
                    <span className="mt-2 inline-flex w-fit items-center gap-1 text-xs font-semibold text-olive dark:text-lime">
                      <BadgeCheck className="h-4 w-4" /> Verified organizer
                    </span>
                  )}
                  {org.memberDesc && (
                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">{org.memberDesc}</p>
                  )}
                  <div className="mt-auto flex items-center gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-4 w-4" /> {events} events
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Eye className="h-4 w-4" /> {org.eventsViewsTotal ?? 0}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
