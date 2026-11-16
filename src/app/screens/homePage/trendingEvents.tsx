import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useGetEventsQuery } from "../../services/eventsApi";
import { useCheckLikesBatchQuery } from "../../services/likesApi";
import EventCard from "../eventsPage/EventCard";
import { SectionHeader } from "@/libs/components/common/Headers";

export default function TrendingEventsSection() {
  const { data, isLoading, isError } = useGetEventsQuery({
    page: 1,
    limit: 4,
    order: "eventViews",
    direction: "desc",
  });

  const eventIds = useMemo(() => data?.items?.map((e) => e._id) ?? [], [data]);
  const { data: likesData } = useCheckLikesBatchQuery(
    { likeGroup: "EVENT", likeRefIds: eventIds },
    { skip: eventIds.length === 0 },
  );
  const likedSet = useMemo(() => new Set(likesData?.likedRefIds ?? []), [likesData]);

  return (
    <section className="section-y bg-background">
      <div className="content-container">
        <SectionHeader
          eyebrow="Trending"
          title="Most viewed across Seoul."
          lead="From river cleanups to reading clubs: the events people are looking at most."
          action={
            <Link to="/events?order=eventViews" className="btn-pill btn-pill-outline">
              See trending <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        {isLoading ? (
          <div className="text-muted-foreground">Loading events…</div>
        ) : isError ? (
          <div className="text-destructive">Events could not be loaded.</div>
        ) : !data?.items?.length ? (
          <div className="rounded-2xl bg-muted p-8 text-muted-foreground">No events yet.</div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {data.items.map((event) => (
              <EventCard key={event._id} event={event} likedByMe={likedSet.has(event._id)} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
