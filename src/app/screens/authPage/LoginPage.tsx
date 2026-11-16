import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import { useLoginMutation } from "../../services/authApi";
import { useScrollToTop } from "../../hooks/useScrollToTop";
import AuthShell, { fieldInput, fieldLabel } from "./AuthShell";

function errorMessage(err: unknown): string {
  if (!err || typeof err !== "object") return "Login failed.";
  const anyErr = err as any;
  return anyErr?.data?.message || anyErr?.error || "Login failed.";
}

export default function LoginPage() {
  useScrollToTop();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [memberNick, setMemberNick] = useState("");
  const [memberPassword, setMemberPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to Unity."
      lead="Apply to events as a volunteer, or manage your events as an organization."
    >
      <form
        className="space-y-5"
        onSubmit={async (e) => {
          e.preventDefault();
          setFormError(null);
          try {
            await login({ memberNick: memberNick.trim(), memberPassword }).unwrap();
            navigate("/", { replace: true });
          } catch (err) {
            setFormError(errorMessage(err));
          }
        }}
      >
        <div>
          <label htmlFor="login-nick" className={fieldLabel}>Username</label>
          <input
            id="login-nick"
            autoComplete="username"
            value={memberNick}
            onChange={(e) => setMemberNick(e.target.value)}
            className={fieldInput}
            placeholder="Your username"
          />
        </div>
        <div>
          <label htmlFor="login-password" className={fieldLabel}>Password</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            value={memberPassword}
            onChange={(e) => setMemberPassword(e.target.value)}
            className={fieldInput}
            placeholder="••••••••"
          />
        </div>

        {formError && (
          <div role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {formError}
          </div>
        )}

        <button type="submit" disabled={isLoading} className="btn-pill h-12 w-full text-base disabled:opacity-60">
          {isLoading ? "Logging in…" : "Log in"} <ArrowRight className="h-4 w-4" />
        </button>

        <p className="text-sm text-muted-foreground">
          New to Unity?{" "}
          <Link to="/signup" className="font-semibold text-foreground underline underline-offset-4">
            Create a free account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
