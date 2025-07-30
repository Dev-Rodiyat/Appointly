import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { AlertTriangle } from "lucide-react";

const STATUSES = ["scheduled", "completed", "cancelled", "no-show"];

const required = (v) => (v && String(v).trim() ? null : "Required");

export default function AppointmentForm({
    initialValues,
    onSubmit,
    onCancel,
    ignoreId,
}) {
    const items = useSelector((s) => s.appointments.items || []);
    const [tagField, setTagField] = useState("");
    const [values, setValues] = useState(
        initialValues || {
            title: "",
            description: "",
            date: "",
            startTime: "",
            endTime: "",
            status: "scheduled",
            location: "",
            tags: [],
            notes: "",
        }
    );
    const [errors, setErrors] = useState({});
    const [conflicts, setConflicts] = useState([]);

    const DELIM_RE = /[,\s]+/;            // comma OR any whitespace

    function cleanTag(t) {
        return String(t || "").trim();
    }

    function mergeUniqueTags(current, nextList) {
        const set = new Set(current);
        nextList.forEach((t) => {
            const v = cleanTag(t);
            if (v) set.add(v);
        });
        return Array.from(set);
    }

    function handleChange(e) {
        const { name, value } = e.target;
        setValues((v) => ({ ...v, [name]: value }));
    }

    function handleTagsChange(e) {
        const raw = e.target.value;
        const arr = raw
            .split(/[,\s]+/)        // ✅ split on comma(s) OR spaces/tabs/newlines
            .map((t) => t.trim())
            .filter(Boolean);       // remove empties
        setValues((v) => ({ ...v, tags: arr }));
    }

    function overlaps(a, b) {
        return a.date === b.date && a.startTime < b.endTime && b.startTime < a.endTime;
    }

    function validate(v) {
        const next = {};
        next.title = required(v.title);
        next.date = required(v.date);
        next.startTime = required(v.startTime);
        next.endTime = required(v.endTime);

        if (!next.startTime && !next.endTime && v.startTime >= v.endTime) {
            next.endTime = "End must be after start";
        }
        setErrors(next);
        return Object.values(next).every((x) => !x);
    }

    function checkConflicts(v) {
        const draft = {
            ...v,
            date: v.date,
            startTime: v.startTime,
            endTime: v.endTime,
        };
        const hits = items.filter(
            (x) => x.id !== ignoreId && overlaps(draft, x)
        );
        setConflicts(hits);
        return hits.length === 0;
    }

    function submit(e) {
        e.preventDefault();
        if (!validate(values)) return;
        if (!checkConflicts(values)) return;
        onSubmit(values);
    }

    function commitDraft() {
        const draft = cleanTag(tagField);
        if (!draft) return;
        setValues((v) => ({ ...v, tags: mergeUniqueTags(v.tags || [], [draft]) }));
        setTagField("");
    }

    function handleTagsChange(e) {
        const raw = e.target.value;

        // If user typed a delimiter, split and commit all but the last piece.
        if (DELIM_RE.test(raw)) {
            const parts = raw.split(DELIM_RE);
            const last = parts.pop() ?? "";
            const newTags = parts.map(cleanTag).filter(Boolean);
            if (newTags.length) {
                setValues((v) => ({ ...v, tags: mergeUniqueTags(v.tags || [], newTags) }));
            }
            setTagField(last); // keep typing the trailing piece
        } else {
            setTagField(raw);
        }
    }

    function handleTagsKeyDown(e) {
        if (e.key === "Enter" || e.key === "," || e.key === " ") {
            e.preventDefault();   // don't submit form
            commitDraft();
        } else if (
            e.key === "Backspace" &&
            tagField === "" &&
            (values.tags?.length || 0) > 0
        ) {
            // Pull last tag back into the field for quick edit
            const last = values.tags[values.tags.length - 1];
            setValues((v) => ({ ...v, tags: v.tags.slice(0, -1) }));
            setTagField(last);
            e.preventDefault();
        }
    }

    function handleTagsBlur() {
        commitDraft();
    }

    function removeTag(t) {
        setValues((v) => ({ ...v, tags: (v.tags || []).filter((x) => x !== t) }));
    }

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium">Title</label>
                    <input
                        name="title"
                        value={values.title}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border p-2"
                        placeholder="e.g., Team sync"
                    />
                    {errors.title && <p className="mt-1 text-xs text-rose-600">{errors.title}</p>}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium">Description</label>
                    <textarea
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border p-2"
                        rows={3}
                        placeholder="Context or agenda"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">Date</label>
                    <input
                        type="date"
                        name="date"
                        value={values.date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border p-2"
                    />
                    {errors.date && <p className="mt-1 text-xs text-rose-600">{errors.date}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium">Start</label>
                    <input
                        type="time"
                        name="startTime"
                        value={values.startTime}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border p-2"
                    />
                    {errors.startTime && <p className="mt-1 text-xs text-rose-600">{errors.startTime}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium">End</label>
                    <input
                        type="time"
                        name="endTime"
                        value={values.endTime}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border p-2"
                    />
                    {errors.endTime && <p className="mt-1 text-xs text-rose-600">{errors.endTime}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium">Status</label>
                    <select
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border p-2"
                    >
                        {STATUSES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">Location (optional)</label>
                    <input
                        name="location"
                        value={values.location}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border p-2"
                        placeholder="e.g., Zoom / Office"
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium">Tags</label>

                    <div className="mt-1 flex flex-wrap items-center gap-2 rounded-lg border p-2">
                        {(values.tags || []).map((t) => (
                            <span
                                key={t}
                                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800"
                            >
                                {t}
                                <button
                                    type="button"
                                    onClick={() => removeTag(t)}
                                    className="rounded p-0.5 hover:bg-slate-200 dark:hover:bg-slate-700"
                                    aria-label={`Remove ${t}`}
                                    title="Remove"
                                >
                                    ×
                                </button>
                            </span>
                        ))}

                        <input
                            value={tagField}
                            onChange={handleTagsChange}
                            onKeyDown={handleTagsKeyDown}
                            onBlur={handleTagsBlur}
                            className="min-w-[120px] flex-1 bg-transparent p-1 outline-none"
                            placeholder="Type and press comma/space/Enter"
                        />
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                        Use comma, space, or Enter to add a tag. Backspace on empty to edit the last tag.
                    </p>
                </div>


                <div className="md:col-span-2">
                    <label className="block text-sm font-medium">Notes (optional)</label>
                    <textarea
                        name="notes"
                        value={values.notes}
                        onChange={handleChange}
                        className="mt-1 w-full rounded-lg border p-2"
                        rows={3}
                    />
                </div>
            </div>

            {conflicts.length > 0 && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-800">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <AlertTriangle className="h-4 w-4" />
                        Time conflict
                    </div>
                    <ul className="mt-1 list-inside list-disc text-xs">
                        {conflicts.map((c) => (
                            <li key={c.id}>{c.title} — {c.date} {c.startTime}-{c.endTime}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="flex justify-end gap-2">
                <button type="button" onClick={onCancel}
                    className="rounded-lg border px-4 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800">
                    Cancel
                </button>
                <button type="submit"
                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">
                    Save
                </button>
            </div>
        </form>
    );
}
