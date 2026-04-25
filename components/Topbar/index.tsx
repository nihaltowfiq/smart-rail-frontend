"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import Link from "next/link"

type MenuItem = {
  label: string
  href: string
}

type User = {
  name: string
} | null

interface TopbarProps {
  menuItems?: MenuItem[]
  user?: User
  onSignIn?: () => void
  onSignOut?: () => void
}

export function Topbar({
  menuItems = [
    { label: "Home", href: "/" },
    { label: "My Bookings", href: "/bookings" },
    { label: "Train Information", href: "/trains" },
  ],
  user,
  onSignIn,
  onSignOut,
}: TopbarProps) {
  return (
    <div className="w-full border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Left: Brand */}
        <Link href="/" className="text-xl font-semibold tracking-tight">
          SmartRail
        </Link>

        {/* Middle: Menu */}
        <div className="hidden items-center gap-6 md:flex">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right: Auth */}
        <div className="flex items-center gap-2">
          {!user ? (
            <Button onClick={onSignIn}>Sign In</Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {user.name} <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onSignOut}
                  className="text-red-500 focus:text-red-500"
                >
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )
}
