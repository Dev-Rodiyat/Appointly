export default function Modal({ open, onClose, title, children, footer }) {
  return (
    <div
      className={[
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      ].join(" ")}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
    >
      <div
        className={[
          "absolute inset-0 bg-black/40 transition-opacity",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      <div
        className={[
          "absolute left-1/2 top-1/2 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 transform rounded-2xl border bg-white p-4 shadow-xl transition-all dark:bg-slate-900",
          open ? "opacity-100" : "opacity-0",
        ].join(" ")}
      >
        {title ? <h3 className="text-base font-semibold">{title}</h3> : null}
        <div className="mt-3">{children}</div>
        {footer ? <div className="mt-5 flex justify-end gap-2">{footer}</div> : null}
      </div>
    </div>
  );
}
