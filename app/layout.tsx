import type { Metadata, Viewport } from "next";
import "../styles/base/globals.scss";

export const metadata: Metadata = {
  title: {
    default: "CIRCLE — Creative full-cycle agency",
    template: "%s | CIRCLE",
  },
  description:
    "Creative full-cycle agency where marketing and design unlock the creative and conceptual potential of brands.",
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
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
