import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants, type Button } from "@/components/ui/button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  )
}

type DataPaginationProps = {
  activePage: number
  itemCount: number
  numberItemsPerPage?: number
  onPageChange: (page: number) => void
}

function DataPagination({
  activePage,
  itemCount,
  numberItemsPerPage = 10,
  onPageChange,
}: DataPaginationProps) {
  const pageCount = Math.ceil(itemCount / numberItemsPerPage)

  if (pageCount <= 1) return null

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault()
    if (activePage > 1) onPageChange(activePage - 1)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    if (activePage < pageCount) onPageChange(activePage + 1)
  }

  const btnBase =
    "inline-flex size-9 items-center justify-center rounded-lg bg-[#F9F9F9] no-underline transition-colors hover:bg-gray-200 focus-visible:outline focus-visible:ring-2 focus-visible:ring-ring"
  const activeBtn = "border border-[#A08050]"
  const arrowEnabled = "text-[#343a40]"
  const arrowDisabled = "pointer-events-none text-[#adb5bd]"

  return (
    <Pagination className="py-6">
      <PaginationContent className="gap-2">
        <PaginationItem>
          <a
            href="#"
            role="button"
            aria-label="Go to previous page"
            onClick={handlePrev}
            aria-disabled={activePage === 1}
            className={cn(
              btnBase,
              activePage === 1 ? arrowDisabled : arrowEnabled
            )}
          >
            <ChevronLeftIcon className="size-4 shrink-0" />
          </a>
        </PaginationItem>

        <PaginationItem>
          <span
            role="status"
            aria-current="page"
            className={cn(btnBase, activeBtn)}
          >
            {activePage}
          </span>
        </PaginationItem>

        <PaginationItem>
          <span className="flex size-9 items-center justify-center text-[#888888] text-sm">
            / {pageCount}
          </span>
        </PaginationItem>

        <PaginationItem>
          <a
            href="#"
            role="button"
            aria-label="Go to next page"
            onClick={handleNext}
            aria-disabled={activePage === pageCount}
            className={cn(
              btnBase,
              activePage === pageCount ? arrowDisabled : arrowEnabled
            )}
          >
            <ChevronRightIcon className="size-4 shrink-0" />
          </a>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  DataPagination,
}
