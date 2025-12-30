import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EmersonEIMS Test",
  description: "Testing",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div style={{ padding: '20px', background: '#f0f0f0', minHeight: '100vh' }}>
          <h1 style={{ color: '#333' }}>Layout Working</h1>
          {children}
        </div>
      </body>
    </html>
  );
}
