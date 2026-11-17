import Image from "next/image";
import { CheckCircle2, Info, Lightbulb } from "lucide-react";
import type { Section } from "@/lib/api";

function Paragraphs({ body, className = "" }: { body: string[]; className?: string }) {
  return (
    <>
      {body.map((p, i) => (
        <p key={i} className={`leading-relaxed ${className}`}>
          {p}
        </p>
      ))}
    </>
  );
}

export function SectionBlock({ section }: { section: Section }) {
  const { heading, body, bullets, style, image, image_alt } = section;

  if (style === "callout" || style === "tip") {
    const Icon = style === "tip" ? Lightbulb : Info;
    const tone =
      style === "tip"
        ? "border-sky/30 bg-sky/5 [&_svg]:text-sky"
        : "border-brand-red/25 bg-red-50/60 [&_svg]:text-brand-red";
    return (
      <aside className={`flex gap-4 rounded-2xl border p-5 sm:p-6 ${tone}`}>
        <Icon className="mt-0.5 size-6 shrink-0" aria-hidden />
        <div className="space-y-3">
          {heading && <h3 className="text-xl font-bold text-navy-900">{heading}</h3>}
          <Paragraphs body={body} className="text-ink/85" />
        </div>
      </aside>
    );
  }

  return (
    <section className="space-y-4">
      {heading && <h2 className="text-2xl font-bold text-navy-800 sm:text-3xl">{heading}</h2>}
      <Paragraphs body={body} className="text-muted" />
      {bullets.length > 0 && (
        <ul className={`grid gap-3 ${style === "checklist" || bullets.length > 4 ? "sm:grid-cols-2" : ""}`}>
          {bullets.map((b) => (
            <li key={b} className="flex gap-3 rounded-xl bg-surface p-3.5 text-ink">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-brand-red" aria-hidden />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {image && (
        <figure className="overflow-hidden rounded-2xl border border-line bg-white p-2">
          <Image
            src={image}
            alt={image_alt || heading}
            width={1350}
            height={900}
            className="h-auto w-full rounded-xl"
            sizes="(min-width: 1024px) 720px, 100vw"
          />
        </figure>
      )}
    </section>
  );
}
