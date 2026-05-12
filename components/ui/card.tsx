import * as React from "react"

import { cn } from "@/lib/utils"

/**
 * Renders a styled card container element with configurable size.
 *
 * The root element includes `data-slot="card"` and a `data-size` attribute, merges provided
 * `className` with the component's base styling, and forwards any other `div` props.
 *
 * @param className - Additional CSS classes to merge with the component's base styles
 * @param size - Visual size of the card; `"sm"` applies tighter spacing, `"default"` applies the standard spacing
 * @returns The card container `div` element
 */
function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card flex flex-col gap-4 overflow-hidden rounded-xl bg-card py-4 text-sm text-card-foreground ring-1 ring-foreground/10 has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:gap-3 data-[size=sm]:py-3 data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the card header container used to hold a card's heading and related elements.
 *
 * @returns A `<div>` element with `data-slot="card-header"` and the component's header classes merged with any `className` passed in.
 */
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-4 group-data-[size=sm]/card:px-3 has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-4 group-data-[size=sm]/card:[.border-b]:pb-3",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the title area for a Card with heading typography and responsive sizing.
 *
 * @param className - Additional CSS classes to merge with the component's base styles
 * @param props - Additional props spread onto the root `div`
 * @returns The root `div` element representing the card title
 */
function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders the card's descriptive text area.
 *
 * @returns A <div> element with small, muted text and `data-slot="card-description"`.
 */
function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

/**
 * Renders the card action container positioned to the side of the card.
 *
 * Accepts standard div props and merges a provided `className` with the component's layout/positioning classes. The root element has `data-slot="card-action"`.
 *
 * @returns A `div` element for hosting card actions with the component's layout classes applied.
 */
function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className
      )}
      {...props}
    />
  )
}

/**
 * Renders a container element for card body content.
 *
 * Applies horizontal padding, sets `data-slot="card-content"`, merges provided `className` with the default classes, and forwards all other props to the root `div`.
 *
 * @param props - Props forwarded to the root `div`; `className` will be merged with the component's base classes.
 * @returns The rendered `div` element used as card content.
 */
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-4 group-data-[size=sm]/card:px-3", className)}
      {...props}
    />
  )
}

/**
 * Renders the card footer container used to host actions or metadata.
 *
 * @returns A `<div>` element styled as the card footer with layout, top border, muted background, padding, and any provided `className`.
 */
function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t bg-muted/50 p-4 group-data-[size=sm]/card:p-3",
        className
      )}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
