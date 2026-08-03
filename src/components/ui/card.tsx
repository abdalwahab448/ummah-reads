import { cn } from "@/lib/utils";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.15rem] border border-[#c9a15e]/20 bg-[linear-gradient(145deg,rgba(10,23,19,0.98),rgba(6,14,11,0.98))] p-5 text-[var(--cream)] shadow-[0_24px_60px_-35px_rgba(0,0,0,0.95)]",
        className
      )}
      {...props}
    />
  );
}