import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Building2, HeartHandshake } from "lucide-react";

import { useSignupMutation } from "../../services/authApi";
import type { MemberTypeFilter } from "../../../libs/types";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import AuthShell, { fieldInput, fieldLabel } from "./AuthShell";

function errorMessage(err: unknown): string {
  if (!err || typeof err !== "object") return "Sign up failed.";
  const anyErr = err as any;
  return anyErr?.data?.message || anyErr?.error || "Sign up failed.";
}

const TYPES: { value: MemberTypeFilter; label: string; hint: string; icon: typeof Building2 }[] = [
  { value: "USER" as MemberTypeFilter, label: "Volunteer", hint: "Find and join events", icon: HeartHandshake },
  { value: "ORG" as MemberTypeFilter, label: "Organization", hint: "Publish events (reviewed)", icon: Building2 },
];

export default function SignupPage() {
  useScrollToTop();
  const navigate = useNavigate();
  const [signup, { isLoading }] = useSignupMutation();

  const [memberType, setMemberType] = useState<MemberTypeFilter>("USER");
  const [memberNick, setMemberNick] = useState("");
  const [memberPhone, setMemberPhone] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  return (
    <AuthShell
      eyebrow="Join Unity"
      title="Create your free account."
      lead="Volunteers can apply right away. Organizations appear as pending until our team verifies them."
    >
      <form
        className="space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setFormError(null);
          try {
            await signup({
              memberType,
              memberNick: memberNick.trim(),
              memberPhone: memberPhone.trim(),
              memberPassword,
            }).unwrap();
            navigate(memberType === "ORG" ? "/dashboard" : "/", { replace: true });
          } catch (err) {
            setFormError(errorMessage(err));
          }
        }}
      >
        <fieldset>
          <legend className={fieldLabel}>I am joining as</legend>
          <div className="grid grid-cols-2 gap-3">
            {TYPES.map(({ value, label, hint, icon: Icon }) => {
              const active = memberType === value;
              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setMemberType(value)}
                  className={`flex items-start gap-3 rounded-2xl p-4 text-left ring-1 transition-colors ${
                    active ? "bg-sage ring-olive dark:bg-accent dark:ring-lime" : "bg-background ring-border hover:bg-muted"
                  }`}
                >
                  <span className={`inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${active ? "bg-olive text-white dark:bg-lime dark:text-ink" : "bg-muted text-foreground"}`}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-[15px] font-bold text-foreground">{label}</span>
                    <span className="block text-xs text-muted-foreground">{hint}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <div>
          <label htmlFor="signup-nick" className={fieldLabel}>Username</label>
          <input id="signup-nick" autoComplete="username" value={memberNick} onChange={(e) => setMemberNick(e.target.value)} className={fieldInput} placeholder="Pick a username" />
        </div>
        <div>
          <label htmlFor="signup-phone" className={fieldLabel}>Phone</label>
          <input id="signup-phone" type="tel" autoComplete="tel" value={memberPhone} onChange={(e) => setMemberPhone(e.target.value)} className={fieldInput} placeholder="010-0000-0000" />
        </div>
        <div>
          <label htmlFor="signup-password" className={fieldLabel}>Password</label>
          <input id="signup-password" type="password" autoComplete="new-password" value={memberPassword} onChange={(e) => setMemberPassword(e.target.value)} className={fieldInput} placeholder="At least 8 characters" />
        </div>

        {formError && (
          <div role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {formError}
          </div>
        )}

        <button type="submit" disabled={isLoading} className="btn-pill h-12 w-full text-base disabled:opacity-60">
          {isLoading ? "Creating account…" : "Create account"} <ArrowRight className="h-4 w-4" />
        </button>

        <p className="text-sm text-muted-foreground">
          Already a member?{" "}
          <Link to="/login" className="font-semibold text-foreground underline underline-offset-4">
            Log in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
