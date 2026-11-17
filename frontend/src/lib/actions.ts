"use server";

import { API_URL } from "./api";

export type EnquiryState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
};

const FIELDS = ["kind", "first_name", "last_name", "email", "phone", "registration", "service", "message", "website"];

export async function submitEnquiry(_prev: EnquiryState, formData: FormData): Promise<EnquiryState> {
  const payload: Record<string, string> = {};
  for (const f of FIELDS) payload[f] = String(formData.get(f) ?? "").trim();
  const values = Object.fromEntries(Object.entries(payload).filter(([k]) => k !== "website"));

  try {
    const res = await fetch(`${API_URL}/api/enquiries/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (res.ok) {
      return { status: "success", message: "Thanks – we've got your message and will be in touch shortly." };
    }
    if (res.status === 429) {
      return { status: "error", values, message: "Too many submissions. Please call us instead." };
    }
    const data = (await res.json().catch(() => ({}))) as Record<string, string[] | string>;
    const errors: Record<string, string> = {};
    for (const [k, v] of Object.entries(data)) errors[k] = Array.isArray(v) ? v[0] : String(v);
    return { status: "error", values, errors, message: errors.non_field_errors ?? "Please check the highlighted fields." };
  } catch {
    return { status: "error", values, message: "We couldn't send your message right now. Please call us instead." };
  }
}
