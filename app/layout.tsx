import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Roseburg Tracker — Business Directory",
  description: "Discover local businesses, services, and organizations in Roseburg, Oregon.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-rt-bg text-rt-text font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
