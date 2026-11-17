import type { Metadata } from "next";
import { getPage } from "@/lib/api";
import { SectionBlock } from "@/components/Sections";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Cookie Policy" };

export default async function CookiePolicyPage() {
  const page = await getPage("cookie-policy");
  return (
    <>
      <PageHeader title={page?.title ?? "Cookie Policy"} intro={page?.headline} />
      <Container className="max-w-3xl space-y-10 py-14">
        {page?.sections.map((s) => <SectionBlock key={s.id} section={s} />)}
      </Container>
    </>
  );
}
