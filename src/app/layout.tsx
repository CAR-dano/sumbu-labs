import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const roboto = localFont({
  src: [
    {
      path: "../assets/fonts/Roboto/static/Roboto-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/Roboto/static/Roboto-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Roboto/static/Roboto-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/Roboto/static/Roboto-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-roboto",
  display: "swap",
  fallback: ["system-ui", "arial"],
});

const rubik = localFont({
  src: [
    {
      path: "../assets/fonts/Rubik/static/Rubik-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/Rubik/static/Rubik-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Rubik/static/Rubik-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/Rubik/static/Rubik-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/Rubik/static/Rubik-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-rubik",
  display: "swap",
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

