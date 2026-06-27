import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "\u30c8\u30ed\u30c3\u30b3\u306b\u3083\u3093\u306b\u3083\u3093",
  description:
    "\u5c0f\u3055\u306a\u60d1\u661f\u3067\u732b\u306e\u30c8\u30ed\u30c3\u30b3\u3092\u5c0e\u304f\u30d1\u30ba\u30eb\u30b2\u30fc\u30e0\u306eWeb\u30d7\u30ed\u30c8\u30bf\u30a4\u30d7\u3002",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
