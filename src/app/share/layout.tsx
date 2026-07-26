/**
 * Dedicated layout for /share route.
 * This overrides the root layout's static OG meta tags so that
 * the share page's dynamic generateMetadata() is the sole source.
 */
export default function ShareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
