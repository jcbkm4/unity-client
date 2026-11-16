import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const VIDEOS = [
  "/uploads/advertisment/video1.mp4",
  "/uploads/advertisment/video2.mp4",
  "/uploads/advertisment/video3.mp4",
  "/uploads/advertisment/video4.mp4",
];

const CHIPS = ["Food banks", "River cleanups", "Reading buddies", "Senior care", "Animal shelters"];

/** Full-width film block, in the style of the MTechLab "see it at work" sections. */
export default function AdvertisementSection() {
  const [video, setVideo] = useState("");
  useEffect(() => setVideo(VIDEOS[Math.floor(Math.random() * VIDEOS.length)]), []);

  return (
    <section className="section-y bg-[#0d1712] text-white">
      <div className="content-container">
        <div className="mx-auto max-w-3xl text-center">
          <span className="eyebrow-pill on-dark">Unity in action</span>
          <h2 className="display-lg mt-4 text-white">See a Saturday on Unity.</h2>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-white/70 md:text-lg">
            One morning, five causes, hundreds of hours. Short films from events our organizers ran this season.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {CHIPS.map((c) => (
              <span key={c} className="rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-white/80">
                {c}
              </span>
            ))}
          </div>
        </div>

        <div className="relative mt-12 overflow-hidden rounded-[32px] border border-white/10 bg-black">
          {video && (
            <video key={video} className="aspect-[16/8] w-full object-cover" autoPlay loop muted playsInline>
              <source src={video} type="video/mp4" />
            </video>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute inset-x-6 bottom-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:inset-x-10 md:bottom-10">
            <div>
              <div className="eyebrow text-lime">Season film · 2026</div>
              <div className="mt-2 text-2xl font-extrabold tracking-tight md:text-3xl">Volunteers in Seoul</div>
            </div>
            <Link to="/events" className="btn-pill btn-pill-light w-fit">
              Find an event <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
