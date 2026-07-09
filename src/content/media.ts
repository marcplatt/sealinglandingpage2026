export type MarketingVideoAsset = {
  id: string;
  title: string;
  blobUrl: string;
  localFallbackUrl?: string;
  posterUrl?: string;
  ariaLabel: string;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  controls: boolean;
};

// Paste public Vercel Blob URLs here.
// Expected format example:
// https://<store-id>.public.blob.vercel-storage.com/landing/my-video.mp4
//
// These are public marketing assets, so no auth headers are needed on the client.
// Env vars are only needed if you later add server-side upload APIs.
// Avoid signed private URLs in production because they can expire.
export const marketingVideos = {
  concreteSealingHero: {
    id: "concrete-sealing-hero",
    title: "Concrete Sealing Process",
    blobUrl:
      "https://kpuloe9x9gi0ekcc.public.blob.vercel-storage.com/concreteSealingProcess.mp4",
    localFallbackUrl: "/media/concreteSealingProcess.mp4",
    posterUrl: "/media/stamped-concrete.avif",
    ariaLabel: "Concrete sealing process video",
    autoplay: true,
    muted: true,
    loop: true,
    controls: false
  },
  drivewayWash: {
    id: "driveway-wash",
    title: "Driveway Wash and Prep",
    blobUrl:
      "https://kpuloe9x9gi0ekcc.public.blob.vercel-storage.com/driveway1015s.mp4",
    localFallbackUrl: "/media/driveway1015s.mp4",
    posterUrl: "/media/driveway-before-after.jpg",
    ariaLabel: "Driveway wash and prep video",
    autoplay: true,
    muted: true,
    loop: true,
    controls: false
  },
  powerwashA: {
    id: "powerwash-a",
    title: "Power Wash Clip A",
    blobUrl:
      "https://kpuloe9x9gi0ekcc.public.blob.vercel-storage.com/powerwashA.mp4",
    localFallbackUrl: "/media/powerwashA.mp4",
    posterUrl: "/media/stamped-concrete.avif",
    ariaLabel: "Power wash process clip A",
    autoplay: true,
    muted: true,
    loop: true,
    controls: false
  },
  powerwashDriveway: {
    id: "powerwash-driveway",
    title: "Power Wash Driveway",
    blobUrl:
      "https://kpuloe9x9gi0ekcc.public.blob.vercel-storage.com/powerwashADriveway.mp4",
    localFallbackUrl: "/media/powerwashADriveway.mp4",
    posterUrl: "/media/driveway-before-after.jpg",
    ariaLabel: "Power wash driveway clip",
    autoplay: true,
    muted: true,
    loop: true,
    controls: false
  },
  powerwashB: {
    id: "powerwash-b",
    title: "Power Wash Clip B",
    blobUrl:
      "https://kpuloe9x9gi0ekcc.public.blob.vercel-storage.com/powerwashB.mp4",
    localFallbackUrl: "/media/powerwashB.mp4",
    posterUrl: "/media/stamped-concrete.avif",
    ariaLabel: "Power wash process clip B",
    autoplay: true,
    muted: true,
    loop: true,
    controls: false
  }
} as const satisfies Record<string, MarketingVideoAsset>;

export const processStripVideoIds = [
  "concreteSealingHero",
  "drivewayWash",
  "powerwashA",
  "powerwashDriveway",
  "powerwashB",
  "concreteSealingHero",
  "drivewayWash"
] as const;
