import {
  buildLandingMetadata,
  KeywordLandingPage
} from "../landing/KeywordLandingPage";
import { landingPageConfigBySlug } from "../landing/config";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const config = landingPageConfigBySlug["concrete-sealing-cowichan"];

export const metadata = buildLandingMetadata(config);

export default function ConcreteSealingCowichanPage({ searchParams }: PageProps) {
  return <KeywordLandingPage config={config} searchParams={searchParams} />;
}
