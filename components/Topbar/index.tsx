"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { clearUser } from "@/lib/auth";
import { useUser } from "@/lib/hooks/useUser";
import {
  ChevronDown,
  Home,
  Info,
  LogOut,
  Menu,
  Ticket,
  Train,
  User,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const menuItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "My Bookings", href: "/bookings", icon: Ticket },
  { label: "Train Info", href: "/trains", icon: Info },
];

export function Topbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const user = useUser();

  const handleSignOut = () => {
    clearUser();
    router.push("/signin");
  };

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="w-full border-b border-purple-100 bg-linear-to-r from-white via-purple-50 to-blue-50 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="flex items-center gap-2 transition-all hover:opacity-80"
        >
          <div className="flex items-center justify-center rounded-lg bg-linear-to-br from-purple-600 to-blue-600 p-2">
            <Train className="h-5 w-5 text-white" />
          </div>
          <span className="bg-linear-to-r from-purple-600 to-blue-600 bg-clip-text text-xl font-bold text-transparent">
            SmartRail
          </span>
        </Link>

        {user?.token && (
          <div className="hidden items-center gap-8 md:flex">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-2 text-sm font-medium transition-all active:scale-95 ${
                    active
                      ? "text-purple-600"
                      : "text-gray-700 hover:text-purple-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {active && (
                    <div className="h-1 w-1 rounded-full bg-linear-to-r from-purple-600 to-blue-600" />
                  )}
                </Link>
              );
            })}
          </div>
        )}

        <div className="flex items-center gap-3">
          {!user ? (
            <Button
              onClick={() => router.push("/signin")}
              className="hidden bg-linear-to-r from-purple-600 to-purple-700 font-medium text-white hover:from-purple-700 hover:to-purple-800 md:inline-flex"
            >
              Sign In
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-purple-200 bg-white hover:bg-purple-50"
                >
                  <User className="mr-2 h-4 w-4" />
                  {user?.name || "User"}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="flex items-center gap-2 text-red-500 focus:bg-red-50 focus:text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {user?.token && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex items-center justify-center rounded-lg p-2 hover:bg-purple-100 md:hidden"
            >
              <Menu className="h-5 w-5 text-gray-700" />
            </button>
          )}
        </div>
      </div>

      {user?.token && mobileMenuOpen && (
        <div className="border-t border-purple-100 bg-linear-to-b from-purple-50 to-blue-50 md:hidden">
          <div className="space-y-1 px-4 py-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    active
                      ? "bg-gradient-to-r from-purple-100 to-blue-100 text-purple-600"
                      : "text-gray-700 hover:bg-white hover:text-purple-600"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
