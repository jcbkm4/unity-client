import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useGetEventsQuery, useGetWeeklyPopularEventsQuery } from "../../services/eventsApi";
import { useCheckLikesBatchQuery } from "../../services/likesApi";
import EventCard from "../eventsPage/EventCard";
import { SectionHeader } from "@/libs/components/common/Headers";

export default function PopularEventsSection() {
  const weekly = useGetWeeklyPopularEventsQuery({ days: 7, limit: 4 });
  // Quiet week? Fall back to the most-liked events so the section is never empty.
  const favourites = useGetEventsQuery(
    { page: 1, limit: 4, order: "eventLikes", direction: "desc" },
    { skip: weekly.isLoading || Boolean(weekly.data?.length) },
  );
  const data = weekly.data?.length ? weekly.data : favourites.data?.items;
  const isLoading = weekly.isLoading || favourites.isLoading;
  const isError = weekly.isError && favourites.isError;

  const eventIds = useMemo(() => data?.map((e) => e._id) ?? [], [data]);
  const { data: likesData } = useCheckLikesBatchQuery(
    { likeGroup: "EVENT", likeRefIds: eventIds },
    { skip: eventIds.length === 0 },
  );
  const likedSet = useMemo(() => new Set(likesData?.likedRefIds ?? []), [likesData]);

  return (
    <section className="section-y surface-mist">
      <div className="content-container">
        <SectionHeader
          eyebrow="Popular this week"
          title="Events volunteers are joining now."
          lead="The most-applied events of the last seven days."
          action={
            <Link to="/events" className="btn-pill btn-pill-outline">
              All events <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        {isLoading ? (
          <div className="text-muted-foreground">Loading events…</div>
        ) : isError ? (
          <div className="text-destructive">Events could not be loaded.</div>
        ) : !data?.length ? (
          <div className="rounded-2xl bg-background p-8 text-muted-foreground">No events yet.</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {data.map((event) => (
              <EventCard key={event._id} event={event} likedByMe={likedSet.has(event._id)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
