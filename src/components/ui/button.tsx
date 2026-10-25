import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-platinum font-semibold text-canvas shadow-[0_1px_12px_rgba(255,255,255,0.08)] hover:bg-[#E2E8F0]",
        secondary:
          "border border-hairline bg-elevated text-platinum hover:border-white/20 hover:bg-card",
        outline:
          "bg-card border border-hairline text-platinum hover:border-white/20 hover:bg-emerald/5",
        ghost: "text-mist hover:bg-white/5 hover:text-platinum",
        link: "text-emerald underline-offset-4 hover:underline",
        whatsapp: "bg-emerald text-on-emerald hover:bg-emerald-bright",
      },
      size: {
        default: "h-11 px-5 py-2.5 min-h-[44px]",
        sm: "h-9 px-3 text-xs min-h-[36px]",
        lg: "h-12 px-8 text-base min-h-[48px]",
        icon: "h-11 w-11 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
