import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Visual Workflow — منصة بناء الورك فلو",
    template: "%s | Visual Workflow"
  },
  description: "منصة احترافية لبناء وإدارة ومشاركة سير العمل التعاونية. Professional collaborative workflow builder SaaS.",
  keywords: ["workflow", "automation", "collaboration", "SaaS", "visual builder"],
  authors: [{ name: "Visual Workflow Team" }],
  openGraph: {
    title: "Visual Workflow",
    description: "Professional collaborative workflow builder SaaS",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
