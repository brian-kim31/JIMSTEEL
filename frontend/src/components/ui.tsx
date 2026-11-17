import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

const variants = {
  primary: "bg-brand-red text-white hover:bg-brand-red-dark shadow-sm",
  navy: "bg-navy-700 text-white hover:bg-navy-800 shadow-sm",
  outline: "border-2 border-current text-navy-700 hover:bg-navy-50",
  light: "bg-white text-navy-800 hover:bg-navy-50 shadow-sm",
  ghostLight: "border-2 border-white/40 text-white hover:bg-white/10",
} as const;

type ButtonProps = { variant?: keyof typeof variants; size?: "md" | "lg" } & ComponentProps<typeof Link>;

export function ButtonLink({ variant = "primary", size = "md", className = "", ...props }: ButtonProps) {
  const sizing = size === "lg" ? "px-6 py-3.5 text-base" : "px-4 py-2.5 text-sm";
  return (
    <Link
      {...props}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-colors ${sizing} ${variants[variant]} ${className}`}
    />
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-sm font-semibold uppercase tracking-[0.14em] text-brand-red ${className}`}>{children}</p>
  );
}

export function PageHeader({ eyebrow, title, intro }: { eyebrow?: string; title: string; intro?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(135deg,#fff_0_2px,transparent_2px_22px)]"
      />
      <div aria-hidden className="absolute -right-24 -top-24 size-72 rounded-full bg-brand-red/25 blur-3xl" />
      <Container className="relative py-14 sm:py-20">
        {eyebrow && <Eyebrow className="!text-red-300">{eyebrow}</Eyebrow>}
        <h1 className="mt-2 max-w-3xl text-4xl font-bold sm:text-5xl lg:text-6xl">{title}</h1>
        {intro && <div className="mt-4 max-w-2xl text-lg text-navy-100">{intro}</div>}
      </Container>
    </section>
  );
}
