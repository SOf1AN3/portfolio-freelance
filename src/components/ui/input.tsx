import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-md border border-hairline bg-deep px-3 py-2.5 font-mono text-sm text-platinum transition-colors duration-200",
        "placeholder:text-fog focus:border-emerald focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald/70 aria-invalid:border-danger",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
