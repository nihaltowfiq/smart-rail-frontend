/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { clearUser, getUser } from "@/lib/auth";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "../types";

export function useUser() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = Cookies.get("auth_token");

    if (!token) {
      clearUser();
      setUser(null);
      return;
    }

    setUser(getUser());
  }, [setUser, pathname]);

  return user;
}
