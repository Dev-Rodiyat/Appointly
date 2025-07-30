import { Link } from "react-router-dom";
import {
  CalendarCheck,
  Clock,
  Search,
  Filter,
  BarChart3,
  Download,
  ShieldCheck,
  Smartphone,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-20 pt-12">
      <section className="relative overflow-hidden rounded-3xl border bg-white px-6 py-14 shadow-sm dark:bg-slate-900 md:px-12">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[48rem] -translate-x-1/2 rounded-full bg-indigo-500/10 blur-3xl"
        />
        <div className="mx-auto max-w-4xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Built for clarity & speed
          </div>

          <h1 className="mt-6 text-3xl font-bold tracking-tight md:text-5xl">
            Appointly - Manage your appointments with ease
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
            Plan, track, and review your schedule. Create, edit, filter, and export
            appointments - all in a clean, responsive interface.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Get Started
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              to="/appointments"
              className="inline-flex items-center gap-2 rounded-lg border px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              View Appointments
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <div className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" aria-hidden />
              Quick to use
            </div>
            <div className="inline-flex items-center gap-2">
              <Smartphone className="h-4 w-4" aria-hidden />
              Mobile‑friendly
            </div>
            <div className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4" aria-hidden />
              Data Secured
            </div>
          </div>
        </div>
      </section>

      <section className="md:px-12">
        <SectionHeader
          eyebrow="Features"
          title="Everything you need to stay on schedule"
          subtitle="From quick creation to exportable records, Appointly keeps your day organized."
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<CalendarCheck className="h-5 w-5" aria-hidden />}
            title="Fast appointment creation"
            desc="Create and edit appointments in seconds with clean, simple forms."
          />
          <FeatureCard
            icon={<Search className="h-5 w-5" aria-hidden />}
            title="Search everything"
            desc="Find appointments by title, description, location, or tags."
          />
          <FeatureCard
            icon={<Filter className="h-5 w-5" aria-hidden />}
            title="Powerful filters"
            desc="Filter by status and date range to focus on what matters."
          />
          <FeatureCard
            icon={<BarChart3 className="h-5 w-5" aria-hidden />}
            title="Quick insights"
            desc="See totals, recent items, and trends right from the dashboard."
          />
          <FeatureCard
            icon={<Download className="h-5 w-5" aria-hidden />}
            title="CSV export"
            desc="Export your filtered list to CSV for sharing or reporting."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-5 w-5" aria-hidden />}
            title="Local persistence"
            desc="Your data stays on your device via localStorage (no signup needed)."
          />
        </div>
      </section>

      <section className="md:px-12">
        <SectionHeader
          eyebrow="How it works"
          title="Three steps to a clearer day"
          subtitle="Add appointments, manage them from the dashboard, and export when needed."
        />
        <ol className="mt-10 grid gap-6 sm:grid-cols-3">
          <StepCard
            step="1"
            icon={<CheckCircle2 className="h-5 w-5" aria-hidden />}
            title="Add"
            desc="Create an appointment with title, description, time, and status."
          />
          <StepCard
            step="2"
            icon={<CalendarCheck className="h-5 w-5" aria-hidden />}
            title="Manage"
            desc="Search and filter your list, or open details to edit or delete."
          />
          <StepCard
            step="3"
            icon={<Download className="h-5 w-5" aria-hidden />}
            title="Export"
            desc="Export your current filtered list to CSV for records."
          />
        </ol>

        {/* CTA band */}
        <div className="mt-12 rounded-2xl border bg-white p-8 text-center shadow-sm dark:bg-slate-900">
          <h3 className="text-xl font-semibold">Ready to get organized?</h3>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Jump into the dashboard and start scheduling in seconds.
          </p>
          <div className="mt-6">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            >
              Open Dashboard
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
        {eyebrow}
      </div>
      <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      {subtitle ? (
        <p className="mx-auto mt-2 max-w-2xl text-slate-600 dark:text-slate-300">{subtitle}</p>
      ) : null}
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md dark:bg-slate-900">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{desc}</p>
    </div>
  );
}

function StepCard({ step, icon, title, desc }) {
  return (
    <li className="relative rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900">
      <span className="absolute -top-3 left-4 inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-xs font-semibold shadow-sm dark:bg-slate-900">
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-white">{step}</span>
        Step
      </span>
      <div className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-indigo-700 dark:text-indigo-300">
        {icon}
        <span className="uppercase tracking-wide">{title}</span>
      </div>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{desc}</p>
    </li>
  );
}
