import { PageHeader } from "@/libs/components/common/Headers";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowDownUp, Heart, Search, X, BadgeCheck, ArrowUpRight } from "lucide-react";

import { useGetOrganizersQuery } from "../../services/organizersApi";
import {
  useCheckLikesBatchQuery,
  useToggleLikeMutation,
} from "../../services/likesApi";
import { useCheckAuthQuery } from "../../services/authApi";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { AlertDialog } from "../../../libs/components/ui/alert-dialog";
import { useToast } from "../../../libs/components/ui/toast";
import { memberImageUrlFromFilename } from "../../../libs/shared/ui";

const ORDER_OPTIONS: { label: string; value: string }[] = [
  { label: "Newest", value: "createdAt" },
  { label: "Most viewed", value: "memberViews" },
  { label: "Most liked", value: "memberLikes" },
];

export default function OrganizersPage() {
  useScrollToTop();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: authData } = useCheckAuthQuery();
  const isAuthenticated = Boolean(authData?.member?._id);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const { showToast } = useToast();

  const initialOrder = searchParams.get("order") || "createdAt";
  const [order, setOrder] = useState(initialOrder);

  const initialDirection =
    (searchParams.get("direction") as "asc" | "desc" | null) || "desc";
  const [direction, setDirection] = useState<"asc" | "desc">(initialDirection);

  const initialSearch = searchParams.get("search") || "";
  const [search, setSearch] = useState(initialSearch);

  const initialPage = Number(searchParams.get("page") || 1);
  const [page, setPage] = useState<number>(
    Number.isFinite(initialPage) ? initialPage : 1,
  );

  useEffect(() => {
    const nextOrder = searchParams.get("order") || "createdAt";
    const nextDirection =
      (searchParams.get("direction") as "asc" | "desc" | null) || "desc";
    const nextSearch = searchParams.get("search") || "";
    const nextPage = Number(searchParams.get("page") || 1);

    setOrder(nextOrder);
    setDirection(nextDirection);
    setSearch(nextSearch);
    setPage(Number.isFinite(nextPage) && nextPage > 0 ? nextPage : 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    const next = new URLSearchParams();
    const trimmed = search.trim();

    if (trimmed) next.set("search", trimmed);
    if (order !== "createdAt") next.set("order", order);
    if (direction !== "desc") next.set("direction", direction);
    if (page !== 1) next.set("page", String(page));

    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, order, direction, page]);

  const query = useMemo(() => {
    const trimmed = search.trim();
    return {
      page,
      limit: 9,
      order,
      direction,
      search: trimmed ? trimmed : undefined,
      onlyActive: true,
    };
  }, [order, direction, search, page]);

  const { data, isLoading, isError } = useGetOrganizersQuery(query);

  const orgIds = useMemo(() => data?.map((o) => o._id) ?? [], [data]);
  const { data: likesData } = useCheckLikesBatchQuery(
    { likeGroup: "MEMBER", likeRefIds: orgIds },
    { skip: orgIds.length === 0 },
  );
  const likedSet = useMemo(
    () => new Set(likesData?.likedRefIds ?? []),
    [likesData],
  );

  const [toggleLike] = useToggleLikeMutation();

  const [pendingLikeIds, setPendingLikeIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [likedOverrides, setLikedOverrides] = useState<Record<string, boolean>>(
    {},
  );
  const [likesCountOverrides, setLikesCountOverrides] = useState<
    Record<string, number>
  >({});

  const handleToggleLike = async (
    orgId: string,
    likedByMe: boolean,
    memberLikes: number,
  ) => {
    if (!isAuthenticated) {
      setShowLoginAlert(true);
      return;
    }

    if (pendingLikeIds.has(orgId)) return;

    const nextLiked = !likedByMe;
    const nextLikesCount = Math.max(0, memberLikes + (nextLiked ? 1 : -1));

    setPendingLikeIds((prev) => {
      const next = new Set(prev);
      next.add(orgId);
      return next;
    });
    setLikedOverrides((prev) => ({ ...prev, [orgId]: nextLiked }));
    setLikesCountOverrides((prev) => ({ ...prev, [orgId]: nextLikesCount }));

    try {
      const res = await toggleLike({
        likeGroup: "MEMBER",
        likeRefId: orgId,
      }).unwrap();

      const finalLiked = res.status === "liked";
      setLikedOverrides((prev) => ({ ...prev, [orgId]: finalLiked }));

      const delta = (finalLiked ? 1 : 0) - (likedByMe ? 1 : 0);
      setLikesCountOverrides((prev) => ({
        ...prev,
        [orgId]: Math.max(0, memberLikes + delta),
      }));

      // Show success toast
      showToast(
        finalLiked
          ? "Organizer added to your favorites!"
          : "Organizer removed from your favorites!",
      );
    } catch (err: any) {
      setLikedOverrides((prev) => {
        const next = { ...prev };
        delete next[orgId];
        return next;
      });
      setLikesCountOverrides((prev) => {
        const next = { ...prev };
        delete next[orgId];
        return next;
      });

      const status = err?.status as number | undefined;
      if (status === 401 || status === 403) {
        navigate("/login");
      }
    } finally {
      setPendingLikeIds((prev) => {
        const next = new Set(prev);
        next.delete(orgId);
        return next;
      });
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Verified organizers"
        title="The teams behind the events."
        lead="Food banks, shelters, libraries and clean-up crews. Every organizer is reviewed before their first event goes live."
      />

      <div className="mb-10 rounded-2xl bg-muted p-3 md:p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative min-w-[280px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, description..."
              className="h-11 w-full rounded-2xl border border-border bg-background pl-10 pr-3 text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={order}
                onChange={(e) => {
                  setOrder(e.target.value);
                  setPage(1);
                }}
                className="h-11 w-[170px] appearance-none rounded-2xl border border-border bg-background px-3 pr-9 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label="Sort by"
              >
                {ORDER_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                ▾
              </div>
            </div>

            <button
              type="button"
              className="inline-flex h-11 w-12 items-center justify-center rounded-2xl border border-border bg-background text-foreground hover:bg-background"
              onClick={() => {
                setDirection((d) => (d === "asc" ? "desc" : "asc"));
                setPage(1);
              }}
              aria-label="Toggle sort direction"
              title={direction === "asc" ? "Ascending" : "Descending"}
            >
              <ArrowDownUp className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-2xl border border-border bg-background px-4 font-semibold text-foreground hover:bg-background"
              onClick={() => {
                setSearch("");
                setOrder("createdAt");
                setDirection("desc");
                setPage(1);
                setSearchParams(new URLSearchParams(), { replace: true });
              }}
            >
              <X className="h-4 w-4" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading…</div>
      ) : isError ? (
        <div className="text-destructive">Failed to load organizers.</div>
      ) : !data?.length ? (
        <div className="text-muted-foreground">No organizers found.</div>
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data.map((org) => {
              const avatar = memberImageUrlFromFilename(
                org.memberImage,
                org.memberNick,
              );
              const initial = (org.memberNick || "?").slice(0, 1).toUpperCase();
              const apiLikedByMe = likedSet.has(org._id);
              const likedByMe = likedOverrides[org._id] ?? apiLikedByMe;
              const memberLikes =
                likesCountOverrides[org._id] ?? org.memberLikes ?? 0;
              const isLikePending = pendingLikeIds.has(org._id);

              return (
                <div
                  key={org._id}
                  className="group flex h-full flex-col rounded-2xl bg-card p-6 ring-1 ring-border transition-shadow hover:shadow-lg"
                >
                  <div className="flex items-start justify-between gap-4">
                    <Link to={`/organizers/${org._id}`} className="flex items-center gap-4">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={org.memberNick}
                          loading="lazy"
                          className="h-14 w-14 rounded-full bg-muted object-cover ring-1 ring-border"
                        />
                      ) : (
                        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-sage text-lg font-bold text-olive">
                          {initial}
                        </span>
                      )}
                      <div>
                        <div className="text-lg font-bold leading-snug tracking-tight text-foreground">{org.memberNick}</div>
                        {org.isVerified && (
                          <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-olive dark:text-lime">
                            <BadgeCheck className="h-4 w-4" /> Verified organizer
                          </span>
                        )}
                      </div>
                    </Link>
                    <button
                      type="button"
                      className="inline-flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold ring-1 ring-border transition-colors hover:bg-muted disabled:opacity-60"
                      aria-label={likedByMe ? "Unlike" : "Like"}
                      aria-pressed={likedByMe}
                      disabled={isLikePending}
                      onClick={async () => {
                        await handleToggleLike(org._id, likedByMe, memberLikes);
                      }}
                    >
                      <Heart className={`h-4 w-4 ${likedByMe ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
                      {memberLikes}
                    </button>
                  </div>

                  <p className="mt-5 line-clamp-2 text-[15px] leading-6 text-muted-foreground">
                    {org.memberDesc?.trim() ? org.memberDesc.trim() : "Verified organizer on Unity."}
                  </p>

                  <div className="mt-6 grid grid-cols-3 gap-2">
                    {[
                      { label: "Events", value: org.eventsOrganizedCount ?? 0 },
                      { label: "Groups", value: org.groupsOrganizedCount ?? 0 },
                      { label: "Views", value: org.memberViews ?? 0 },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-xl bg-muted px-3 py-2.5">
                        <div className="text-lg font-extrabold tracking-tight text-foreground">{stat.value}</div>
                        <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  <Link
                    to={`/organizers/${org._id}`}
                    className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-foreground"
                    aria-label={`View ${org.memberNick}`}
                  >
                    View organizer <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 hover:text-foreground"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              ‹ Previous
            </button>

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-border bg-background/20 text-foreground">
              {page}
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 hover:text-foreground"
              disabled={!data || data.length < 9}
              onClick={() => setPage((p) => p + 1)}
            >
              Next ›
            </button>
          </div>
        </>
      )}

      <AlertDialog
        isOpen={showLoginAlert}
        onClose={() => setShowLoginAlert(false)}
        onConfirm={() => {
          setShowLoginAlert(false);
          navigate("/login");
        }}
        title="Login Required"
        description="Join our community to show your appreciation for amazing organizers! Create an account or login to continue."
        confirmText="Login Now"
        cancelText="Maybe Later"
      />
    </div>
  );
}
