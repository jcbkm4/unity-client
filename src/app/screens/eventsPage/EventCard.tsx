import { useEffect, useState, memo } from "react";
import type { CSSProperties } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Eye, Heart, MapPin, Share2, Users } from "lucide-react";

import type { EventDto } from "../../services/eventsApi";
import { useToggleLikeMutation } from "../../services/likesApi";
import { useCheckAuthQuery } from "../../services/authApi";
import { eventImageUrlFromFilename } from "../../../libs/shared/ui";
import { AlertDialog } from "../../../libs/components/ui/alert-dialog";
import { useToast } from "../../../libs/components/ui/toast";

function clampStyle(lines: number): CSSProperties {
  return {
    display: "-webkit-box",
    WebkitLineClamp: lines,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  };
}

function isUpcoming(dateValue: string): boolean {
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return false;
  return date.getTime() > Date.now();
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const datePart = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(date);

  const timePart = new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  return `${datePart}, ${timePart}`;
}

function EventCard({
  event,
  likedByMe,
}: {
  event: EventDto;
  likedByMe?: boolean;
}) {
  const navigate = useNavigate();
  const [toggleLike, toggleState] = useToggleLikeMutation();
  const { data: authData } = useCheckAuthQuery();
  const isAuthenticated = Boolean(authData?.member?._id);
  const { showToast } = useToast();
  const img = eventImageUrlFromFilename(event.eventImages?.[0]);
  const upcoming = isUpcoming(event.eventDate || "");

  const [likesCount, setLikesCount] = useState<number>(event.eventLikes || 0);
  const [liked, setLiked] = useState<boolean>(Boolean(likedByMe));
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  useEffect(() => {
    setLiked(Boolean(likedByMe));
  }, [event._id, likedByMe]);

  useEffect(() => {
    setLikesCount(event.eventLikes || 0);
  }, [event.eventLikes]);

  const pointLabel = event.eventPoints ? `+${event.eventPoints} pts` : "Volunteer";

  const handleLikeToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }

    try {
      const newLiked = !liked;
      setLiked(newLiked);
      setLikesCount((prev) => Math.max(0, prev + (newLiked ? 1 : -1)));

      const res = await toggleLike({
        likeGroup: "EVENT",
        likeRefId: event._id,
      }).unwrap();

      const confirmed = res.status === "liked";
      setLiked(confirmed);

      if (confirmed !== newLiked) {
        setLikesCount((prev) => Math.max(0, prev + (confirmed ? 1 : -1)));
      }

      showToast(
        confirmed
          ? "Event added to your favorites!"
          : "Event removed from your favorites!",
      );
    } catch (err: any) {
      setLiked(!liked);
      setLikesCount((prev) => Math.max(0, prev + (liked ? 1 : -1)));

      const status = err?.status;
      if (status === 401 || status === 403) {
        navigate("/login");
      } else {
        showToast("Failed to update favorite. Please try again.", "error");
      }
    }
  };

  return (
    <>
      <Link to={`/events/${event._id}`} className="group block h-full">
        <article className="flex h-full flex-col overflow-hidden rounded-2xl bg-card text-foreground ring-1 ring-border transition-shadow duration-300 hover:shadow-lg">
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            {img ? (
              <img
                src={img}
                alt={event.eventTitle}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Users className="h-10 w-10 text-muted-foreground/60" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            <span
              className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold backdrop-blur ${
                upcoming ? "bg-white/95 text-ink" : "bg-ink/80 text-white"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${upcoming ? "bg-olive" : "bg-white/60"}`} />
              {upcoming ? "Open" : "Completed"}
            </span>
            <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-white backdrop-blur">
              {pointLabel}
            </span>
          </div>

          <div className="flex flex-1 flex-col p-5">
            <div className="font-mono text-[11px] font-medium uppercase tracking-[0.08em] text-olive dark:text-lime">
              {formatDateTime(event.eventDate || "")}
            </div>
            <h3
              className="mt-2 text-[17px] font-bold leading-snug tracking-tight text-foreground"
              style={clampStyle(2)}
              title={event.eventTitle}
            >
              {event.eventTitle}
            </h3>
            <div className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
              <span style={clampStyle(1)}>{event.eventLocation}</span>
            </div>

            <div className="mt-5">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-olive transition-all duration-500 dark:bg-lime"
                  style={{
                    width: `${(() => {
                      const capacity = Math.max(event.eventCapacity || 0, 0);
                      const joined = Math.max(event.eventJoined || 0, 0);
                      if (capacity === 0) return 0;
                      return Math.min((joined / capacity) * 100, 100);
                    })()}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  <span className="font-semibold text-foreground">{event.eventJoined}</span> of {event.eventCapacity} spots
                </span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> {event.eventViews}
                </span>
              </div>
            </div>

            <div className="mt-auto flex items-center gap-2 border-t border-border pt-4 mt-5">
              <button
                type="button"
                className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-foreground ring-1 ring-border transition-colors hover:bg-muted disabled:opacity-60"
                disabled={toggleState.isLoading}
                onClick={handleLikeToggle}
                aria-label={liked ? `Remove from favorites (${likesCount} likes)` : `Add to favorites (${likesCount} likes)`}
                aria-pressed={liked}
              >
                <Heart className={`h-4 w-4 ${liked ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
                {likesCount}
              </button>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground ring-1 ring-border transition-colors hover:bg-muted"
                onClick={async (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const url = `${window.location.origin}/events/${event._id}`;
                  try {
                    if (navigator.share) {
                      await navigator.share({ title: event.eventTitle, url });
                      return;
                    }
                    if (navigator.clipboard) {
                      await navigator.clipboard.writeText(url);
                      showToast("Event link copied to clipboard!");
                    }
                  } catch {
                    // no-op
                  }
                }}
                aria-label={`Share ${event.eventTitle}`}
              >
                <Share2 className="h-4 w-4" />
              </button>
              <span
                aria-hidden="true"
                className="ml-auto inline-flex h-9 items-center gap-1 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors group-hover:bg-primary/90"
              >
                {upcoming ? "Apply" : "View"} <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </article>
      </Link>

      <AlertDialog
        isOpen={showLoginAlert}
        onClose={() => setShowLoginAlert(false)}
        onConfirm={() => {
          setShowLoginAlert(false);
          navigate("/login");
        }}
        title="Login Required"
        description="Join our community to like events and show your support! Create an account or login to continue."
        confirmText="Login Now"
        cancelText="Maybe Later"
      />
    </>
  );
}

// Memoize component to prevent unnecessary re-renders when parent updates
export default memo(EventCard);
