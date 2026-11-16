import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, CalendarDays, HeartHandshake, ShieldCheck } from "lucide-react";

const VOLUNTEER_IMAGES = [
  "/uploads/images/volunteers/01.jpg",
  "/uploads/images/volunteers/02.jpg",
  "/uploads/images/volunteers/03.jpg",
  "/uploads/images/volunteers/04.jpg",
  "/uploads/images/volunteers/05.jpg",
  "/uploads/images/volunteers/06.jpg",
];

const PROOF = [
  { icon: ShieldCheck, title: "Verified organizations", text: "Every organizer is reviewed first" },
  { icon: CalendarDays, title: "Real events", text: "Dates, places and spots left" },
  { icon: HeartHandshake, title: "Impact you can see", text: "Hours and points on your profile" },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return reduced;
}

export default function HeroSection() {
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % VOLUNTEER_IMAGES.length), 6000);
    return () => window.clearInterval(id);
  }, [reduced]);

  return (
    <section className="relative isolate overflow-hidden bg-forest text-white">
      {VOLUNTEER_IMAGES.map((src, idx) => (
        <img
          key={src}
          src={src}
          alt=""
          aria-hidden="true"
          draggable={false}
          loading={idx === 0 ? "eager" : "lazy"}
          className={`absolute inset-0 -z-20 h-full w-full object-cover transition-opacity duration-[1400ms] ${
            idx === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,20,15,0.86)_0%,rgba(10,20,15,0.6)_42%,rgba(10,20,15,0.18)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-black/55 to-transparent" />

      <div className="content-container flex min-h-[640px] flex-col justify-end pb-12 pt-36 md:min-h-[92vh] md:pb-16">
        <span className="eyebrow-pill on-dark w-fit">Volunteer platform · Seoul</span>
        <h1 className="display-xl mt-6 max-w-3xl text-white">
          Find your next
          <br />
          volunteer mission.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
          Unity connects volunteers with verified organizations. Join an event, meet good people and see
          your hours add up.
        </p>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link to="/events" className="btn-pill btn-pill-light h-12 px-6 text-base">
            Explore events <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/organizers" className="btn-pill btn-pill-ghost-light h-12 px-6 text-base">
            For organizations <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-14 flex flex-col gap-8 border-t border-white/20 pt-7 md:flex-row md:items-end md:justify-between">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-10">
            {PROOF.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-start gap-3">
                <span className="inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-lime text-ink">
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-[15px] font-bold leading-6">{title}</div>
                  <div className="text-sm text-white/65">{text}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2" role="tablist" aria-label="Hero photos">
            {VOLUNTEER_IMAGES.map((_, idx) => (
              <button
                key={idx}
                type="button"
                role="tab"
                aria-selected={idx === active}
                aria-label={`Photo ${idx + 1}`}
                onClick={() => setActive(idx)}
                className={`h-1.5 rounded-full transition-all ${idx === active ? "w-8 bg-white" : "w-3 bg-white/40 hover:bg-white/70"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
