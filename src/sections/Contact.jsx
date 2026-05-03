"use client";

import { useMemo, useState } from "react";
import AnimatedSection from "@/components/AnimatedSection";
import Container from "@/components/Container";
import SectionHeading from "@/components/SectionHeading";
import { site } from "@/data/site";
import { FiMail, FiPhone, FiSend } from "react-icons/fi";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function Contact() {
  const contactItems = useMemo(() => {
    const items = [];
    if (site.email)
      items.push({
        label: "Email",
        value: site.email,
        href: `mailto:${site.email}`,
        icon: FiMail,
      });
    if (site.phone)
      items.push({
        label: "Phone",
        value: site.phone,
        href: `tel:${site.phone}`,
        icon: FiPhone,
      });
    if (site.whatsapp)
      items.push({
        label: "WhatsApp",
        value: site.whatsapp,
        href: site.whatsapp,
        icon: FiPhone,
      });
    return items;
  }, []);

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ state: "idle", message: "" }); // idle | sending | success | error

  function validate(next) {
    const e = {};
    if (!next.name.trim()) e.name = "Please enter your name.";
    if (!next.email.trim()) e.email = "Please enter your email.";
    else if (!isValidEmail(next.email.trim()))
      e.email = "Please enter a valid email.";
    if (!next.message.trim()) e.message = "Please write a short message.";
    return e;
  }

  async function onSubmit(ev) {
    ev.preventDefault();
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) return;

    setStatus({ state: "sending", message: "Sending..." });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus({
        state: "success",
        message: "Message sent! I’ll get back to you soon.",
      });
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus({
        state: "error",
        message: "Something went wrong. Please try again.",
      });
    }
  }

  return (
    <AnimatedSection id="contact" className=" py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="CONTACT"
          title="Let’s build something"
          subtitle="Have an idea, a question, or an opportunity? Send a message and I’ll reply as soon as I can."
        />

        <div className=" grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-black/10 bg-[var(--card)] p-6 backdrop-blur dark:border-white/10">
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Reach me directly
            </div>
            <div className="mt-4 grid gap-3">
              {contactItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    className="group flex items-center justify-between rounded-2xl border border-black/10 bg-white/40 px-4 py-4 transition hover:-translate-y-0.5 hover:border-black/15 hover:bg-white/60 dark:border-white/10 dark:bg-zinc-900/30 dark:hover:bg-zinc-900/45"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-950/5 text-zinc-900 dark:bg-white/10 dark:text-zinc-50">
                        <Icon />
                      </span>
                      <div>
                        <div className="text-xs font-semibold tracking-wide text-zinc-500 dark:text-zinc-400">
                          {item.label}
                        </div>
                        <div className="text-sm font-medium text-zinc-950 dark:text-zinc-50">
                          {item.value}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-zinc-500 transition group-hover:translate-x-0.5 dark:text-zinc-400">
                      Open
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-3xl border border-black/10 bg-[var(--card)] p-6 backdrop-blur dark:border-white/10"
          >
            <div className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">
              Send a message
            </div>

            <div className="mt-5 grid gap-4">
              <Field
                label="Name"
                value={form.name}
                onChange={(v) => setForm((s) => ({ ...s, name: v }))}
                error={errors.name}
                placeholder="Your name"
              />
              <Field
                label="Email"
                value={form.email}
                onChange={(v) => setForm((s) => ({ ...s, email: v }))}
                error={errors.email}
                placeholder="you@example.com"
                inputMode="email"
              />
              <Field
                label="Message"
                value={form.message}
                onChange={(v) => setForm((s) => ({ ...s, message: v }))}
                error={errors.message}
                placeholder="Tell me a bit about what you need..."
                multiline
              />

              <button
                type="submit"
                disabled={status.state === "sending"}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-100"
              >
                <FiSend className="text-[18px] transition-transform group-hover:translate-x-0.5" />
                {status.state === "sending" ? "Sending..." : "Send"}
              </button>

              {status.state !== "idle" ? (
                <div
                  role="status"
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    status.state === "success"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : status.state === "error"
                        ? "border-rose-500/20 bg-rose-500/10 text-rose-700 dark:text-rose-300"
                        : "border-black/10 bg-white/40 text-zinc-700 dark:border-white/10 dark:bg-zinc-900/30 dark:text-zinc-200"
                  }`}
                >
                  {status.message}
                </div>
              ) : null}
            </div>
          </form>
        </div>
      </Container>
    </AnimatedSection>
  );
}

function Field({
  label,
  value,
  onChange,
  error,
  placeholder,
  multiline,
  inputMode,
}) {
  const base =
    "mt-2 w-full rounded-2xl border bg-white/40 px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-500 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 dark:bg-zinc-900/30 dark:text-zinc-50 dark:placeholder:text-zinc-400";

  const border = error
    ? "border-rose-500/35"
    : "border-black/10 dark:border-white/10";

  return (
    <label className="block">
      <span className="text-xs font-semibold tracking-wide text-zinc-600 dark:text-zinc-300">
        {label}
      </span>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={5}
          className={`${base} ${border} resize-none`}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          inputMode={inputMode}
          className={`${base} ${border}`}
        />
      )}
      {error ? (
        <div className="mt-2 text-xs font-medium text-rose-600 dark:text-rose-300">
          {error}
        </div>
      ) : null}
    </label>
  );
}
