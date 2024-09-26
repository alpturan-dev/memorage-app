import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"
import { twJoin } from "tailwind-merge"

const Progress = React.forwardRef(({ className, value, indicatorColor, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800",
      className
    )}
    {...props}>
    <ProgressPrimitive.Indicator
      className={twJoin(
        indicatorColor,
        "h-full w-full flex-1 bg-gray-900 transition-all dark:bg-gray-50"
      )}
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }} />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
