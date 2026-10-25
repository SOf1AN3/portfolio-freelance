import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-sm border border-hairline bg-white/5 px-2 py-0.5 font-mono text-[11px] uppercase tracking-widest transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald",
  {
    variants: {
      variant: {
        default: "text-platinum",
        secondary: "bg-elevated text-mist",
        outline: "bg-transparent text-mist",
        success:
          "border-emerald/30 bg-emerald/10 text-emerald before:inline-block before:h-1.5 before:w-1.5 before:animate-ping before:rounded-full before:bg-emerald before:content-['']",
        muted: "bg-white/5 text-fog",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
