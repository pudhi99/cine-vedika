import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: {
    default: "Cine Vedika - Movie Information System",
    template: "%s | Cine Vedika",
  },
  description:
    "Cine Vedika is a comprehensive movie information system that tracks and displays theatrical and OTT releases, providing real-time updates on release dates and availability.",
  keywords: [
    "movies",
    "OTT releases",
    "theatrical releases",
    "movie database",
    "film information",
    "cinema",
    "streaming platforms",
  ],
  authors: [{ name: "Cine Vedika Team" }],
  creator: "Cine Vedika",
  publisher: "Cine Vedika",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://cine-vedika.vercel.app"),
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/en-US",
    },
  },
  openGraph: {
    title: "Cine Vedika - Movie Information System",
    description:
      "Track theatrical and OTT movie releases with real-time updates on dates and availability",
    url: "https://cine-vedika.vercel.app",
    siteName: "Cine Vedika",
    // images: [
    //   {
    //     url: "/images/og-image.jpg",
    //     width: 1200,
    //     height: 630,
    //     alt: "Cine Vedika - Your Ultimate Movie Information System",
    //   },
    // ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cine Vedika - Movie Information System",
    description:
      "Track theatrical and OTT movie releases with real-time updates on dates and availability",
    // images: ["/images/twitter-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    shortcut: ["/shortcut-icon.png"],
    apple: [
      { url: "/apple-icon.png" },
      { url: "/apple-icon-180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "apple-touch-icon-precomposed",
        url: "/apple-touch-icon-precomposed.png",
      },
    ],
  },
  manifest: "/site.webmanifest",
  verification: {
    google: "Fos7_lSi_2HDw4RzlHudjLghiVMyKA_4qWknDr79P9w",
    yandex: "yandex-verification-code",
  },
  applicationName: "Cine Vedika",
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  category: "entertainment",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
