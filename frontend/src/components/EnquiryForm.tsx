"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { submitEnquiry, type EnquiryState } from "@/lib/actions";

type Props = {
  kind?: "contact" | "callback" | "quote";
  services?: string[];
  defaultService?: string;
  submitLabel?: string;
};

const input =
  "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-ink placeholder:text-muted/60 focus:border-navy-600 focus:outline-none focus:ring-4 focus:ring-navy-100 aria-[invalid=true]:border-brand-red";

function Field({
  label,
  name,
  error,
  required,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="block text-sm font-semibold text-navy-900">
        {label} {required ? <span className="text-brand-red">*</span> : <span className="font-normal text-muted">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className="text-sm text-brand-red">
          {error}
        </p>
      )}
    </div>
  );
}

export function EnquiryForm({ kind = "contact", services = [], defaultService = "", submitLabel }: Props) {
  const [state, action, pending] = useActionState<EnquiryState, FormData>(submitEnquiry, { status: "idle" });
  const e = state.errors ?? {};
  const v = state.values ?? {};
  const isCallback = kind === "callback";

  if (state.status === "success") {
    return (
      <div role="status" className="flex gap-3 rounded-2xl border border-green-200 bg-green-50 p-6 text-green-900">
        <CheckCircle2 className="size-6 shrink-0 text-green-600" aria-hidden />
        <p className="font-medium">{state.message}</p>
      </div>
    );
  }

  const attrs = (name: string) => ({
    id: name,
    name,
    defaultValue: v[name],
    "aria-invalid": e[name] ? true : undefined,
    "aria-describedby": e[name] ? `${name}-error` : undefined,
    className: input,
  });

  return (
    <form action={action} className="space-y-5" noValidate={false}>
      <input type="hidden" name="kind" value={kind} />
      {/* Honeypot for bots – hidden from people and assistive tech */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {state.status === "error" && state.message && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm font-medium text-brand-red-dark">
          {state.message}
        </p>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="First name" name="first_name" error={e.first_name} required>
          <input {...attrs("first_name")} required autoComplete="given-name" />
        </Field>
        <Field label="Last name" name="last_name" error={e.last_name} required={!isCallback}>
          <input {...attrs("last_name")} required={!isCallback} autoComplete="family-name" />
        </Field>
        <Field label="Phone" name="phone" error={e.phone} required>
          <input {...attrs("phone")} type="tel" required autoComplete="tel" inputMode="tel" />
        </Field>
        {!isCallback && (
          <Field label="Email" name="email" error={e.email} required>
            <input {...attrs("email")} type="email" required autoComplete="email" />
          </Field>
        )}
        <Field label="Vehicle registration" name="registration" error={e.registration}>
          <input
            {...attrs("registration")}
            autoComplete="off"
            placeholder="AB12 CDE"
            className={`${input} font-mono uppercase tracking-wider`}
          />
        </Field>
        {services.length > 0 && (
          <Field label="Service" name="service" error={e.service}>
            <select {...attrs("service")} defaultValue={v.service ?? defaultService}>
              <option value="">Not sure / other</option>
              {services.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </Field>
        )}
      </div>
      <Field label={isCallback ? "Best time to call / notes" : "How can we help?"} name="message" error={e.message} required={!isCallback}>
        <textarea {...attrs("message")} rows={isCallback ? 3 : 5} required={!isCallback} />
      </Field>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-red px-6 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-brand-red-dark disabled:opacity-60 sm:w-auto"
      >
        {pending ? <Loader2 className="size-4 animate-spin" aria-hidden /> : <Send className="size-4" aria-hidden />}
        {pending ? "Sending…" : submitLabel ?? (isCallback ? "Request a call back" : "Send message")}
      </button>
    </form>
  );
}
