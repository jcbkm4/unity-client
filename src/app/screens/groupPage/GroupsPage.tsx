import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowUpRight, Eye, Heart, Search, Users } from "lucide-react";

import { useGetGroupsQuery } from "../../services/groupsApi";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { clampText, uploadUrlFromFilename } from "../../../libs/shared/ui";
import { PageHeader } from "@/libs/components/common/Headers";

const ORDER_OPTIONS: { label: string; value: string }[] = [
  { label: "Newest", value: "createdAt" },
  { label: "Most viewed", value: "groupViews" },
  { label: "Most liked", value: "groupLikes" },
  { label: "Most members", value: "memberCount" },
];

export default function GroupsPage() {
  useScrollToTop();
  const [searchParams, setSearchParams] = useSearchParams();
  const [order, setOrder] = useState(searchParams.get("order") || "createdAt");
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const query = useMemo(() => {
    const trimmed = search.trim();
    return { page: 1, limit: 12, order, search: trimmed ? trimmed : undefined };
  }, [order, search]);

  const { data, isLoading, isError } = useGetGroupsQuery(query);

  const apply = () => {
    const next = new URLSearchParams();
    if (order !== "createdAt") next.set("order", order);
    if (search.trim()) next.set("search", search.trim());
    setSearchParams(next);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Groups"
        title="Find your people."
        lead="Communities created by verified organizers. Join one to hear about new events first and volunteer with the same faces every month."
      />

      <div className="mb-10 flex flex-col gap-3 rounded-2xl bg-muted p-3 md:flex-row md:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search groups</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && apply()}
            placeholder="Search groups by name or cause"
            className="h-12 w-full rounded-full bg-background pl-11 pr-4 text-[15px] ring-1 ring-border outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <div className="flex flex-wrap gap-1.5" role="radiogroup" aria-label="Sort groups">
          {ORDER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="radio"
              aria-checked={order === opt.value}
              onClick={() => setOrder(opt.value)}
              className={`h-10 rounded-full px-4 text-sm font-semibold transition-colors ${
                order === opt.value ? "bg-foreground text-background" : "bg-background text-foreground/75 ring-1 ring-border hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={apply} className="btn-pill h-10">
          Apply
        </button>
      </div>

      {isLoading ? (
        <div className="text-muted-foreground">Loading groups…</div>
      ) : isError ? (
        <div className="text-destructive">Groups could not be loaded.</div>
      ) : !data?.length ? (
        <div className="rounded-2xl bg-muted p-10 text-center text-muted-foreground">No groups found.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.map((group) => {
            const img = uploadUrlFromFilename("groups", group.groupImage);
            return (
              <Link
                key={group._id}
                to={`/groups/${group._id}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card ring-1 ring-border transition-shadow hover:shadow-lg"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  {img && (
                    <img
                      src={img}
                      alt={group.groupName}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  )}
                  {group.groupCategories?.[0] && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.08em] text-ink">
                      {group.groupCategories.join(" · ")}
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-bold leading-snug tracking-tight text-foreground">{group.groupName}</h3>
                    <ArrowUpRight className="mt-1 h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  {group.memberData?.memberNick && (
                    <div className="mt-1 text-sm font-medium text-olive dark:text-lime">by {group.memberData.memberNick}</div>
                  )}
                  <p className="mt-3 text-[15px] leading-6 text-muted-foreground">{clampText(group.groupDesc || "", 130)}</p>
                  <div className="mt-auto flex items-center gap-5 border-t border-border pt-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                      <Users className="h-4 w-4" />
                      <span className="font-semibold text-foreground">{group.memberCount}</span> members
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Heart className="h-4 w-4" /> {group.groupLikes}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <Eye className="h-4 w-4" /> {group.groupViews}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
