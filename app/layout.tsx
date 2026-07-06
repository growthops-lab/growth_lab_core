import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Growth Lab Affiliate Media Platform",
  description: "Affiliate media and social account operations dashboard"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
