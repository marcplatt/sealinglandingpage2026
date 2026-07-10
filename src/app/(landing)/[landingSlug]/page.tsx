import { notFound } from "next/navigation";
import {
  buildLandingMetadata,
  KeywordLandingPage
} from "../../landing/KeywordLandingPage";
import {
  getLandingPageConfig,
  landingPageSlugs
} from "../../landing/config";

type PageProps = {
  params: Promise<{ landingSlug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return landingPageSlugs
    .filter((slug) => slug !== "concrete-sealing-cowichan")
    .map((landingSlug) => ({ landingSlug }));
}

export async function generateMetadata({ params }: Pick<PageProps, "params">) {
  const { landingSlug } = await params;
  const config = getLandingPageConfig(landingSlug);

  if (!config) {
    return {};
  }

  return buildLandingMetadata(config);
}

export default async function LandingSlugPage({ params, searchParams }: PageProps) {
  const { landingSlug } = await params;
  const config = getLandingPageConfig(landingSlug);

  if (!config) {
    notFound();
  }

  return <KeywordLandingPage config={config} searchParams={searchParams} />;
}