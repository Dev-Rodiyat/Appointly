import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Modal from "../components/Modal";
import {
    Plus,
    Search,
    Filter,
    Download,
    Pencil,
    Trash2,
    Calendar,
    Tag,
} from "lucide-react";
import { isAfter, isBefore, parseISO } from "date-fns";
import AppointmentForm from "../components/AppointmentForm";
import { add, remove, update } from "../redux/Appointments/appointmentSlice";
import { toast } from "react-toastify";

const STATUSES = ["all", "scheduled", "completed", "cancelled", "no-show"];

function exportToCSV(rows) {
    const headers = [
        "Title", "Description", "Date", "Start", "End", "Status", "Location", "Tags", "Notes", "CreatedAt", "UpdatedAt"
    ];
    const escape = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [
        headers.join(","),
        ...rows.map(a =>
            [
                a.title, a.description || "", a.date, a.startTime, a.endTime, a.status,
                a.location || "", (a.tags || []).join("|"), a.notes || "",
                a.createdAt || "", a.updatedAt || ""
            ].map(escape).join(",")
        )
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "appointments.csv"; link.click();
    URL.revokeObjectURL(url);
}

export default function Appointments() {
    const dispatch = useDispatch();
    const items = useSelector((s) => s.appointments.items || []);

    const [q, setQ] = useState("");
    const [status, setStatus] = useState("all");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [tag, setTag] = useState("all");

    const [createOpen, setCreateOpen] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const [deleteItem, setDeleteItem] = useState(null);

    const uniqueTags = useMemo(() => {
        const t = new Set();
        items.forEach((i) => (i.tags || []).forEach((x) => t.add(x)));
        return ["all", ...Array.from(t)];
    }, [items]);

    const filtered = useMemo(() => {
        return items
            .filter((a) => {
                const hay = `${a.title} ${a.description || ""} ${a.location || ""} ${(a.tags || []).join(" ")}`.toLowerCase();
                const hit = q ? hay.includes(q.toLowerCase()) : true;
                const statusOk = status === "all" ? true : a.status === status;
                const tagOk = tag === "all" ? true : (a.tags || []).includes(tag);
                const d = parseISO(a.date);
                const fromOk = from ? !isBefore(d, parseISO(from)) : true;
                const toOk = to ? !isAfter(d, parseISO(to)) : true;
                return hit && statusOk && tagOk && fromOk && toOk;
            })
            .sort((a, b) => {
                const ta = new Date(a.createdAt || 0).getTime();
                const tb = new Date(b.createdAt || 0).getTime();
                if (tb !== ta) return tb - ta;
                return (b.date + b.startTime).localeCompare(a.date + a.startTime);
            });
    }, [items, q, status, from, to, tag]);

    function handleCreate(values) {
        dispatch(add(values));
        setCreateOpen(false);
        toast.success('Appointment created successfully!')
    }

    function handleUpdate(values) {
        dispatch(update({ ...editItem, ...values }));
        setEditItem(null);
        toast.success('Appointment updated successfully!')
    }

    function handleDelete() {
        dispatch(remove(deleteItem.id));
        setDeleteItem(null);
        toast.success('Appointment deleted successfully!')
    }

    const trunc = (s, n = 75) => {
        if (!s) return "";
        const str = String(s).trim();
        if (str.length <= n) return str;
        const sub = str.slice(0, n - 1);
        const cut = sub.replace(/\s+\S*$/, "");
        const cleaned = (cut || sub).replace(/[.,;:!?\-–—\s]+$/u, "");
        return cleaned + "…";
    };
    return (
        <div className="space-y-12 lg:px-24 md:px-12 px-6 pt-24">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Appointments</h1>
                    <p className="mt-4 text-sm md:text-base text-slate-600 dark:text-slate-300">
                        Search, filter, export, and manage your appointments.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => exportToCSV(filtered)}
                        className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                        title="Export CSV"
                    >
                        <Download className="h-4 w-4" />
                        Export CSV
                    </button>
                    <button
                        onClick={() => setCreateOpen(true)}
                        className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                    >
                        <Plus className="h-4 w-4" />
                        New Appointment
                    </button>
                </div>
            </div>

            <div className="rounded-2xl border bg-white p-4 shadow-sm dark:bg-slate-900">
                <div className="grid gap-3 md:grid-cols-5">
                    <div className="md:col-span-2">
                        <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Search</label>
                        <div className="mt-1 flex items-center rounded-lg border px-2">
                            <Search className="h-4 w-4 text-slate-400" />
                            <input
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Title, description, tags, location…"
                                className="ml-2 w-full bg-transparent p-2 outline-none"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Status</label>
                        <div className="mt-1 flex items-center rounded-lg border px-2">
                            <Filter className="h-4 w-4 text-slate-400" />
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="ml-2 w-full bg-transparent p-2 outline-none"
                            >
                                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Tag */}
                    <div>
                        <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">Tag</label>
                        <div className="mt-1 flex items-center rounded-lg border px-2">
                            <Tag className="h-4 w-4 text-slate-400" />
                            <select
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                className="ml-2 w-full bg-transparent p-2 outline-none"
                            >
                                {uniqueTags.map((t) => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Date range */}
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">From</label>
                            <div className="mt-1 flex items-center rounded-lg border px-2">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <input
                                    type="date"
                                    value={from}
                                    onChange={(e) => setFrom(e.target.value)}
                                    className="ml-2 w-full bg-transparent p-2 outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-wide text-slate-500">To</label>
                            <div className="mt-1 flex items-center rounded-lg border px-2">
                                <Calendar className="h-4 w-4 text-slate-400" />
                                <input
                                    type="date"
                                    value={to}
                                    onChange={(e) => setTo(e.target.value)}
                                    className="ml-2 w-full bg-transparent p-2 outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative max-h-[65vh] overflow-auto rounded-2xl border bg-white shadow-sm dark:bg-slate-900">
                <table className="w-full border-collapse text-left text-sm">
                    <thead className="sticky top-0 z-10 bg-slate-50 text-xs uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                        <tr>
                            <th className="px-4 py-3">Title</th>
                            <th className="px-4 py-3">Description</th>
                            <th className="px-4 py-3">Date</th>
                            <th className="px-4 py-3">Time</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Tags</th>
                            <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-4 py-12 text-center text-slate-600 dark:text-slate-300">
                                    No results. Try adjusting filters.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((a) => (
                                <tr key={a.id} className="border-t last:border-b">
                                    <td className="px-4 py-3">
                                        <Link
                                            to={`/appointment/${a.id}`}
                                            className="font-medium text-indigo-600 hover:underline dark:text-indigo-300"
                                        >
                                            {a.title}
                                        </Link>
                                    </td>
                                    <td className="max-w-[350px] px-4 py-3">
                                        <p className="text-slate-600 dark:text-slate-300" title={a.description}>
                                            <span className="md:hidden">
                                                {trunc(a.description, 10)}
                                            </span>

                                            <span className="hidden md:inline">
                                                {trunc(a.description, 20)}
                                            </span>

                                            <span className="hidden lg:inline">
                                                {trunc(a.description, 50)}
                                            </span>
                                        </p>
                                    </td>
                                    <td className="px-4 py-3">{a.date}</td>
                                    <td className="px-4 py-3">{a.startTime}–{a.endTime}</td>
                                    <td className="px-4 py-3">
                                        <span className={statusBadgeClass(a.status)}>{a.status}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            {(a.tags || []).map((t) => (
                                                <span key={t} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800">
                                                    {t}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setEditItem(a)}
                                                className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => setDeleteItem(a)}
                                                className="inline-flex items-center gap-1 rounded-lg border px-2 py-1 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                                                title="Delete"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                open={createOpen}
                onClose={() => setCreateOpen(false)}
                title="New Appointment"
            >
                <AppointmentForm
                    onSubmit={handleCreate}
                    onCancel={() => setCreateOpen(false)}
                />
            </Modal>

            <Modal
                open={!!editItem}
                onClose={() => setEditItem(null)}
                title="Edit Appointment"
            >
                {editItem ? (
                    <AppointmentForm
                        initialValues={{
                            title: editItem.title,
                            description: editItem.description || "",
                            date: editItem.date,
                            startTime: editItem.startTime,
                            endTime: editItem.endTime,
                            status: editItem.status,
                            location: editItem.location || "",
                            tags: editItem.tags || [],
                            notes: editItem.notes || "",
                        }}
                        ignoreId={editItem.id}
                        onSubmit={handleUpdate}
                        onCancel={() => setEditItem(null)}
                    />
                ) : null}
            </Modal>

            <Modal
                open={!!deleteItem}
                onClose={() => setDeleteItem(null)}
                title="Delete appointment?"
            >
                {deleteItem ? (
                    <div>
                        <p className="text-sm">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold">{deleteItem.title}</span> on{" "}
                            <span className="font-mono">{deleteItem.date} {deleteItem.startTime}-{deleteItem.endTime}</span>?
                        </p>
                        <div className="mt-5 flex justify-end gap-2">
                            <button
                                onClick={() => setDeleteItem(null)}
                                className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ) : null}
            </Modal>
        </div>
    );
}

function statusBadgeClass(status) {
    const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize";
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
