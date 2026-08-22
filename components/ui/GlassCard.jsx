import { cn } from "@/lib/utils";

export default function GlassCard({
  children,
  className,
  interactive = false,
  as: Component = "div",
  ...props
}) {
  return (
    <Component
      className={cn(
        "glass-panel relative overflow-hidden rounded-2xl",
        interactive &&
          "group/card cursor-pointer transition-transform duration-500 ease-out hover:-translate-y-1.5",
        className
      )}
      {...props}
    >
      {interactive && (
        <span
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
          style={{
            background:
              "linear-gradient(135deg, rgba(201,168,77,0.12), transparent 42%, rgba(107,29,38,0.08))",
          }}
          aria-hidden="true"
        />
      )}
      {children}
    </Component>
  );
}
