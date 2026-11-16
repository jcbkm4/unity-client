import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function FinalCtaSection() {
  return (
    <section className="bg-background pb-24 md:pb-32">
      <div className="content-container">
        <div className="relative isolate overflow-hidden rounded-[32px] bg-forest px-7 py-14 text-white md:px-14 md:py-20">
          <img
            src="/uploads/images/volunteers/03.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 -z-20 h-full w-full object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(12,26,19,0.94)_0%,rgba(12,26,19,0.78)_50%,rgba(12,26,19,0.35)_100%)]" />

          <span className="eyebrow-pill on-dark">Get started</span>
          <h2 className="display-lg mt-5 max-w-2xl text-white">Your Saturday can change someone's week.</h2>
          <p className="mt-5 max-w-lg text-base leading-7 text-white/75 md:text-lg">
            Create a free account, pick an event near you and show up. We'll keep track of your hours.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/signup" className="btn-pill btn-pill-light h-12 px-6">
              Create a free account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/events" className="btn-pill btn-pill-ghost-light h-12 px-6">
              Browse events <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-8 text-sm text-white/60">
            Already a member?{" "}
            <Link to="/login" className="font-semibold text-white underline underline-offset-4">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
