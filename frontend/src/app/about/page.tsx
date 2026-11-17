import type { Metadata } from "next";
import { getPage, getSite, getVideos } from "@/lib/api";
import { SectionBlock } from "@/components/Sections";
import { YouTube } from "@/components/YouTube";
import { ButtonLink, Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "About Us",
  description: "Three generations of the Steel family have looked after Beeston's cars since 1982.",
};

export default async function AboutPage() {
  const [page, site, videos] = await Promise.all([getPage("about"), getSite(), getVideos("about")]);
  const sections = page?.sections ?? [];
  const story = sections.filter((s) => /^\d{4}|Moving|Always/.test(s.heading));
  const rest = sections.filter((s) => !story.includes(s));

  return (
    <>
      <PageHeader
        eyebrow={`Established ${site?.established_year ?? 1982}`}
        title={page?.headline ?? "About Jim Steel Garage Services"}
        intro={page?.intro[0]}
      />

      <section className="py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <h2 className="text-3xl font-bold text-navy-900 sm:text-4xl">Our story</h2>
            <ol className="relative mt-8 space-y-8 border-l-2 border-navy-100 pl-8">
              {story.map((s) => (
                <li key={s.id} className="relative">
                  <span className="absolute -left-[41px] top-1 size-4 rounded-full border-4 border-white bg-brand-red ring-2 ring-navy-100" />
                  <h3 className="text-2xl font-bold text-navy-800">{s.heading}</h3>
                  {s.body.map((p, i) => (
                    <p key={i} className="mt-2 leading-relaxed text-muted">
                      {p}
                    </p>
                  ))}
                </li>
              ))}
            </ol>
          </div>
          <div className="space-y-6 lg:sticky lg:top-32 lg:self-start">
            <blockquote className="rounded-3xl bg-navy-900 p-8 text-white">
              <p className="font-display text-4xl font-bold leading-tight">“{site?.motto}”</p>
              <footer className="mt-4 text-navy-200">– Our motto, and our promise</footer>
            </blockquote>
            {videos.map((v) => (
              <YouTube key={v.id} id={v.youtube_id} title={v.title} />
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-surface py-16 sm:py-20">
        <Container className="max-w-4xl space-y-12">
          {rest.map((s) => (
            <SectionBlock key={s.id} section={s} />
          ))}
          <ButtonLink href="/book" size="lg">
            Book now
          </ButtonLink>
        </Container>
      </section>
    </>
  );
}
