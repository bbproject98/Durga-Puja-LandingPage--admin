import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#F59E0B",
};

export const metadata: Metadata = {
  title: "BroomBoom Cabs | Kolkata Durga Puja Pandal Hopping & Chauffeur Rental 2026",
  description:
    "Book premium AC Sedan, SUV, Innova Crysta & Tempo Travellers (13, 15, 17 Seater) with BroomBoom Cabs for Kolkata Durga Puja Pandal Hopping & Outstation Trips. Zero Surge, Verified Drivers & VIP Passes.",
  icons: {
    icon: "/images/broomboom-logo.png",
    shortcut: "/images/broomboom-logo.png",
    apple: "/images/broomboom-logo.png",
  },
  keywords: [
    "BroomBoom Cabs",
    "Durga Puja Kolkata car rental",
    "Pandal hopping cab Kolkata",
    "Innova Crysta rental Durga Puja",
    "Tempo traveller 13 15 17 seater Kolkata puja",
    "VIP pandal pass Kolkata",
    "Digha Mandarmani puja outstation cab",
    "Shantiniketan puja tour car",
  ],
  openGraph: {
    title: "BroomBoom Cabs — Kolkata Durga Puja Pandal Hopping 2026",
    description:
      "Celebrate Durga Puja without traffic & parking hassle. 4 to 17 seater AC fleet with route specialist chauffeurs by BroomBoom Cabs.",
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