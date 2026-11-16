import { Link } from "react-router-dom";
import { ArrowUpRight, BarChart3, ClipboardCheck, Megaphone } from "lucide-react";
import { SectionHeader } from "@/libs/components/common/Headers";

const TILES = [
  { icon: Megaphone, title: "Publish an event", text: "Brief, dates, capacity and photos. Live as soon as you save." },
  { icon: ClipboardCheck, title: "Review applicants", text: "Approve or decline with one click and keep a waitlist." },
  { icon: BarChart3, title: "Track your impact", text: "Views, likes, sign-ups and completed hours per event." },
];

export default function OrgToolsSection() {
  return (
    <section className="section-y relative overflow-hidden bg-forest text-white">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-lime/10 blur-3xl" />
      <div className="content-container relative">
        <SectionHeader
          onDark
          eyebrow="For organizations"
          title={
            <>
              Run every event
              <br />
              from one dashboard.
            </>
          }
          lead="Verified organizers publish events, review volunteers and see what each event achieved, without spreadsheets."
          action={
            <Link to="/dashboard" className="btn-pill btn-pill-light">
              Open the dashboard <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />

        <div className="grid gap-4 md:grid-cols-3">
          {TILES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-sm">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-lime text-ink">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="mt-10 text-xl font-bold tracking-tight text-white">{title}</h3>
              <p className="mt-2 text-[15px] leading-6 text-white/70">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
