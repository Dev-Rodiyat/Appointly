import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  CalendarRange,
  CalendarCheck2,
  Clock4,
  ListChecks,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  addDays,
  endOfWeek,
  format,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfWeek,
} from "date-fns";

export default function Dashboard() {
  const items = useSelector((s) => s.appointments.items || []);

  const {
    totalCount,
    todayCount,
    thisWeekCount,
    recent3,
    next7BarData,
    statusPieData,
  } = useMemo(() => computeDashData(items), [items]);

  const isEmpty = items.length === 0;

  return (
    <div className="space-y-8 py-12 px-6 md:px-12 pt-24">

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between md:px-12">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Dashboard</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Quick overview of your appointments and activity.
          </p>
        </div>
        <Link
          to="/appointments"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
        >
          Manage Appointments
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 md:px-12">
        <StatCard
          icon={<ListChecks className="h-5 w-5" aria-hidden />}
          label="Total Appointments"
          value={totalCount}
        />
        <StatCard
          icon={<CalendarCheck2 className="h-5 w-5" aria-hidden />}
          label="Today"
          value={todayCount}
        />
        <StatCard
          icon={<CalendarRange className="h-5 w-5" aria-hidden />}
          label="This Week"
          value={thisWeekCount}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 md:px-12">
        <div className="space-y-6 lg:col-span-2">
          <ChartCard title="Appointments – next 7 days" description="Count of appointments per day">
            {isEmpty ? (
              <EmptyChart />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={next7BarData} barSize={28}>
                    <XAxis dataKey="day" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>

          <ChartCard title="Status breakdown" description="Distribution of statuses across all appointments">
            {isEmpty ? (
              <EmptyChart />
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusPieData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={90}
                      innerRadius={50}
                      paddingAngle={2}
                    >
                      {statusPieData.map((_, i) => (
                        <Cell key={i} fill={STATUS_COLORS[i % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </ChartCard>
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">Recent appointments</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300">Last 3 added</p>
            </div>
            <Clock4 className="h-5 w-5 text-indigo-600 dark:text-indigo-300" aria-hidden />
          </div>

          {isEmpty ? (
            <EmptyList />
          ) : (
            <ul className="mt-4 space-y-3">
              {recent3.map((a) => (
                <li key={a.id} className="rounded-xl border p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  <Link to={`/appointment/${a.id}`} className="block">
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{a.title}</p>
                        <p className="truncate text-xs text-slate-600 dark:text-slate-300">
                          {formatLabel(a)}
                        </p>
                      </div>
                      <span className={statusBadgeClass(a.status)}>{a.status}</span>
                    </div>
                    {a.description ? (
                      <p className="mt-1 line-clamp-2 text-xs text-slate-600 dark:text-slate-300">
                        {a.description}
                      </p>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          {!isEmpty && (
            <div className="mt-4 text-right">
              <Link
                to="/appointments"
                className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300"
              >
                View all
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
        {icon}
      </div>
      <div className="mt-3 text-2xl font-bold">{value}</div>
      <div className="text-sm text-slate-600 dark:text-slate-300">{label}</div>
    </div>
  );
}

function ChartCard({ title, description, children }) {
  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900">
      <div className="mb-3">
        <h3 className="text-base font-semibold">{title}</h3>
        {description ? (
          <p className="text-xs text-slate-600 dark:text-slate-300">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-64 items-center justify-center rounded-xl border border-dashed">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        No data yet — add your first appointment.
      </p>
    </div>
  );
}

function EmptyList() {
  return (
    <div className="mt-4 rounded-xl border border-dashed p-4 text-center">
      <p className="text-sm text-slate-600 dark:text-slate-300">
        No appointments to show yet.
      </p>
      <Link
        to="/appointments"
        className="mt-2 inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300"
      >
        Create one now
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}

const STATUS_COLORS = ["#4f46e5", "#16a34a", "#dc2626", "#64748b"];

function computeDashData(items) {
  const now = new Date();
  const today = startOfDay(now);

  const totalCount = items.length;

  const todayCount = items.filter((a) => isSameDay(parseISO(a.date), today)).length;

  const startW = startOfWeek(today, { weekStartsOn: 1 }); // Monday
  const endW = endOfWeek(today, { weekStartsOn: 1 });
  const thisWeekCount = items.filter((a) => {
    const d = parseISO(a.date);
    return isWithinInterval(d, { start: startW, end: endW });
  }).length;

const recent3 = [...items]
  .sort((a, b) => {
    const ta = new Date(a.createdAt || 0).getTime();
    const tb = new Date(b.createdAt || 0).getTime();
    return tb - ta; 
  })
  .slice(0, 3);

  const days = Array.from({ length: 7 }, (_, i) => addDays(today, i));
  const next7BarData = days.map((d) => ({
    day: format(d, "EEE"), // Mon, Tue...
    count: items.filter((a) => isSameDay(parseISO(a.date), d)).length,
  }));

  // Status pie (fixed set ensures legend order)
  const statuses = ["scheduled", "completed", "cancelled", "no-show"];
  const statusPieData = statuses.map((name) => ({
    name,
    value: items.filter((a) => a.status === name).length,
  }));

  return { totalCount, todayCount, thisWeekCount, recent3, next7BarData, statusPieData };
}

function formatLabel(a) {
  try {
    const d = parseISO(a.date);
    const day = format(d, "EEE, MMM d");
    return `${day} • ${a.startTime}–${a.endTime}`;
  } catch {
    return `${a.date} • ${a.startTime}–${a.endTime}`;
  }
}

function statusBadgeClass(status) {
  const base =
    "ml-3 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize";
  switch (status) {
    case "scheduled":
      return `${base} bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300`;
    case "completed":
      return `${base} bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300`;
    case "cancelled":
      return `${base} bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300`;
    case "no-show":
      return `${base} bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300`;
    default:
      return `${base} bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300`;
  }
}
