import {
  Info,
  Target,
  Lightbulb,
  CheckCircle2,
  Timer,
  ShieldCheck,
  BarChart3,
  CalendarClock,
  Download,
  HelpCircle,
  ChevronDown,
} from "lucide-react";

export default function About() {
  return (
    <div className="space-y-16 pb-12 pt-12">
      <section className="rounded-3xl border bg-white p-8 shadow-sm dark:bg-slate-900 md:p-12">
        <HeaderBlock
          eyebrow="About Appointly"
          title="A simple, professional way to manage your appointments"
          subtitle="Appointly helps you create, track, and review appointments-fast. No sign-ups, no backend, just a clean interface with local persistence so you can stay focused."
          icon={<Info className="h-5 w-5" aria-hidden />}
        />
      </section>

      <section className="md:px-12">
        <SectionTitle eyebrow="Why Appointly" title="Built for clarity and speed" />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <WhyCard
            icon={<CheckCircle2 className="h-5 w-5" aria-hidden />}
            title="Frictionless CRUD"
            desc="Add, edit, and delete appointments without distractions. Clean forms and helpful defaults."
          />
          <WhyCard
            icon={<Timer className="h-5 w-5" aria-hidden />}
            title="Stay on time"
            desc="See what’s next at a glance with totals, recent items, and upcoming views."
          />
          <WhyCard
            icon={<ShieldCheck className="h-5 w-5" aria-hidden />}
            title="Local & private"
            desc="Your data lives in your browser via localStorage-no account required."
          />
          <WhyCard
            icon={<BarChart3 className="h-5 w-5" aria-hidden />}
            title="Quick insights"
            desc="Dashboard charts help you understand trends and statuses at a glance."
          />
          <WhyCard
            icon={<CalendarClock className="h-5 w-5" aria-hidden />}
            title="Search & filter"
            desc="Find appointments by title, description, tags, status, or date range."
          />
          <WhyCard
            icon={<Download className="h-5 w-5" aria-hidden />}
            title="Export ready"
            desc="Export the current filtered list to CSV for sharing or reporting."
          />
        </div>
      </section>

      <section className="rounded-3xl border bg-white p-8 shadow-sm dark:bg-slate-900 md:p-12">
        <HeaderBlock
          eyebrow="Our Mission"
          title="Make time management effortless"
          subtitle="Appointly focuses on the essentials-fast creation, clear organization, and useful insights-so you can spend less time managing tools and more time getting work done."
          icon={<Target className="h-5 w-5" aria-hidden />}
        />
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <MissionItem
            icon={<Lightbulb className="h-5 w-5" aria-hidden />}
            title="Simplicity first"
            desc="Every screen has a clear purpose. No clutter, just what you need."
          />
          <MissionItem
            icon={<CheckCircle2 className="h-5 w-5" aria-hidden />}
            title="Reliability"
            desc="Local persistence keeps your data available, even offline."
          />
          <MissionItem
            icon={<BarChart3 className="h-5 w-5" aria-hidden />}
            title="Clarity"
            desc="At‑a‑glance metrics and charts to guide your day."
          />
        </div>
      </section>

      <section>
        <SectionTitle eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mx-auto mt-8 grid max-w-3xl gap-3">
          <FAQItem
            q="Do I need an account to use Appointly?"
            a="No. Appointly stores data locally in your browser via localStorage, so you can start immediately without sign‑up."
          />
          <FAQItem
            q="Can I export my appointments?"
            a="Yes. From the Appointments page, export your current filtered list to a CSV file."
          />
          <FAQItem
            q="What fields can I store?"
            a="Title, description, date, start/end time, status, location, tags, and notes."
          />
          <FAQItem
            q="Is there conflict detection?"
            a="Yes. When creating or editing, Appointly alerts you if times overlap with another appointment on the same day."
          />
          <FAQItem
            q="Will you add calendars or reminders?"
            a="This demo focuses on core scheduling and CSV export. Calendar sync and notifications can be added in a future iteration."
          />
        </div>
      </section>
    </div>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div className="text-center">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
        {eyebrow}
      </div>
      <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
    </div>
  );
}

function HeaderBlock({ eyebrow, title, subtitle, icon }) {
  return (
    <div className="mx-auto max-w-3xl text-center md:max-w-4xl">
      <div className="mx-auto inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300">
        {icon}
        {eyebrow}
      </div>
      <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">{title}</h2>
      {subtitle ? (
        <p className="mx-auto mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{subtitle}</p>
      ) : null}
    </div>
  );
}

function WhyCard({ icon, title, desc }) {
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

function MissionItem({ icon, title, desc }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900">
      <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
        {icon}
      </div>
      <div className="mt-3">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{desc}</p>
      </div>
    </div>
  );
}

function FAQItem({ q, a }) {
  return (
    <details className="group rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-900">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
        <div className="inline-flex items-center gap-2 text-sm font-medium">
          <HelpCircle className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden />
          {q}
        </div>
        <ChevronDown
          className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180"
          aria-hidden
        />
      </summary>
      <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{a}</p>
    </details>
  );
}
