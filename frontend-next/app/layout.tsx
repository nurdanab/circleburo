import { Footer, Header } from "@/app/components";
import type { Metadata, Viewport } from "next";
import "./styles/base/globals.scss";

export const metadata: Metadata = {
  title: {
    default: "CIRCLE — Креативное агентство полного цикла",
    template: "%s | CIRCLE",
  },
  description:
    "Креативное агентство полного цикла, где маркетинг, дизайн раскрывает креативный и концептуальный потенциал брендов.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFFCF0",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
