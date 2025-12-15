import { LIFFProvider } from "../providers/liff-providers";
import "./globals.css";

export const metadata = {
  title: "LIFF App",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LIFFProvider>{children}</LIFFProvider>
      </body>
    </html>
  );
}
