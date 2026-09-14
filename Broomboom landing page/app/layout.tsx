import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F59E0B",
};

export const metadata: Metadata = {
  // Primary Meta Tags
  title: "Celebrate Durga Puja 2026 with BroomBoom Cabs",
  description:
    "Experience the magic of Kolkata Durga Puja Car rental and outstation cabs packages with seamless travel solutions designed to make your festive season stress-free. Whether you are navigating the city’s radiant streets or embarking on a long weekend escape, BroomBoom Cabs offers premium, 100% fixed-rate travel across West Bengal and beyond.",
  keywords: [
    "durga puja 2026",
    "kolkata durga puja 2026",
    "durga puja car rental",
    "outstation durga puja",
    "kolkata car rental for pandal hopping",
    "puja car rental",
  ],
  robots: { index: true, follow: true },

  // Verification & ownership
  verification: {
    other: {
      "facebook-domain-verification": "cn9ly9midci1qm2kb9tokwvglffd7g",
    },
  },
  other: {
    copyright: "2026 BroomBoom Transportation Services Private Limited",
  },

  // Icons & Favicons (Google Search, Browsers, iOS, Android PWA)
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-192x192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",

  // Open Graph
  openGraph: {
    title: "Celebrate Durga Puja 2026 with BroomBoom Cabs",
    description:
      "Experience the magic of Kolkata Durga Puja Car rental and outstation cabs packages with seamless travel solutions designed to make your festive season stress-free.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Rozha+One&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-[#FFFDF7] text-slate-900 antialiased selection:bg-amber-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}