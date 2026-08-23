import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import ThemeProvider from "@/components/layout/ThemeProvider";
import SmoothScroll from "@/components/layout/SmoothScroll";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoaderProvider from "@/components/loading/LoaderProvider";
import "./globals.css";

const displayFont = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "BroScience Eduservices",
    template: "%s | BroScience Eduservices",
  },
  description:
    "Premium education services — structured learning, expert mentorship, and competitive exam preparation for Classes 7–12, JEE, and NEET.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/brand/favicon.png", type: "image/png", sizes: "64x64" },
    ],
    apple: "/apple-icon.png",
  },
  keywords: [
    "education",
    "JEE",
    "NEET",
    "coaching",
    "mentorship",
    "BroScience",
    "competitive exams",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-theme="light"
      suppressHydrationWarning
      className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add("bs-loading");`,
          }}
        />
        <div id="bs-boot-overlay" className="bs-boot-overlay" aria-hidden="true" />
        <noscript>
          <style>{`.bs-boot-overlay{display:none!important}html.bs-loading{overflow:auto}`}</style>
        </noscript>
        <ThemeProvider>
          <LoaderProvider>
            <SmoothScroll>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </SmoothScroll>
          </LoaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
