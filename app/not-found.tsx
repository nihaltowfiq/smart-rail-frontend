"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        {/* 404 Title */}
        <h1 className="text-6xl font-bold tracking-tight">404</h1>

        {/* Message */}
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sorry, we couldn’t find the page you’re looking for.
        </p>

        {/* Action */}
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
