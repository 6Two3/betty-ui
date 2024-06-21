import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "react-toastify/dist/ReactToastify.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Betty",
  description: "Betty is a UI library for React",
};

const bgStyle = {
  backgroundColor: "#0f212e",
  width: "100%",
  height: "100%",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className} style={bgStyle}>
        {children}
      </body>
    </html>
  );
}
