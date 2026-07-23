"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Container from "@/components/Container";
import { signIn, signUp, signOut, authClient } from "@/lib/auth-client";
import { FiLock, FiMail, FiUser, FiArrowRight, FiShield, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

export default function AdminLoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && !name)) {
      setError("Please fill in all required fields.");
      return;
    }

    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const res = await signUp.email({
          email,
          password,
          name,
        });

        if (res.error) {
          setError(res.error.message || "Failed to create account.");
        } else {
          setMessage(
            "Account created with role: 'unknown'! Access is restricted. Change your role to 'admin' in MongoDB Atlas to unlock dashboard access."
          );
          // Sign out immediately so they cannot enter as unknown
          await signOut();
        }
      } else {
        const res = await signIn.email({
          email,
          password,
        });

        if (res.error) {
          setError(res.error.message || "Invalid credentials.");
        } else {
          // Fetch current session to verify role
          const sessionRes = await authClient.getSession();
          const userRole = (sessionRes.data?.user as { role?: string } | undefined)?.role;

          // Strictly enforce admin role
          if (userRole !== "admin") {
            await signOut();
            setError(
              `Access Denied: Your account role is '${userRole || "unknown"}'. Please edit your user's role to 'admin' in MongoDB Atlas to gain access.`
            );
          } else {
            router.push("/admin-portal");
          }
        }
      }
    } catch {
      setError("Authentication error. Please check your credentials and database connection.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black text-zinc-950 dark:text-zinc-50 py-12">
      <Container className="max-w-md">
        <div className="rounded-3xl border border-black/10 bg-[var(--card)] p-8 shadow-xl backdrop-blur dark:border-white/10 space-y-6">
          <div className="text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-zinc-950 text-white dark:bg-white dark:text-zinc-950">
              <FiShield className="text-[22px]" />
            </span>
            <h1 className="mt-4 text-2xl font-semibold tracking-tight">Admin Portal</h1>
            <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400">
              Role-Based Access Control (`role: admin`)
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 rounded-full border border-black/10 bg-black/5 p-1 dark:border-white/10 dark:bg-white/5">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
                setMessage("");
              }}
              className={`rounded-full py-2 text-xs font-semibold transition ${
                mode === "signin"
                  ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
                setMessage("");
              }}
              className={`rounded-full py-2 text-xs font-semibold transition ${
                mode === "signup"
                  ? "bg-white text-zinc-950 shadow-sm dark:bg-zinc-900 dark:text-zinc-50"
                  : "text-zinc-600 dark:text-zinc-400"
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" ? (
              <div>
                <label className="block text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-300 mb-1.5">
                  Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full rounded-2xl border border-black/10 bg-white/40 pl-11 pr-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-zinc-900/30"
                  />
                </div>
              </div>
            ) : null}

            <div>
              <label className="block text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@example.com"
                  className="w-full rounded-2xl border border-black/10 bg-white/40 pl-11 pr-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-zinc-900/30"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-black/10 bg-white/40 pl-11 pr-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-white/10 dark:bg-zinc-900/30"
                />
              </div>
            </div>

            {error ? (
              <div className="flex items-start gap-2 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs font-medium text-rose-700 dark:text-rose-300">
                <FiAlertTriangle className="mt-0.5 text-sm shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            {message ? (
              <div className="flex items-start gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                <FiCheckCircle className="mt-0.5 text-sm shrink-0" />
                <span>{message}</span>
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 py-3.5 text-sm font-semibold text-white transition hover:bg-zinc-900 disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
            >
              <span>{loading ? "Processing..." : mode === "signin" ? "Sign In" : "Create Account (role: unknown)"}</span>
              <FiArrowRight className="text-[16px] transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>
        </div>
      </Container>
    </div>
  );
}
