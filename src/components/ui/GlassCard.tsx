type GlassCardProps = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return <div className={className}>{children}</div>;
}
