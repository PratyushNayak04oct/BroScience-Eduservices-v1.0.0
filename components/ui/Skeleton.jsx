import { cn } from "@/lib/utils";

export default function Skeleton({ className, ...props }) {
  return <div className={cn("bs-skeleton", className)} aria-hidden="true" {...props} />;
}
