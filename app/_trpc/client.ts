import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "@/server/index";
import { createTRPCReact } from "@trpc/react-query";

export function getBaseUrl() {
  if (typeof window !== "undefined") return "";

  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

// export const trpc = createTRPCNext<AppRouter>({
//   config(opts) {
//     return {
//       links: [
//         httpBatchLink({
//           url: `${getBaseUrl()}/api/trpc`,

//           async headers() {
//             return {};
//           },
//         }),
//       ],
//     };
//   },
//   ssr: false,
// });
export const trpc = createTRPCReact<AppRouter>();
