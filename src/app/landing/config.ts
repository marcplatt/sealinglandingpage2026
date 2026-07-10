export type LandingPageConfig = {
  slug: string;
  routeLabel: string;
  title: string;
  description: string;
  heroTitle: string;
  heroSubhead: string;
  cleaningTitle: string;
  cleaningBody: string;
  cleaningBullets: string[];
  sealingTitle: string;
  sealingBody: string;
  sealingBullets: string[];
  surfaceBullets: string[];
  quoteHeading: string;
  intentServiceType: string;
};

export const landingPageConfigs: LandingPageConfig[] = [
  {
    slug: "concrete-sealing-cowichan",
    routeLabel: "Concrete Sealing Cowichan",
    title: "Concrete Sealing Cowichan | Rocket Wash",
    description:
      "Concrete Sealing Cowichan service page. Call now or request a free quote online.",
    heroTitle: "Concrete Sealing Cowichan",
    heroSubhead:
      "We clean, treat, and seal your driveway, patio, or walkway so it stays protected from oil, tire marks, and UV for years, not months.",
    cleaningTitle: "Concrete Cleaning",
    cleaningBody:
      "Have tire marks, black streaks, or moss that keeps coming back? We deep-clean concrete to restore a bright, even finish before sealing.",
    cleaningBullets: [
      "Rust, salts, algae, and grime treatment",
      "Driveway, patio, and walkway surface prep",
      "Done right to maximize sealer performance"
    ],
    sealingTitle: "Professional Sealing",
    sealingBody:
      "Once your concrete is clean and dry, we apply a surface-matched sealer to lock out water, oil, and UV damage while enhancing colour.",
    sealingBullets: [
      "Penetrating or film-forming systems based on surface type",
      "Weather-aware scheduling for better cure and durability",
      "2-step workflow: wash first, seal second"
    ],
    surfaceBullets: [
      "Concrete driveways & garage pads",
      "Broom-finish, smooth, or stamped slabs",
      "Walkways & entryways",
      "Patios & pool decks"
    ],
    quoteHeading: "Get Your Free Concrete Sealing Quote",
    intentServiceType: "concrete_sealing"
  },
  {
    slug: "paver-sealing-cowichan",
    routeLabel: "Paver Sealing Cowichan",
    title: "Paver Sealing Cowichan | Rocket Wash",
    description:
      "Paver Sealing Cowichan service page for patios, walkways, and interlock surfaces.",
    heroTitle: "Paver Sealing Cowichan",
    heroSubhead:
      "We clean, re-sand, and seal your patio pavers and walkways so they keep their colour, stay tighter, and resist moss and staining longer.",
    cleaningTitle: "Paver Cleaning And Prep",
    cleaningBody:
      "We remove dirt, weeds, and buildup from paver joints and surface texture before any sealer goes down.",
    cleaningBullets: [
      "Joint cleaning before re-sanding",
      "Moss, grime, and stain removal",
      "Prep that helps sealer bond evenly"
    ],
    sealingTitle: "Paver Sealing",
    sealingBody:
      "Once the pavers are stabilized and dry, we apply a paver-appropriate sealer to lock in colour and protect against moisture and wear.",
    sealingBullets: [
      "Joint sand stabilization support",
      "Colour-enhancing or natural-look options",
      "Protection against weeds, fading, and staining"
    ],
    surfaceBullets: [
      "Patio pavers & courtyard spaces",
      "Interlock walkways & entryways",
      "Pool surrounds & seating areas",
      "Paver driveways and aprons"
    ],
    quoteHeading: "Get Your Free Paver Sealing Quote",
    intentServiceType: "paver_sealing"
  },
  {
    slug: "flagstone-sealing-cowichan",
    routeLabel: "Flagstone Sealing Cowichan",
    title: "Flagstone Sealing Cowichan | Rocket Wash",
    description:
      "Flagstone Sealing Cowichan service page for natural stone patios, entries, and walkways.",
    heroTitle: "Flagstone Sealing Cowichan",
    heroSubhead:
      "We carefully clean and seal flagstone so your natural stone keeps its colour, texture, and weather resistance without a rushed finish.",
    cleaningTitle: "Flagstone Cleaning And Prep",
    cleaningBody:
      "Natural stone needs a lighter touch than standard concrete. We prep the surface to remove buildup without rough treatment.",
    cleaningBullets: [
      "Stone-safe cleaning approach",
      "Organic growth and grime removal",
      "Surface prep matched to natural stone"
    ],
    sealingTitle: "Flagstone Sealing",
    sealingBody:
      "We seal flagstone with products suited to natural stone so it resists moisture, staining, and wear while keeping its character.",
    sealingBullets: [
      "Natural-look or enhanced-finish options",
      "Protection against moisture intrusion",
      "Careful application for even coverage"
    ],
    surfaceBullets: [
      "Flagstone patios & entertaining areas",
      "Natural stone walkways",
      "Stone steps & entry features",
      "Pool surrounds and landscape stone"
    ],
    quoteHeading: "Get Your Free Flagstone Sealing Quote",
    intentServiceType: "flagstone_sealing"
  },
  {
    slug: "exposed-aggregate-sealing-cowichan",
    routeLabel: "Exposed Aggregate Sealing Cowichan",
    title: "Exposed Aggregate Sealing Cowichan | Rocket Wash",
    description:
      "Exposed Aggregate Sealing Cowichan service page for textured driveways, aprons, and walkways.",
    heroTitle: "Exposed Aggregate Sealing Cowichan",
    heroSubhead:
      "We clean and reseal exposed aggregate so the texture, colour, and topcoat hold up better against rain, traffic, and UV exposure.",
    cleaningTitle: "Aggregate Cleaning And Prep",
    cleaningBody:
      "Textured aggregate traps dirt and weathering faster than smooth slabs. We prep it thoroughly before resealing.",
    cleaningBullets: [
      "Deep cleaning across textured surfaces",
      "Prep for worn or weathered topcoats",
      "Careful washing before reseal application"
    ],
    sealingTitle: "Exposed Aggregate Resealing",
    sealingBody:
      "We apply a durable sealer that helps keep aggregate surfaces protected without flattening the texture that makes them stand out.",
    sealingBullets: [
      "Reseal for faded or patchy areas",
      "Weather and traffic protection",
      "Finish options suited to aggregate texture"
    ],
    surfaceBullets: [
      "Exposed aggregate driveways",
      "Garage aprons & entry pads",
      "Walkways & front steps",
      "Patios with textured stone finish"
    ],
    quoteHeading: "Get Your Free Exposed Aggregate Quote",
    intentServiceType: "exposed_aggregate_sealing"
  },
  {
    slug: "stamped-concrete-sealing-cowichan",
    routeLabel: "Stamped Concrete Sealing Cowichan",
    title: "Stamped Concrete Sealing Cowichan | Rocket Wash",
    description:
      "Stamped Concrete Sealing Cowichan service page for decorative patios, pool decks, and driveways.",
    heroTitle: "Stamped Concrete Sealing Cowichan",
    heroSubhead:
      "We restore and seal stamped concrete so decorative colour and pattern stay sharper while the surface resists wear, moisture, and fading.",
    cleaningTitle: "Stamped Surface Cleaning",
    cleaningBody:
      "Stamped concrete collects dirt in its pattern and low spots. We prep the surface to clean it out before sealing.",
    cleaningBullets: [
      "Pattern-deep cleaning before sealing",
      "Prep for decorative surfaces and colour",
      "Wash process designed for stamped texture"
    ],
    sealingTitle: "Stamped Concrete Sealing",
    sealingBody:
      "We seal stamped concrete with finish options that protect the pattern, enrich the colour, and improve surface longevity.",
    sealingBullets: [
      "Colour-enhancing finish options",
      "Protection from fading and wear",
      "Professional application on decorative concrete"
    ],
    surfaceBullets: [
      "Stamped patios & pool decks",
      "Decorative stamped driveways",
      "Stamped walkways & entries",
      "Feature concrete around outdoor living spaces"
    ],
    quoteHeading: "Get Your Free Stamped Concrete Quote",
    intentServiceType: "stamped_concrete_sealing"
  },
  {
    slug: "driveway-sealing-cowichan",
    routeLabel: "Driveway Sealing Cowichan",
    title: "Driveway Sealing Cowichan | Rocket Wash",
    description:
      "Driveway Sealing Cowichan service page for concrete and aggregate driveways.",
    heroTitle: "Driveway Sealing Cowichan",
    heroSubhead:
      "We clean and seal concrete driveways so they resist stains, UV damage, and weather while keeping a cleaner, more durable finish.",
    cleaningTitle: "Driveway Cleaning And Prep",
    cleaningBody:
      "Driveways take the most abuse from tires, oil, and weather. We prep them properly before any sealer goes down.",
    cleaningBullets: [
      "Oil, grime, and black-mark treatment",
      "Prep for concrete and aggregate driveways",
      "Cleaning that supports better sealer life"
    ],
    sealingTitle: "Driveway Sealing",
    sealingBody:
      "We apply driveway-ready sealer systems that help concrete resist moisture, staining, and surface wear from daily traffic.",
    sealingBullets: [
      "Concrete and aggregate driveway coverage",
      "Protection against rain, UV, and wear",
      "Clear quote and weather-aware scheduling"
    ],
    surfaceBullets: [
      "Concrete driveways & aprons",
      "Exposed aggregate driveways",
      "Parking pads & entry pads",
      "Driveway borders and walkway tie-ins"
    ],
    quoteHeading: "Get Your Free Driveway Sealing Quote",
    intentServiceType: "driveway_sealing"
  },
  {
    slug: "patio-sealing-cowichan",
    routeLabel: "Patio Sealing Cowichan",
    title: "Patio Sealing Cowichan | Rocket Wash",
    description:
      "Patio Sealing Cowichan service page for concrete, paver, and stone patios.",
    heroTitle: "Patio Sealing Cowichan",
    heroSubhead:
      "We clean and seal patio surfaces so your outdoor space looks better, dries cleaner, and holds up longer through sun, rain, and regular use.",
    cleaningTitle: "Patio Cleaning And Prep",
    cleaningBody:
      "Patio surfaces collect moss, grime, and weathering fast. We prep them thoroughly before sealing.",
    cleaningBullets: [
      "Surface prep for paver, stone, and concrete patios",
      "Moss and stain treatment where needed",
      "Cleaning that helps sealers finish evenly"
    ],
    sealingTitle: "Patio Sealing",
    sealingBody:
      "We apply the right sealer for your patio surface so it resists staining, moisture, and fading while staying easier to maintain.",
    sealingBullets: [
      "Options for concrete, pavers, and flagstone",
      "Protection from weather and outdoor wear",
      "Application timed for proper cure conditions"
    ],
    surfaceBullets: [
      "Concrete patios & pool decks",
      "Paver patios & courtyards",
      "Flagstone entertaining areas",
      "Walkways and adjoining outdoor surfaces"
    ],
    quoteHeading: "Get Your Free Patio Sealing Quote",
    intentServiceType: "patio_sealing"
  },
  {
    slug: "concrete-cleaning-and-sealing-cowichan",
    routeLabel: "Concrete Cleaning And Sealing Cowichan",
    title: "Concrete Cleaning And Sealing Cowichan | Rocket Wash",
    description:
      "Concrete Cleaning and Sealing Cowichan service page for restoring and protecting driveways, patios, and walkways.",
    heroTitle: "Concrete Cleaning And Sealing Cowichan",
    heroSubhead:
      "We wash, restore, and seal concrete in one coordinated service so driveways, patios, and walkways look cleaner and stay protected longer.",
    cleaningTitle: "Concrete Surface Restoration",
    cleaningBody:
      "If your surface is stained, dull, or weathered, we start by cleaning it thoroughly so the final seal has a better base to bond to.",
    cleaningBullets: [
      "Deep cleaning before final sealing",
      "Stain, grime, and organic-growth treatment",
      "Prep that improves appearance and durability"
    ],
    sealingTitle: "Clean And Seal Service",
    sealingBody:
      "After the concrete is properly cleaned and dry, we seal it to help resist future staining, moisture, and UV wear.",
    sealingBullets: [
      "One service flow from wash to seal",
      "Protection for restored concrete surfaces",
      "Driveway, patio, and walkway coverage"
    ],
    surfaceBullets: [
      "Concrete driveways & aprons",
      "Walkways & entry pads",
      "Patios & outdoor slab areas",
      "Stamped or broom-finish concrete"
    ],
    quoteHeading: "Get Your Free Clean And Seal Quote",
    intentServiceType: "concrete_cleaning_and_sealing"
  },
  {
    slug: "paver-cleaning-and-sealing-cowichan",
    routeLabel: "Paver Cleaning And Sealing Cowichan",
    title: "Paver Cleaning And Sealing Cowichan | Rocket Wash",
    description:
      "Paver Cleaning and Sealing Cowichan service page for patios, walkways, and interlock hardscapes.",
    heroTitle: "Paver Cleaning And Sealing Cowichan",
    heroSubhead:
      "We clean, restore, and seal pavers so patios and walkways look sharper, keep their joint structure better, and resist moss and staining.",
    cleaningTitle: "Paver Surface Cleaning",
    cleaningBody:
      "We remove buildup from the face and joints of pavers before re-sanding and sealing the hardscape.",
    cleaningBullets: [
      "Joint and surface cleaning before sealing",
      "Prep for patio pavers and walkways",
      "Removal of grime, weeds, and loose debris"
    ],
    sealingTitle: "Paver Clean And Seal",
    sealingBody:
      "After cleaning and stabilization, we seal the pavers to support colour retention, easier maintenance, and better long-term protection.",
    sealingBullets: [
      "Joint sand stabilization support",
      "Protection against stains and weathering",
      "Clean finish for patio and walkway pavers"
    ],
    surfaceBullets: [
      "Paver patios & seating areas",
      "Walkways & entry paths",
      "Pool surrounds & courtyards",
      "Interlock driveways and hardscape features"
    ],
    quoteHeading: "Get Your Free Paver Clean And Seal Quote",
    intentServiceType: "paver_cleaning_and_sealing"
  }
];

export const landingPageSlugs = landingPageConfigs.map((config) => config.slug);

export const landingPageConfigBySlug = Object.fromEntries(
  landingPageConfigs.map((config) => [config.slug, config])
) as Record<string, LandingPageConfig>;

export function getLandingPageConfig(slug: string) {
  return landingPageConfigBySlug[slug];
}