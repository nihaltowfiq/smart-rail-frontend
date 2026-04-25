/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { getUser, User } from "@/lib/auth";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function useUser() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    setUser(getUser());
  }, [setUser, pathname]);

  return user;
}
