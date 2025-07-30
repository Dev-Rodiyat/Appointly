import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-semibold">A</span>
            <span className="text-lg font-semibold">Appointly</span>
          </div>

          <nav className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-300">
            <Link className="hover:text-slate-900 dark:hover:text-white" to="/">Home</Link>
            <Link className="hover:text-slate-900 dark:hover:text-white" to="/about">About</Link>
            <Link className="hover:text-slate-900 dark:hover:text-white" to="/dashboard">Dashboard</Link>
            <Link className="hover:text-slate-900 dark:hover:text-white" to="/appointments">Appointments</Link>
          </nav>
        </div>

        <div className="mt-6 text-xs text-slate-500 dark:text-slate-400">
          © {new Date().getFullYear()} Appointly. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
