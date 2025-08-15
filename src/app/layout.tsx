import type { Metadata } from "next";
import { Roboto, Rubik } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
});

const rubik = Rubik({
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-rubik",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "arial"],
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
    <html lang="en" style={{ backgroundColor: "#010A17" }}>
      <head>
        <meta name="color-scheme" content="dark" />
        <meta name="theme-color" content="#010A17" />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            html, body { 
              background-color: #010A17 !important; 
              margin: 0; 
              padding: 0; 
            }
          `,
          }}
        />
      </head>
      <body
        className={`${roboto.variable} ${rubik.variable} antialiased`}
        style={{ backgroundColor: "#010A17" }}
      >
        {children}
      </body>
    </html>
  );
}
