import { Link } from "react-router-dom";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  ClipboardList,
  HandHeart,
  LineChart,
  MapPin,
  MessagesSquare,
  Newspaper,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import type { WhyTab } from "../../../libs/types";
import { SectionHeader } from "@/libs/components/common/Headers";

const CONTENT: Record<WhyTab, { title: string; text: string; icon: typeof Users }[]> = {
  volunteers: [
    { icon: ShieldCheck, title: "Verified organizers", text: "Every organization is checked before it can publish an event." },
    { icon: MapPin, title: "Events near you", text: "Filter by date, place and cause, and see how many spots are left." },
    { icon: CalendarCheck2, title: "Apply in one tap", text: "Your profile goes with every application. No long forms." },
    { icon: Sparkles, title: "Hours that count", text: "Completed events add points and hours to your profile." },
  ],
  organizations: [
    { icon: ClipboardList, title: "Publish in minutes", text: "Dates, capacity, photos and a clear brief in one form." },
    { icon: Users, title: "Review applicants", text: "Approve, decline and message volunteers from one list." },
    { icon: LineChart, title: "See what works", text: "Views, likes and sign-ups for every event on your dashboard." },
    { icon: BadgeCheck, title: "Earn trust", text: "A verified badge tells volunteers your events are real." },
  ],
  communities: [
    { icon: HandHeart, title: "Groups by cause", text: "Join cleanups, food banks or reading clubs and stay in the loop." },
    { icon: Newspaper, title: "Stories that inspire", text: "Organizers share what happened and what comes next." },
    { icon: MessagesSquare, title: "Real conversations", text: "Comment on events and articles, ask before you go." },
    { icon: Users, title: "Meet your people", text: "Volunteer with the same faces every month." },
  ],
};

const TABS: { key: WhyTab; label: string }[] = [
  { key: "volunteers", label: "Volunteers" },
  { key: "organizations", label: "Organizations" },
  { key: "communities", label: "Communities" },
];

export default function WhyJoinSection({
  whyTab,
  setWhyTab,
}: {
  whyTab: WhyTab;
  setWhyTab: (tab: WhyTab) => void;
}) {
  return (
    <section className="section-y bg-background">
      <div className="content-container">
        <SectionHeader
          align="center"
          title="Why volunteers choose Unity."
          lead="Volunteers find events they can trust. Organizers fill them. Communities keep the good going."
        />

        <div className="mb-10 flex justify-center">
          <div role="tablist" aria-label="Who is Unity for" className="inline-flex rounded-full bg-muted p-1">
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={whyTab === t.key}
                onClick={() => setWhyTab(t.key)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                  whyTab === t.key ? "bg-foreground text-background" : "text-foreground/70 hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTENT[whyTab].map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl bg-muted p-6 md:p-7">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-sage text-olive ring-1 ring-olive/15 dark:bg-accent dark:text-lime">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-8 text-lg font-bold tracking-tight text-foreground">{title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-muted-foreground">{text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link to={whyTab === "communities" ? "/groups" : "/events"} className="btn-pill btn-pill-outline">
            {whyTab === "communities" ? "Explore groups" : "Browse events"} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
