import type { Metadata } from "next";
import Image from "next/image";
import { marketingVideos, processStripVideoIds } from "../../content/media";
import { LeadForm } from "./LeadForm";
import { LandingPanel, LandingSection, LandingTopBar } from "./LandingComponents";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const phoneDisplay = "250.743.6349";
const phoneHref = "tel:+12507436349";

const media = {
  hero: "/media/stamped-concrete.avif",
  stamped: "/media/stamped-concrete_edited.jpg",
  aggregate: "/media/aggregate_edited.jpg",
  flagstone: "/media/glossy-flagstone.jpg",
  pavers: "/media/pavers_edited.jpg",
  cleaningBefore: "/media/before-after-concrete.png",
  cleaningAfter: "/media/clean-concrete.jpg",
  beforeAfter: "/media/beforeAfterA.jpg",
  sealingSecond: "/media/driveway-before-after.jpg",
  worksafe: "/media/badgeA.jpg",
  ladysmith:
    "https://static.wixstatic.com/media/0abc9f_19b2bcdfdf8d4cdfa69c165a8999e6d1~mv2.png/v1/fill/w_147,h_196,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/LADYSMITH.png",
  zensurance: "/media/badgeBEdited.jpg",
  logo: "/media/logoA.png",
};

const processVideos = processStripVideoIds.map((id) => ({
  src: marketingVideos[id].blobUrl,
  fallbackSrc: marketingVideos[id].localFallbackUrl
}));

const processImages = [
  media.cleaningBefore,
  media.cleaningAfter,
  media.beforeAfter,
  media.sealingSecond,
  media.stamped,
  media.aggregate,
  media.flagstone
];

const processStripItems = processVideos.flatMap((video, index) => [
  { type: "video" as const, src: video.src, fallbackSrc: video.fallbackSrc },
  { type: "image" as const, src: processImages[index % processImages.length] }
]);

const loopedProcessStripItems = [...processStripItems, ...processStripItems];

export const metadata: Metadata = {
  title: "Concrete Sealing Cowichan | Rocket Wash",
  description:
    "Concrete Sealing Cowichan service page. Call now or request a free quote online."
};

function getParam(
  value: string | string[] | undefined,
  fallback = ""
): string {
  if (Array.isArray(value)) {
    return value[0] ?? fallback;
  }
  return value ?? fallback;
}

export default async function ConcreteSealingCowichanPage({
  searchParams
}: PageProps) {
  const params = await searchParams;

  const tracking = {
    gclid: getParam(params.gclid),
    utm_source: getParam(params.utm_source),
    utm_medium: getParam(params.utm_medium),
    utm_campaign: getParam(params.utm_campaign),
    utm_term: getParam(params.utm_term),
    utm_content: getParam(params.utm_content)
  };

  return (
    <main id="top" className="lp-shell">
      <LandingTopBar
        phoneDisplay={phoneDisplay}
        phoneHref={phoneHref}
        logoSrc={media.logo}
        logoAlt="Rocket Wash logo"
      />

      <LandingSection className="section-hero">
        <LandingPanel className="hero-panel">
          <div className="lp-hero-copy">
            <p className="eyebrow">Rocket Wash | Cowichan Valley</p>
            <h1>Concrete Sealing Cowichan</h1>
            <p className="subhead">
              We clean, treat, and seal your driveway, patio, or walkway so it
              stays protected from oil, tire marks, and UV for years, not
              months.
            </p>
            <div className="cta-row">
              <a className="btn btn-solid" href={phoneHref}>
                Call {phoneDisplay}
              </a>
              <a className="btn btn-outline" href="#quote-form">
                Jump to Quote Form
              </a>
            </div>
          </div>
          <div className="lp-hero-media">
            <Image
              src={media.hero}
              alt="Stamped concrete being sealed"
              width={986}
              height={338}
              priority
            />
          </div>
        </LandingPanel>
      </LandingSection>

      <LandingSection>
        <article className="lp-panel offer-panel">
          <h2>Concrete Cleaning</h2>
          <p>
            Have tire marks, black streaks, or moss that keeps coming back? We
            deep-clean concrete to restore a bright, even finish before sealing.
          </p>
          <ul>
            <li>Rust, salts, algae, and grime treatment</li>
            <li>Driveway, patio, and walkway surface prep</li>
            <li>Done right to maximize sealer performance</li>
          </ul>
          <div className="offer-media-row" aria-label="Cleaning before and after">
            <figure className="media-card">
              <Image
                src={media.cleaningBefore}
                alt="Concrete cleaning before"
                width={619}
                height={362}
              />
              <figcaption>Before</figcaption>
            </figure>
            <figure className="media-card">
              <Image
                src={media.cleaningAfter}
                alt="Concrete cleaning after"
                width={619}
                height={362}
              />
              <figcaption>After</figcaption>
            </figure>
          </div>
        </article>
      </LandingSection>

      <LandingSection>
        <article className="lp-panel offer-panel">
          <h2>Professional Sealing</h2>
          <p>
            Once your concrete is clean and dry, we apply a surface-matched
            sealer to lock out water, oil, and UV damage while enhancing colour.
          </p>
          <ul>
            <li>Penetrating or film-forming systems based on surface type</li>
            <li>Weather-aware scheduling for better cure and durability</li>
            <li>2-step workflow: wash first, seal second</li>
          </ul>
          <div className="offer-media-row" aria-label="Before and after media">
            <figure className="media-card">
              <Image
                src={media.beforeAfter}
                alt="Diane Allen concrete sealing before and after"
                width={619}
                height={362}
              />
              <figcaption>Before and After</figcaption>
            </figure>
            <figure className="media-card">
              <Image
                src={media.sealingSecond}
                alt="Driveway sealing before and after"
                width={619}
                height={362}
              />
              <figcaption>Before and After</figcaption>
            </figure>
          </div>
          <div className="quick-motion" aria-label="Quick motion media strip">
            <div className="quick-motion-track">
              {loopedProcessStripItems.map((item, index) =>
                item.type === "video" ? (
                  <video
                    key={`video-${item.src}-${index}`}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  >
                    <source src={item.src} type="video/mp4" />
                    {item.fallbackSrc ? (
                      <source src={item.fallbackSrc} type="video/mp4" />
                    ) : null}
                  </video>
                ) : (
                  <Image
                    key={`image-${item.src}-${index}`}
                    src={item.src}
                    alt="Concrete sealing and washing results"
                    width={380}
                    height={216}
                  />
                )
              )}
            </div>
          </div>
        </article>
      </LandingSection>

      <LandingSection aria-label="What we seal">
        <LandingPanel>
          <h2>What We Seal</h2>
          <div className="what-seal-layout">
            <div className="what-seal-copy">
              <ul className="what-seal-list" aria-label="Surfaces we seal">
                <li>Concrete driveways &amp; garage pads</li>
                <li>(broom-finish, smooth, or stamped)</li>
                <li>Walkways &amp; entryways</li>
                <li>Patios &amp; pool decks</li>
              </ul>
              <p>
                All sealing services are a two day process. One to wash the
                surface.
              </p>
              <p>The second to seal the surface.</p>
              <p>
                Sealing days require dry weather, making the schedule weather
                dependent.
              </p>
              <p>
                Pavers are the exception to the rule with a three day service
                time. After power washing joint sand is needed to refill the
                gaps between stones so that the hardscape does not shift in the
                future. Polymeric joint sand can be installed as well to further
                improve the longevity of the hardscape.
              </p>
            </div>
            <div className="what-seal-images" aria-label="Service types">
              <figure className="tile compact">
                <Image src={media.stamped} alt="Stamped concrete" width={320} height={320} />
                <figcaption>Stamped Concrete</figcaption>
              </figure>
              <figure className="tile compact">
                <Image src={media.aggregate} alt="Exposed aggregate" width={320} height={320} />
                <figcaption>Exposed Aggregate</figcaption>
              </figure>
              <figure className="tile compact">
                <Image src={media.flagstone} alt="Flagstone" width={320} height={320} />
                <figcaption>Flagstone</figcaption>
              </figure>
              <figure className="tile compact">
                <Image src={media.pavers} alt="Pavers" width={320} height={320} />
                <figcaption>Pavers</figcaption>
              </figure>
            </div>
          </div>
        </LandingPanel>
      </LandingSection>

      <LandingSection aria-label="Trust and reviews">
        <LandingPanel className="trust-card">
          <h2>Why Rocket Wash</h2>
          <div className="trust-slides" aria-label="Slideshow text from Rocket Wash site">
            <p>We are a family owned and operated service business. A good name is better than gold.</p>
            <p>Fully Licensed and Insured. 3M in Liability. WORKSAFE.</p>
            <p>We are proud of our quality work and taking care of our customers.</p>
            <p>After 4 years in business Rocket Wash is a name you can trust, check out our reviews on Google and Facebook.</p>
          </div>
          <div className="trust-strip" aria-label="Trust badges and local logos">
            <Image src={media.ladysmith} alt="Town of Ladysmith logo" width={147} height={196} />
            <Image src={media.worksafe} alt="Worksafe badge" width={167} height={38} />
            <Image src={media.zensurance} alt="Zensurance badge" width={145} height={145} />
          </div>
        </LandingPanel>
      </LandingSection>

      <LandingSection aria-label="FAQ">
        <LandingPanel className="faq-panel">
          <h2>FAQ</h2>
          <div className="faq-list">
            <details>
              <summary>How long after cleaning can you seal my driveway?</summary>
              <p>
                Usually 24 to 48 hours depending on weather and moisture. We
                test before sealing.
              </p>
            </details>
            <details>
              <summary>How long does sealer last?</summary>
              <p>
                Most sealers protect for 2 to 5 years depending on product and
                traffic.
              </p>
            </details>
            <details>
              <summary>Will sealing make my driveway slippery?</summary>
              <p>
                No. We can add anti-slip additives for sloped or high-traffic
                areas.
              </p>
            </details>
            <details>
              <summary>How soon can I park on my driveway after sealing?</summary>
              <p>
                Foot traffic is typically fine after 24 hours; vehicles after
                48 to 72 hours.
              </p>
            </details>
            <details>
              <summary>
                Do you offer a package that includes both cleaning and sealing?
              </summary>
              <p>
                Yes. Sealing always includes our full cleaning prep as step
                one.
              </p>
            </details>
            <details>
              <summary>What areas do you serve?</summary>
              <p>
                Ladysmith, Cowichan Valley, and surrounding areas. We can also
                come out to Nanaimo and Victoria to seal.
              </p>
            </details>
          </div>
        </LandingPanel>
      </LandingSection>

      <LandingSection id="quote-form" className="form-wrap">
        <LandingPanel className="form-panel">
          <h2>Get Your Free Concrete Sealing Quote</h2>
          <p>
            Fill out the form and we will contact you with a free estimate.
            Need a quick answer? Call <a href={phoneHref}>{phoneDisplay}</a>.
          </p>
          <LeadForm tracking={tracking} />
        </LandingPanel>
      </LandingSection>

      <footer className="lp-footer" aria-label="Rocket Wash footer">
        <div className="lp-container lp-footer-inner">
          <div className="lp-footer-brand">
            <Image src={media.logo} alt="Rocket Wash logo" width={120} height={36} />
            <p>Rocket Wash | Cowichan Valley</p>
          </div>
          <a className="btn btn-outline" href={phoneHref}>
            Call {phoneDisplay}
          </a>
        </div>
      </footer>

        <a className="sticky-call" href={phoneHref}>
          Tap to Call {phoneDisplay}
        </a>
      </main>
  );
}
