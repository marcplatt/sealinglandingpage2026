export type MarketingVideoAsset = {
  id: string;
  title: string;
  blobUrl: string;
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
export const marketingVideos = {
  concreteSealingHero: {
    id: "concrete-sealing-hero",
    title: "Concrete Sealing Process",
    blobUrl:
      "https://kpcdw7qepgbzvqd8.private.blob.vercel-storage.com/concreteSealingProcess.mp4?vercel-blob-valid-until=1783635250033&vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfa3BjRFc3UWVwZ0JadnFEOCIsIm93bmVySWQiOiJ0ZWFtXzhjWkY5cWhETDdVRG5mYXpXdTFKcXBLSiIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgzNjc4MzY5NTc2LCJpYXQiOjE3ODM2MzUxNjk5MDF9.mVW_7VH-q3wsLlPK4MuqNXVDINA5bXgbsA2ZiXEjco0&vercel-blob-signature=PofeV8e2wsv1LM9x7qpvtnHYhkeFkJclemkun9U-Cyw",
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
      "https://kpcdw7qepgbzvqd8.private.blob.vercel-storage.com/driveway1015s.mp4?vercel-blob-valid-until=1783635257297&vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfa3BjRFc3UWVwZ0JadnFEOCIsIm93bmVySWQiOiJ0ZWFtXzhjWkY5cWhETDdVRG5mYXpXdTFKcXBLSiIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgzNjc4MzY5NTc2LCJpYXQiOjE3ODM2MzUxNjk5MDF9.mVW_7VH-q3wsLlPK4MuqNXVDINA5bXgbsA2ZiXEjco0&vercel-blob-signature=ebWpqd1G-KxH0nsgx-Ze5sCbFQC3xQxgllgfwoqBfh8",
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
      "https://kpcdw7qepgbzvqd8.private.blob.vercel-storage.com/powerwashA.mp4?vercel-blob-valid-until=1783635263881&vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfa3BjRFc3UWVwZ0JadnFEOCIsIm93bmVySWQiOiJ0ZWFtXzhjWkY5cWhETDdVRG5mYXpXdTFKcXBLSiIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgzNjc4MzY5NTc2LCJpYXQiOjE3ODM2MzUxNjk5MDF9.mVW_7VH-q3wsLlPK4MuqNXVDINA5bXgbsA2ZiXEjco0&vercel-blob-signature=JCP3aFIMWq2jGlDYuCKdSuheRa03jb0lYKmy9qukhw8",
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
      "https://kpcdw7qepgbzvqd8.private.blob.vercel-storage.com/powerwashADriveway.mp4?vercel-blob-valid-until=1783635271529&vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfa3BjRFc3UWVwZ0JadnFEOCIsIm93bmVySWQiOiJ0ZWFtXzhjWkY5cWhETDdVRG5mYXpXdTFKcXBLSiIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgzNjc4MzY5NTc2LCJpYXQiOjE3ODM2MzUxNjk5MDF9.mVW_7VH-q3wsLlPK4MuqNXVDINA5bXgbsA2ZiXEjco0&vercel-blob-signature=Tnc78SwGIuGexlkAk35iW09k9wA54AWn_FakotX3xRA",
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
      "https://kpcdw7qepgbzvqd8.private.blob.vercel-storage.com/powerwashB.mp4?vercel-blob-valid-until=1783635276993&vercel-blob-delegation=eyJzdG9yZUlkIjoic3RvcmVfa3BjRFc3UWVwZ0JadnFEOCIsIm93bmVySWQiOiJ0ZWFtXzhjWkY5cWhETDdVRG5mYXpXdTFKcXBLSiIsInBhdGhuYW1lIjoiKiIsIm9wZXJhdGlvbnMiOlsiZ2V0IiwiaGVhZCJdLCJ2YWxpZFVudGlsIjoxNzgzNjc4MzY5NTc2LCJpYXQiOjE3ODM2MzUxNjk5MDF9.mVW_7VH-q3wsLlPK4MuqNXVDINA5bXgbsA2ZiXEjco0&vercel-blob-signature=zgL9cAcmiYbuWE2r_-gjYLK0m6EoRHPB4TE1R677VhE",
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
