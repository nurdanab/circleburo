// Root layout - redirects are handled by middleware
// This layout exists only for technical reasons

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
