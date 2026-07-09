// Future-only utility example: keep uploads server-side.
//
// This project currently renders public marketing videos from fixed Blob URLs.
// No upload path is required for the landing page flow.
//
// If you enable uploads later:
// 1) Install package: npm install @vercel/blob
// 2) Set BLOB_READ_WRITE_TOKEN in Vercel project env vars
// 3) Implement a protected server route or action (do not expose token client-side)
//
// Example shape (intentionally commented out until needed):
//
// import { put } from "@vercel/blob";
//
// export async function uploadMarketingVideoExample(file: File) {
//   return put(`landing/${file.name}`, file, {
//     access: "public"
//   });
// }

export {};
