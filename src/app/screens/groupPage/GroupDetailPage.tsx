import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Check, Eye, Heart, Users } from "lucide-react";

import { useGetGroupByIdQuery, useJoinGroupMutation } from "../../services/groupsApi";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import { uploadUrlFromFilename } from "../../../libs/shared/ui";

export default function GroupDetailPage() {
  useScrollToTop();
  const { id } = useParams();
  const groupId = id ?? "";
  const [joinGroup, joinState] = useJoinGroupMutation();
  const { data, isLoading, isError } = useGetGroupByIdQuery(groupId, { skip: !groupId });

  if (!groupId) {
    return (
      <div className="space-y-3">
        <div className="text-destructive">Missing group id.</div>
        <Link to="/groups" className="btn-pill btn-pill-outline btn-pill-sm">Back to groups</Link>
      </div>
    );
  }
  if (isLoading) return <div className="text-muted-foreground">Loading group…</div>;
  if (isError || !data) return <div className="text-destructive">The group could not be loaded.</div>;

  const img = uploadUrlFromFilename("groups", data.groupImage);
  const joined = Boolean(data.meJoined) || joinState.isSuccess;

  return (
    <div>
      <Link to="/groups" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> All groups
      </Link>

      <div className="relative isolate overflow-hidden rounded-[32px] bg-forest text-white">
        {img && <img src={img} alt="" aria-hidden="true" className="absolute inset-0 -z-20 h-full w-full object-cover" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[rgba(12,26,19,0.92)] via-[rgba(12,26,19,0.5)] to-[rgba(12,26,19,0.1)]" />
        <div className="flex min-h-[420px] flex-col justify-end p-7 md:p-12">
          {data.groupCategories?.length ? (
            <span className="eyebrow-pill on-dark w-fit">{data.groupCategories.join(" · ")}</span>
          ) : null}
          <h1 className="display-lg mt-4 max-w-3xl text-white">{data.groupName}</h1>
          {data.memberData?.memberNick && (
            <div className="mt-3 text-[15px] text-white/75">
              Run by <span className="font-semibold text-white">{data.memberData.memberNick}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <div className="eyebrow">About this group</div>
          <p className="mt-4 text-lg leading-8 text-foreground/85">{data.groupDesc}</p>
        </div>

        <aside className="h-fit rounded-2xl bg-muted p-6">
          <div className="grid grid-cols-3 gap-2">
            {[
              { icon: Users, label: "Members", value: data.memberCount },
              { icon: Heart, label: "Likes", value: data.groupLikes },
              { icon: Eye, label: "Views", value: data.groupViews },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl bg-background px-3 py-3">
                <Icon className="h-4 w-4 text-olive dark:text-lime" />
                <div className="mt-2 text-xl font-extrabold tracking-tight text-foreground">{value}</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>

          <button
            type="button"
            disabled={joinState.isLoading || joined}
            onClick={async () => {
              await joinGroup({ groupId }).unwrap();
            }}
            className="btn-pill mt-6 h-12 w-full text-base disabled:opacity-70"
          >
            {joined ? (
              <>
                <Check className="h-4 w-4" /> You are a member
              </>
            ) : joinState.isLoading ? (
              "Joining…"
            ) : (
              "Join this group"
            )}
          </button>

          {joinState.isError && (
            <p role="alert" className="mt-3 text-sm text-destructive">
              Joining failed. If you are not logged in,{" "}
              <Link to="/login" className="font-semibold underline underline-offset-4">log in</Link> first.
            </p>
          )}
          <p className="mt-4 text-xs leading-5 text-muted-foreground">
            Members hear about new events from this group first.
          </p>
        </aside>
      </div>
    </div>
  );
}
