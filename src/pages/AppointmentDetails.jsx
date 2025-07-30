import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { parseISO, format } from "date-fns";
import Modal from "../components/Modal";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Tag as TagIcon,
  StickyNote,
  Pencil,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { remove, update } from "../redux/Appointments/appointmentSlice";
import AppointmentForm from "../components/AppointmentForm";
import { toast } from "react-toastify";

export default function AppointmentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((s) => s.appointments.items || []);
  const item = useMemo(() => items.find((x) => x.id === id), [items, id]);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!item) {
    return (
      <div className="space-y-4 md:px-12">
        <Link
          to="/appointments"
          className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Appointments
        </Link>
        <div className="rounded-2xl border bg-white p-6 shadow-sm dark:bg-slate-900">
          <h1 className="text-xl font-semibold">Appointment not found</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            The appointment you’re looking for doesn’t exist or was removed.
          </p>
        </div>
      </div>
    );
  }

  const formattedDate = safeFormatDate(item.date, "EEE, MMM d, yyyy");
  const createdAt = safeFormatDateTime(item.createdAt);
  const updatedAt =
    item.updatedAt && item.updatedAt !== item.createdAt
      ? safeFormatDateTime(item.updatedAt)
      : null;

  function handleUpdate(values) {
    dispatch(update({ ...item, ...values }));
    setEditOpen(false);
    toast.success('Appointment updated successfully!')
}

function handleDelete() {
    dispatch(remove(item.id));
    setDeleteOpen(false);
    navigate("/appointments");
    toast.success('Appointment deleted successfully!')
  }

  return (
    <div className="space-y-6 px-6 md:px-24 py-12 pt-24">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <Link
            to="/appointments"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-300"
          >
            <ChevronLeft className="h-4 w-4" />
            Appointments
          </Link>
          <h1 className="mt-2 truncate text-2xl font-bold tracking-tight md:text-3xl">
            {item.title}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            <span className={statusBadgeClass(item.status)}>{item.status}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setEditOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Pencil className="h-4 w-4" />
            Edit
          </button>
          <button
            onClick={() => setDeleteOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white hover:bg-rose-700"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Primary info */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900">
            <dl className="grid gap-4 sm:grid-cols-2">
              <InfoRow
                icon={<Calendar className="h-4 w-4" />}
                label="Date"
                value={formattedDate}
              />
              <InfoRow
                icon={<Clock className="h-4 w-4" />}
                label="Time"
                value={`${item.startTime}–${item.endTime}`}
              />
              {item.location ? (
                <InfoRow
                  icon={<MapPin className="h-4 w-4" />}
                  label="Location"
                  value={item.location}
                />
              ) : null}
              {item.tags?.length ? (
                <div className="sm:col-span-2">
                  <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <TagIcon className="h-4 w-4" />
                      Tags
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {item.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </dl>
          </div>

          {!!(item.description || item.notes) && (
            <div className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900 space-y-6">
              <h3 className="text-base font-semibold">Details</h3>
              {item.description ? (
                <SectionBlock
                  icon={<CheckCircle2 className="h-4 w-4" />}
                  title="Description"
                  text={item.description}
                />
              ) : null}
              {item.notes ? (
                <SectionBlock
                  icon={<StickyNote className="h-4 w-4" />}
                  title="Notes"
                  text={item.notes}
                />
              ) : null}
            </div>
          )}
        </div>

        <div className="rounded-2xl border bg-white p-5 shadow-sm dark:bg-slate-900">
          <h3 className="text-base font-semibold">Activity</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li className="text-slate-600 dark:text-slate-300">
              <span className="font-medium">Created:</span> {createdAt}
            </li>
            <li className="text-slate-600 dark:text-slate-300">
              <span className="font-medium">Updated:</span>{" "}
              {updatedAt ? updatedAt : "—"}
            </li>
          </ul>
          <div className="mt-4 border-t pt-4 text-xs text-slate-500 dark:text-slate-400">
            ID: <span className="font-mono">{item.id}</span>
          </div>
        </div>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Appointment">
        <AppointmentForm
          initialValues={{
            title: item.title,
            description: item.description || "",
            date: item.date,
            startTime: item.startTime,
            endTime: item.endTime,
            status: item.status,
            location: item.location || "",
            tags: item.tags || [],
            notes: item.notes || "",
          }}
          ignoreId={item.id}
          onSubmit={handleUpdate}
          onCancel={() => setEditOpen(false)}
        />
      </Modal>

      <Modal open={deleteOpen} onClose={() => setDeleteOpen(false)} title="Delete appointment?">
        <div>
          <p className="text-sm">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{item.title}</span> on{" "}
            <span className="font-mono">
              {item.date} {item.startTime}-{item.endTime}
            </span>
            ?
          </p>
          <div className="mt-5 flex justify-end gap-2">
            <button
              onClick={() => setDeleteOpen(false)}
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
      </Modal>
    </div>
  );
}

/* ----------------- Small helpers ----------------- */

function InfoRow({ icon, label, value }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
        <div className="inline-flex items-center gap-2">
          {icon}
          {label}
        </div>
      </div>
      <div className="mt-1 text-sm">{value}</div>
    </div>
  );
}

function SectionBlock({ icon, title, text }) {
  return (
    <div className="mt-4">
      <div className="inline-flex items-center gap-2 text-sm font-medium">
        {icon}
        {title}
      </div>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300 whitespace-pre-wrap">
        {text}
      </p>
    </div>
  );
}

function statusBadgeClass(status) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize";
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

function safeFormatDate(iso, fmt) {
  try {
    return format(parseISO(iso), fmt);
  } catch {
    return iso || "—";
  }
}

function safeFormatDateTime(iso) {
  try {
    return format(parseISO(iso), "EEE, MMM d, yyyy • HH:mm");
  } catch {
    return "—";
  }
}
