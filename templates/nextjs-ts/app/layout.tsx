import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LIFFProvider } from "../providers/liff-providers";

export const metadata: Metadata = {
  title: "LIFF App",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LIFFProvider>{children}</LIFFProvider>
      </body>
    </html>
  );
}
