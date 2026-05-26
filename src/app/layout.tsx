import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Providers } from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Visual Workflow",
  description: "Collaborative workflow builder SaaS"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const p = window.location.pathname;
                if (p.startsWith('/en')) {
                  document.documentElement.dir = 'ltr';
                  document.documentElement.lang = 'en';
                } else {
                  document.documentElement.dir = 'rtl';
                  document.documentElement.lang = 'ar';
                }
              } catch (_) {}
            `
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
