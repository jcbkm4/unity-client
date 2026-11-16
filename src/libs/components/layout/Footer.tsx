import { Link } from "react-router-dom";
import { ArrowUpRight, Facebook, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import { Logo } from "@/libs/components/common/Logo";

const columns = [
  {
    title: "Volunteers",
    links: [
      { to: "/events", label: "Browse events" },
      { to: "/groups", label: "Join a group" },
      { to: "/articles", label: "Community stories" },
      { to: "/signup", label: "Create an account" },
    ],
  },
  {
    title: "Organizations",
    links: [
      { to: "/organizers", label: "Verified organizers" },
      { to: "/events/create", label: "Publish an event" },
      { to: "/dashboard", label: "Organizer dashboard" },
      { to: "/help", label: "Verification" },
    ],
  },
  {
    title: "Support",
    links: [
      { to: "/help", label: "Help center" },
      { to: "/help", label: "Community guidelines" },
      { to: "/help", label: "Privacy policy" },
      { to: "/help", label: "Terms of service" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="content-container pt-16 pb-10 md:pt-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-sm space-y-5">
            <Link to="/" className="inline-flex items-center gap-2.5" aria-label="Unity home">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-sage text-olive dark:bg-accent dark:text-lime">
                <Logo className="h-5 w-5" />
              </span>
              <span className="text-[1.3rem] font-extrabold tracking-[-0.03em]">Unity</span>
            </Link>
            <p className="text-[15px] leading-7 text-muted-foreground">
              Unity connects volunteers with verified organizations in Seoul. Find an event, show up, and
              see your hours add up.
            </p>
            <a
              href="mailto:hello@unityap.tech"
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground hover:text-olive"
            >
              <Mail className="h-4 w-4" /> hello@unityap.tech
            </a>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <div className="eyebrow mb-4 text-muted-foreground">{col.title}</div>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-[15px] font-medium text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-6 rounded-2xl bg-muted px-6 py-5 text-sm text-muted-foreground md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-olive dark:text-lime" />
            <span>Community office · Gangnam-gu, Seoul, South Korea</span>
          </div>
          <div className="flex items-center gap-2">
            {[
              { href: "https://facebook.com", icon: Facebook, label: "Facebook" },
              { href: "https://instagram.com", icon: Instagram, label: "Instagram" },
              { href: "https://linkedin.com", icon: Linkedin, label: "LinkedIn" },
            ].map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-background text-foreground ring-1 ring-border transition-colors hover:bg-foreground hover:text-background"
              >
                <s.icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-[13px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Unity. Volunteer platform for verified organizations.</span>
          <div className="flex flex-wrap items-center gap-5">
            <Link to="/help" className="hover:text-foreground">Privacy</Link>
            <Link to="/help" className="hover:text-foreground">Terms</Link>
            <Link to="/help" className="inline-flex items-center gap-1 hover:text-foreground">
              Help center <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
