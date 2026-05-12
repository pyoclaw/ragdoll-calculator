"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Label element with default layout and disabled-state utility classes.
 *
 * @param className - Additional CSS class names to merge with the component's defaults
 * @param props - Remaining standard `<label>` props forwarded to the underlying element
 * @returns A `<label>` element with merged class names, `data-slot="label"`, and disabled/peer-disabled styling applied
 */
function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }
