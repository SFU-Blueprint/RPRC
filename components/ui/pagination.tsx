import * as React from "react"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants, type Button } from "@/components/ui/Button"

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

  const windowSize = 5
  const shouldShift = activePage > windowSize
  const windowEnd = shouldShift
    ? Math.min(activePage, pageCount)
    : Math.min(windowSize, pageCount)
  const windowStart = Math.max(windowEnd - (windowSize - 1), 1)

  if (pageCount <= 1) return null

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault()
    if (activePage > 1) onPageChange(activePage - 1)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault()
    if (activePage < pageCount) onPageChange(activePage + 1)
  }

  return (
    <Pagination className="py-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={handlePrev}
            aria-disabled={activePage === 1}
            className={cn(
              activePage === 1 && "pointer-events-none opacity-50"
            )}
          />
        </PaginationItem>

        {Array.from({ length: Math.min(windowSize, pageCount) }).map(
          (_, index) => {
            const pageNumber = windowStart + index
            const isActive = activePage === pageNumber

            return (
              <PaginationItem key={pageNumber}>
                <PaginationLink
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    onPageChange(pageNumber)
                  }}
                  isActive={isActive}
                  size="icon"
                  role="button"
                >
                  {pageNumber}
                </PaginationLink>
              </PaginationItem>
            )
          }
        )}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={handleNext}
            aria-disabled={activePage === pageCount}
            className={cn(
              activePage === pageCount && "pointer-events-none opacity-50"
            )}
          />
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
