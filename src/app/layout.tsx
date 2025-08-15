import type { Metadata } from "next";
import { Roboto, Rubik } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const rubik = Rubik({
  variable: "--font-rubik",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sumbu Labs",
  description: "Aligning Your Ideas Across Every Axis",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${rubik.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
