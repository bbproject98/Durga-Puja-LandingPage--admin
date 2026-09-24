import type { Metadata, Viewport } from "next";
import Script from "next/script";
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
        <Script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-N6D7HH8');
            `,
          }}
        />

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JD89KXBSS2"
          strategy="afterInteractive"
        />

        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-JD89KXBSS2');
            `,
          }}
        />

        {/* Main Application Content */}
        {children}

        {/* Floating Call Button - Optimized for Mobile & Desktop */}
        <a
          href="tel:+918240765499"
          className="fixed bottom-20 right-2 sm:bottom-6 sm:right-6 z-50 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-amber-500 text-slate-950 shadow-2xl transition-all duration-300 hover:scale-110 hover:bg-amber-400 focus:outline-none"
          aria-label="Call BroomBoom Cabs"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-5 w-5 sm:h-6 sm:w-6"
          >
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        </a>
      </body>
    </html>
  );
}